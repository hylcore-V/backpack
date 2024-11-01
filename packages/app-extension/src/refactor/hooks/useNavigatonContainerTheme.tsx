import { useTheme } from "@coral-xyz/tamagui";
import { DefaultTheme } from "@react-navigation/native";

export function useNavigationContainerTheme() {
  const baseTheme = useTheme();
  const BackpackTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: baseTheme.baseTextHighEmphasis.val,
      text: baseTheme.baseTextHighEmphasis.val,
      background: baseTheme.baseBackgroundL0.val,
      card: baseTheme.baseBackgroundL0.val,
    },
  };
  return BackpackTheme;
}
