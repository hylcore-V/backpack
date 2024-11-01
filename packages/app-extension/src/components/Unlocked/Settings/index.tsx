import { Suspense } from "react";
import { useTranslation } from "@coral-xyz/i18n";
import { List, ListItem, PushDetail } from "@coral-xyz/react-common";
import { userClientAtom } from "@coral-xyz/recoil";
import { useTheme } from "@coral-xyz/tamagui";
import {
  AccountCircleOutlined,
  Lock,
  Search,
  Settings,
} from "@mui/icons-material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { IconButton, Typography } from "@mui/material";
import { useNavigation } from "@react-navigation/native";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { Routes } from "../../../refactor/navigation/SettingsNavigator";

import { AvatarHeader } from "./AvatarHeader/AvatarHeader";

export function SettingsButton() {
  return (
    <div style={{ display: "flex" }}>
      <SearchButton />
    </div>
  );
}

function SearchButton() {
  const theme = useTheme();
  return (
    <IconButton
      disableRipple
      sx={{
        padding: 0,
        width: "24px",
        "&:hover": {
          background: "transparent",
        },
      }}
      size="large"
      onClick={() => {
        document.dispatchEvent(
          new KeyboardEvent("keydown", { key: "k", metaKey: true })
        );
      }}
    >
      <Search
        style={{
          color: theme.baseIcon.val,
          backgroundColor: "transparent",
          borderRadius: "12px",
        }}
      />
    </IconButton>
  );
}

// TODO remove this.
export function SettingsMenu() {
  /*
  const nav = useNavigation();

  useEffect(() => {
    nav.setOptions({ headerTitle: "" });
  }, [nav]);
	*/
  return (
    <Suspense fallback={<div />}>
      <_SettingsContent />
    </Suspense>
  );
}

export function _SettingsContent() {
  return (
    <div>
      <AvatarHeader />
      <SettingsList />
    </div>
  );
}

function SettingsList() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const userClient = useRecoilValue(userClientAtom);
  const { t } = useTranslation();

  const lockWallet = () => {
    userClient.lockKeyring();
  };

  const walletsMenu = [
    {
      label: t("wallets"),
      onClick: () => navigation.push(Routes.WalletsScreen),
      icon: (props: any) => <AccountBalanceWalletIcon {...props} />,
      detailIcon: <PushDetail />,
    },
  ];

  const settingsMenu: {
    label: string;
    onClick: () => any;
    icon: (props: any) => React.ReactNode;
    detailIcon: React.ReactNode;
  }[] = [
    {
      label: t("your_account"),
      onClick: () => navigation.push(Routes.YourAccountScreen),
      icon: (props) => <AccountCircleOutlined {...props} />,
      detailIcon: <PushDetail />,
    },
    {
      label: t("preferences"),
      onClick: () => navigation.push(Routes.PreferencesScreen),
      icon: (props) => <Settings {...props} />,
      detailIcon: <PushDetail />,
    },
  ];

  settingsMenu.push({
    label: t("lock"),
    onClick: () => lockWallet(),
    icon: (props) => <Lock {...props} />,
    detailIcon: null,
  });

  const aboutList = [
    {
      label: t("about_Backpack"),
      onClick: () => navigation.push(Routes.AboutScreen),
      icon: null,
      detailIcon: <PushDetail />,
    },
  ];

  return (
    <>
      <List
        style={{
          marginTop: "24px",
          marginBottom: "16px",
          border: `${theme.baseBorderLight.val}`,
          borderRadius: "10px",
        }}
      >
        {walletsMenu.map((s, idx) => {
          return (
            <ListItem
              key={s.label}
              isFirst={idx === 0}
              isLast={idx === walletsMenu.length - 1}
              onClick={s.onClick}
              id={s.label}
              style={{
                height: "44px",
                padding: "12px",
              }}
              detail={s.detailIcon}
            >
              <div
                style={{
                  display: "flex",
                  flex: 1,
                }}
              >
                {s.icon({
                  style: {
                    color: theme.baseIcon.val,
                    height: "24px",
                    width: "24px",
                  },
                  fill: theme.baseIcon.val,
                })}
                <Typography
                  style={{
                    marginLeft: "8px",
                    fontWeight: 500,
                    fontSize: "16px",
                    lineHeight: "24px",
                  }}
                >
                  {s.label}
                </Typography>
              </div>
            </ListItem>
          );
        })}
      </List>
      <List
        style={{
          marginTop: "12px",
          marginBottom: "16px",
          border: `${theme.baseBorderLight.val}`,
          borderRadius: "10px",
        }}
      >
        {settingsMenu.map((s, idx) => {
          return (
            <ListItem
              key={s.label}
              isFirst={idx === 0}
              isLast={idx === settingsMenu.length - 1}
              onClick={s.onClick}
              id={s.label}
              style={{
                height: "44px",
                padding: "12px",
              }}
              detail={s.detailIcon}
            >
              <div
                style={{
                  display: "flex",
                  flex: 1,
                }}
              >
                {s.icon({
                  style: {
                    color: theme.baseIcon.val,
                    marginRight: "8px",
                    height: "24px",
                    width: "24px",
                  },
                  fill: theme.baseIcon.val,
                })}
                <Typography
                  style={{
                    fontWeight: 500,
                    fontSize: "16px",
                    lineHeight: "24px",
                  }}
                >
                  {s.label}
                </Typography>
              </div>
            </ListItem>
          );
        })}
      </List>
      <List
        style={{
          marginTop: "12px",
          marginBottom: "16px",
          border: `${theme.baseBorderLight.val}`,
          borderRadius: "10px",
        }}
      >
        {aboutList.map((s, idx) => {
          return (
            <ListItem
              key={s.label}
              isFirst={idx === 0}
              isLast={idx === aboutList.length - 1}
              onClick={s.onClick}
              id={s.label}
              style={{
                height: "44px",
                padding: "12px",
              }}
              detail={s.detailIcon}
            >
              <div
                style={{
                  display: "flex",
                  flex: 1,
                }}
              >
                <Typography
                  style={{
                    marginLeft: "8px",
                    fontWeight: 500,
                    fontSize: "16px",
                    lineHeight: "24px",
                  }}
                >
                  {s.label}
                </Typography>
              </div>
            </ListItem>
          );
        })}
      </List>
    </>
  );
}
