import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useContext } from "react";
import { authContext } from "../contexts/AuthContext";

export default function MainLayout() {
  const { isLoading } = useContext(authContext);

  return isLoading ? (
  <h1>is loading...</h1>
  ) : (
    <div>
      <Navbar />

      <Outlet />
    </div>
  );
}
