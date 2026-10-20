import { Alert, Button, Input, Select, SelectItem } from "@heroui/react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { getInputProps } from "../utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "../schemas/SignupSchema";
import axios from "axios";
import { useState } from "react";
import { AuthService } from "../services/authService";
import type { RegisterData } from "../types/registerData";

export default function SignUp() {

  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();



  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    resolver: zodResolver(SignupSchema),
  });

  async function SignUp(values: RegisterData) {
    // validation
    // send request to backend
     setSuccessMsg("");
      setErrMsg("");
      setIsLoading(true);
    try {
    const data = await AuthService.signUp(values);
   
     setSuccessMsg(data.message);
      setIsLoading(false);
      navigate("/signin");
    
    } catch (error:any) {
      setErrMsg(error.response.data.message);
       setIsLoading(false);
     
    }
  }

  return (
    <form onSubmit={handleSubmit(SignUp)}>
      <div className="grid gap-4">
        <div className="grid gap-3 text-center">
          <h1>Sign up</h1>
        </div>

        <Input
          {...register("name")}
          {...getInputProps("text", "Full Name")}
          errorMessage={errors.name?.message}
          isInvalid={!!errors.name?.message}
        />

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

        <Input
          {...register("rePassword")}
          {...getInputProps("password", "Confirm Password")}
          errorMessage={errors.rePassword?.message}
          isInvalid={!!errors.rePassword?.message}
        />

        <Input
          {...register("dateOfBirth")}
          {...getInputProps("date", "Date of Birth")}
          errorMessage={errors.dateOfBirth?.message}
          isInvalid={!!errors.dateOfBirth?.message}
        />

        <Select
          variant="bordered"
          label="Gender"
          {...register("gender", {
            required: "Gender is required",
            pattern: {
              value: /^(male|female)$/,
              message: "Gender must be either male or female",
            },
          })}
          {...getInputProps(undefined, "Gender")}
          errorMessage={errors.gender?.message}
          isInvalid={!!errors.gender?.message}
        >
          <SelectItem key="male">Male</SelectItem>
          <SelectItem key="female">Female</SelectItem>
        </Select>

        <Button isLoading={isLoading} variant="solid" type="submit" color="primary">
          Sign Up
        </Button>
        <p>
          Already have an account? <Link to={"/signin"}>Login now</Link>
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
