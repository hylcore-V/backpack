import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function Panel({
  alt,
  icon,
  title,
  subtitle,
  href
}: {
  alt: string;
  icon: string;
  title: string;
  subtitle?: string;
  href?: string;
}) {
  const rootClasses = 'h-[88px] w-full rounded-xl bg-[#27272A]';

  const inner = (
    <div className="flex h-full items-center gap-4 p-6">
      <Image alt={alt} src={icon} height={40} width={40} />
      <div className="flex flex-col">
        <h4 className="text-lg font-bold tracking-wide">{title}</h4>
        {subtitle && <h5 className="text-xs tracking-wide">{subtitle}</h5>}
      </div>
    </div>
  );

  return href ? (
    <Link className={rootClasses} href={href ?? ''} target="_blank" rel="noopener noreferrer">
      {inner}
    </Link>
  ) : (
    <div className={rootClasses}>{inner}</div>
  );
}

export default function Downloads() {
  return (
    <div className="text-[#F0F0F2]">
      <div className="mb-16 mt-[-25px] text-center">
        <h1 className="text-6xl font-extrabold text-white">Download</h1>
      </div>
      <div className="flex w-full flex-col-reverse items-center justify-center gap-14 px-4 md:flex-row md:items-start">
        <_DesktopSection />
        <_MobileSection />
      </div>
    </div>
  );
}

function _MobileSection() {
  return (
    <div className="flex w-full max-w-[360px] flex-col gap-6">
      <h2 className="text-[30px] font-bold tracking-wide">Mobile</h2>
      <Panel
        alt="ios-icon"
        icon="/brands/ios.svg"
        title="App Store"
        href="https://apps.apple.com/us/app/Backpack-crypto-wallet/id6445964121"
      />
      <Panel
        alt="android-icon"
        icon="/brands/android.svg"
        title="Google Play"
        href="https://play.google.com/store/apps/details?id=app.Backpack.mobile"
      />
      <AndroidAPKDownload />
    </div>
  );
}

type Res = {
  version: string;
  buildNumber: number;
  url: string;
};

function AndroidAPKDownload() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function get() {
      try {
        setLoading(true);
        const res: Promise<Res> = await fetch(`/api/apk-download-link`).then(r => r.json());
        setData(res);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    get();
  }, []);

  const subtitle = loading ? 'Loading...' : `Download ${data.version} (${data.buildNumber})`;
  const href = loading ? undefined : data.url;

  return (
    <Panel
      alt="android-apk-icon"
      icon="/brands/android.svg"
      title="Android APK"
      href={href}
      subtitle={subtitle}
    />
  );
}

function _DesktopSection() {
  return (
    <div className="flex w-full max-w-[360px] flex-col gap-6">
      <h2 className="text-[30px] font-bold tracking-wide">Desktop</h2>
      <Panel
        alt="chrome-icon"
        icon="/brands/chrome.svg"
        title="Chrome"
        href="https://chrome.google.com/webstore/detail/Backpack/aflkmfhebedbjioipglgcbcmnbpgliof"
      />
      <Panel
        alt="brave-icon"
        icon="/brands/brave.svg"
        title="Brave"
        href="https://chrome.google.com/webstore/detail/Backpack/aflkmfhebedbjioipglgcbcmnbpgliof"
      />
      <Panel
        alt="arc-icon"
        icon="/brands/arc.svg"
        title="Arc"
        href="https://chrome.google.com/webstore/detail/Backpack/aflkmfhebedbjioipglgcbcmnbpgliof"
      />
    </div>
  );
}
