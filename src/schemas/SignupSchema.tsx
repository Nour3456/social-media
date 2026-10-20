import * as zod from "zod";
import { regex } from "../utils/regex";
import { getAge } from "../utils/helpers";



export const SignupSchema = zod.object({
  name: zod
    .string()
    .nonempty("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be at most 20 characters"),

  email: zod
    .string()
    .nonempty("Email is required")
    .regex(regex.email, "Invalid email address"),

  password: zod
    .string()
    .nonempty("Password is required")
    .regex(
      regex.password,
      "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
    ),
  rePassword: zod.string().nonempty("Please confirm your password"),

  dateOfBirth: zod
    .string()
    .nonempty("Date of birth is required")
    .refine((date) => getAge(date) >= 18, {
      message: "Age must be at least 18",
    }),
  gender: zod
    .string()
    .nonempty("Gender is required")
    .regex(regex.gender, "Gender must be either male or female")
}).refine((data) => data.password === data.rePassword, {
  message: "Passwords do not match",
  path: ["rePassword"],
});