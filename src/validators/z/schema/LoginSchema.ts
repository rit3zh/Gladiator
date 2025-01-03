import { z } from "zod";

interface IState {
  error: string | null;
}

const emailSchema = z
  .string()
  .min(1, { message: "Email is required" })
  .email({ message: "Invalid email address" });

const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long" });

export const passwordValidator = <T extends string>(password: T): IState => {
  try {
    passwordSchema.parse(password);
    return {
      error: null,
    };
  } catch (error: any | void) {
    return {
      error: (error as z.ZodError).issues[0]?.message || null,
    };
  }
};

export const emailValidator = <T extends string>(email: T): IState => {
  try {
    emailSchema.parse(email);
    return {
      error: null,
    };
  } catch (error: any | void) {
    return {
      error: (error as z.ZodError).issues[0]?.message || null,
    };
  }
};
