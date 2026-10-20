// 1- create context

import { createContext, useEffect, useState, type ReactElement } from "react";
import { AuthService } from "../services/authService";

export const authContext = createContext<any>({});

// 2- create context provider (components, data)
export default function AuthContextProvider({
  children,
}: {
  children: ReactElement;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [UserData, setUserData] = useState();
  const [isLoading, setisLoading] = useState(true)

  async function getUserData() {
    try {
      const { data } = await AuthService.getUserData();
      setUserData(data.user);
      setIsLoggedIn(true)
      setisLoading(false)
    } catch (error) {
        setIsLoggedIn(false)
        localStorage.removeItem("token")
        setisLoading(false)
    }
  }
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserData();
    }else{
        setisLoading(false)
    }
  }, [isLoggedIn]);

  return (
    <authContext.Provider value={{ isLoggedIn, setIsLoggedIn, isLoading, UserData }}>
      {children}
    </authContext.Provider>
  );
}
