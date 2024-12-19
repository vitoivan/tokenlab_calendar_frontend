import { LS_THEME } from "@/utils/constants";
import { AuthProvider } from "./auth-context/auth-context";
import { ThemeProvider } from "./theme-context";

type Props = {
  children: JSX.Element
}


export function ContextProviders({ children }: Props) {
  return (
    <> <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey={LS_THEME}>
        {children}
      </ThemeProvider>
    </AuthProvider>
    </>
  );
}
