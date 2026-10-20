import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import Feed from "./pages/Feed";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import { HeroUIProvider } from "@heroui/react";
import ProtectedRoutes from "./protectedRoutes/ProtectedRoutes";
import ProtectedAuthRoutes from "./protectedRoutes/ProtectedAuthRoutes";
import CounterContextProvider from "./contexts/counterContext";
import AuthContextProvider from "./contexts/AuthContext";
const router = createBrowserRouter([
  {
    path: "",
    element: <AuthLayout />,
    children: [
      {
        path: "signin",
        element: (
          <ProtectedAuthRoutes>
            <SignIn />
          </ProtectedAuthRoutes>
        ),
      },
      {
        path: "signup",
        element: (
          <ProtectedAuthRoutes>
            <SignUp />
          </ProtectedAuthRoutes>
        ),
      },
    ],
  },
  {
    path: "",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoutes>
            <Feed />
          </ProtectedRoutes>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return (
    // 3- provide al app with the whole auth data howa 3amel login wala la w y2dr y3dl {isLoggedIn, setIsLoggedIn}
    <AuthContextProvider>
      <CounterContextProvider>
        <HeroUIProvider>
          <RouterProvider router={router}></RouterProvider>
        </HeroUIProvider>
      </CounterContextProvider>
    </AuthContextProvider>
  );
}

export default App;
