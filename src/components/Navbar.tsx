import {
  Navbar as HeroUiNavbar,
  NavbarBrand,
  NavbarContent,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  NavbarItem,
} from "@heroui/react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authContext } from "../contexts/AuthContext";
import { counterContext } from "../contexts/counterContext";

export default function Navbar() {
  const navigate = useNavigate();
  // const isUserLoggedIn: boolean = !!localStorage.getItem("token");
  const { counter } = useContext(counterContext);
  const {isLoggedIn,setIsLoggedIn , UserData}= useContext(authContext)
console.log(UserData);



  function logout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    // navigate("/signin");
  }

  return (
    <HeroUiNavbar>
      <NavbarBrand>
        <Link to={"/"}>
          <p className="font-bold text-inherit">CIRCLE {counter}</p>
        </Link>
      </NavbarBrand>

      <NavbarContent as="div" justify="end">
        {isLoggedIn ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name={"user name"}
                size="sm"
                src={UserData?.photo}
              />
            </DropdownTrigger>
            <DropdownMenu  aria-label="Profile Actions" variant="flat">
              <DropdownItem textValue="profile" key="profile">
                <Link className="h-14" to="/profile">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{UserData?.email}</p>
                </Link>
              </DropdownItem>
              <DropdownItem onPress={logout} key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <>
            <NavbarItem>
              <Link to={"/signin"}>SignIn</Link>
            </NavbarItem>
            <NavbarItem>
              <Link to={"/signup"}>SignUp</Link>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </HeroUiNavbar>
  );
}
