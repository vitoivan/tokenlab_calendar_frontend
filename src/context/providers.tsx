import { AuthProvider } from "./auth-context/auth-context";

type Props = {
  children: JSX.Element
}


export function ContextProviders({ children }: Props) {
  return (
    <>
      <AuthProvider>
        {children}
      </AuthProvider>
    </>
  );
}
