"use server";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "@/lib/constants";
import {
  PASSWORD_CHECK_ERROR_MESSAGE,
  PASSWORD_LENGTH_ERROR_MESSAGE,
  PASSWORD_REGEX_ERROR_MESSAGE,
  REQUIRED_ERROR_MESSAGE,
  USERNAME_LENGTH_ERROR_MESSAGE,
} from "@/lib/errors";
import { z } from "zod";

const checkPasswords = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => password === confirmPassword;

const formSchema = z
  .object({
    username: z
      .string({
        required_error: REQUIRED_ERROR_MESSAGE("닉네임"),
      })
      .min(USERNAME_MIN_LENGTH, USERNAME_LENGTH_ERROR_MESSAGE)
      .max(USERNAME_MAX_LENGTH, USERNAME_LENGTH_ERROR_MESSAGE)
      .trim(),
    email: z
      .string({
        required_error: REQUIRED_ERROR_MESSAGE("이메일"),
      })
      .email()
      .toLowerCase(),
    password: z
      .string({
        required_error: REQUIRED_ERROR_MESSAGE("비밀번호"),
      })
      .min(PASSWORD_MIN_LENGTH, PASSWORD_LENGTH_ERROR_MESSAGE)
      .max(PASSWORD_MAX_LENGTH, PASSWORD_LENGTH_ERROR_MESSAGE)
      .trim()
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR_MESSAGE),
    confirmPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, PASSWORD_LENGTH_ERROR_MESSAGE)
      .max(PASSWORD_MAX_LENGTH, PASSWORD_LENGTH_ERROR_MESSAGE),
  })
  .refine(checkPasswords, {
    message: PASSWORD_CHECK_ERROR_MESSAGE,
    path: ["confirmPassword"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };
  const result = formSchema.safeParse(data);
  if (!result.success) {
    console.log(result.error);
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
