import { createContext } from "react";
import useLogin from "./useLogin";

export const LoginContext = createContext();

export function LoginProvider({ children }) {
  const { loggedIn, updateLoggedIn, setLoggedIn } = useLogin();
  return (
    /** macht die loggedIn Variable global verfügbar*/
    <LoginContext.Provider value={{ loggedIn, updateLoggedIn, setLoggedIn }}>
      {children}
    </LoginContext.Provider>
  );
}

export default LoginContext;
