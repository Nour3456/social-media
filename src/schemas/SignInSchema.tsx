import * as zod from "zod";
import { regex } from "../utils/regex";



export const SignInSchema = zod.object({

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
})