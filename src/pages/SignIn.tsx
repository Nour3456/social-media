import { Alert, Button, Input} from "@heroui/react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { getInputProps } from "../utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthService } from "../services/authService";
import { SignInSchema } from "../schemas/SignInSchema";
import type { LoginData } from "../types/loginData";
import { authContext } from "../contexts/AuthContext";

export default function SignIn() {

  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {setIsLoggedIn}= useContext(authContext)




  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
     
      email: "",
      password: "",
    },
    resolver: zodResolver(SignInSchema),
  });

  async function signIn(values: LoginData) {
    // validation
    // send request to backend
     setSuccessMsg("");
      setErrMsg("");
      setIsLoading(true);
    try {
    const data = await AuthService.signIn(values);
    setIsLoggedIn(true);
   
    localStorage.setItem("token", data.data.token);
    
   
     setSuccessMsg(data.message);
      setIsLoading(false);
      // navigate("/");
    
    } catch (error:any) {
      setErrMsg(error.response.data.message);
       setIsLoading(false);
     
    }
  }

  return (
    <form onSubmit={handleSubmit(signIn)}>
      <div className="grid gap-4">
        <div className="grid gap-3 text-center">
          <h1>Sign in</h1>
        </div>
        <Input
          {...register("email")}
          {...getInputProps("email", "Email")}
          errorMessage={errors.email?.message}
          isInvalid={!!errors.email?.message}
        />

        <Input
          {...register("password")}
          {...getInputProps("password", "Password")}
          errorMessage={errors.password?.message}
          isInvalid={!!errors.password?.message}
        />

        <Button isLoading={isLoading} variant="solid" type="submit" color="primary">
          Sign In
        </Button>
        <p>
        Dont have an account? <Link to={"/signup"}>Sign up now</Link>
        </p>
        {successMsg && (
          <Alert
            hideIcon
            color="success"
            title={successMsg}
            variant="faded"
          />
        )}
        {errMsg && (
        <Alert
          hideIcon
          color="danger"
          title={errMsg}
          variant="faded"
          classNames={{ base: "py-0 capitalize text-center" }}
        />
        )}
      </div>
    </form>
  );
}