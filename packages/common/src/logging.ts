import { MOBILE_CHANNEL_LOGS } from "./constants";
import * as cfg from "./generated-config";
import { isServiceWorker } from "./utils";

export function getLogger(mod: string) {
  if (_LOG_LEVEL === undefined) {
    setupLogLevel();
  }
  return (() => {
    const _mod = mod;
    const prefix = globalThis.___toApp
      ? "hidden-webview:"
      : isServiceWorker()
        ? "service-worker:"
        : "";
    return {
      debug: (str: string, ...args: any) =>
        debug(`Backpack:${prefix} ${_mod}: ${str}`, ...args),
      error: (str: string, ...args: any) =>
        error(`Backpack:${prefix} ${_mod}: ${str}`, ...args),
      _log,
    };
  })();
}

function debug(str: any, ...args: any) {
  if (_LOG_LEVEL <= LogLevel.Debug) {
    log(str, ...args);
  }
}

function error(str: any, ...args: any) {
  if (_LOG_LEVEL <= LogLevel.Error) {
    log(`ERROR: ${str}`, ...args);
  }
}

function log(str: any, ...args: any) {
  if (globalThis.___toApp) {
    _mobileLog(str, ...args);
  } else if (isServiceWorker()) {
    void _serviceWorkerLog(str, ...args);
  } else {
    _log(str, ...args);
  }
}

function _log(str: any, ...args: any) {
  console.log(str, ...args);
}

async function _serviceWorkerLog(...args: any[]) {
  // We're in the serviceworker, try sending the message to the HTML page.
  // @ts-expect-error
  const clients = await self.clients.matchAll({
    includeUncontrolled: true,
    type: "window",
  });
  clients.forEach((client) => {
    client.postMessage({
      channel: MOBILE_CHANNEL_LOGS,
      data: args,
    });
  });
}

function _mobileLog(...args: any[]) {
  // Disable logs in productions for performance reasons
  if (process.env.NODE_ENV === "production") {
    return;
  }
  // We're inside the hidden webview used by the mobile app, forward the
  // logs to the onMessage handler of the webview component in the app
  globalThis.___toApp({
    channel: MOBILE_CHANNEL_LOGS,
    data: args,
  });
}

let _LOG_LEVEL: LogLevel;
export enum LogLevel {
  Trace,
  Debug,
  Info,
  Warning,
  Error,
  None,
}

export function setupLogLevel() {
  _LOG_LEVEL = (() => {
    switch (cfg.BACKPACK_CONFIG_LOG_LEVEL) {
      case "trace":
        return LogLevel.Trace;
      case "debug":
        return LogLevel.Debug;
      case "info":
        return LogLevel.Info;
      case "warning":
        return LogLevel.Warning;
      case "error":
        return LogLevel.Error;
      case "none":
        return LogLevel.None;
      default:
        throw new Error("invalid log level");
    }
  })();
}

// Used for logflare.app debugging
export async function logflareDebug(msg: string, data?: object): Promise<void> {
  // app.Backpack.mobile source id
  const sourceId = "13f2dddf-4ad3-446f-8ebe-f16b4415483c";
  const apiKey = "g2jE0-ajd9Kf";
  const url = `https://api.logflare.app/api/logs?source=${sourceId}`;

  const time = new Date().toISOString().split("T")[1];
  const body = JSON.stringify({
    event_message: `${time} ${msg}`,
    ...data,
  });

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body,
    });
  } catch (error) {
    console.error("Failed to send log", error);
  }
}

export function logRender(name: string) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  console.log(`${name}:render ${new Date().toISOString()}`);
}
