import { useContext, type ReactElement } from 'react'
import { Navigate } from 'react-router-dom';
import { authContext } from '../contexts/AuthContext';

export default function ProtectedAuthRoutes({
  children,
}: {
  children: ReactElement;
}) {
    //  const isUserLoggedIn: boolean = !!localStorage.getItem("token");
     const {isLoggedIn}= useContext(authContext)
  return (
    <div>
        {isLoggedIn ? <Navigate to="/" /> : children}
    </div>
  )
}
