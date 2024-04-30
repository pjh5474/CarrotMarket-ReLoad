"use server";

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
} from "@/lib/constants";
import {
  PASSWORD_LENGTH_ERROR_MESSAGE,
  PASSWORD_REGEX_ERROR_MESSAGE,
} from "@/lib/errors";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z
    .string({
      required_error: "비밀번호를 입력하세요.",
    })
    .trim()
    .min(PASSWORD_MIN_LENGTH, PASSWORD_LENGTH_ERROR_MESSAGE)
    .max(PASSWORD_MAX_LENGTH, PASSWORD_LENGTH_ERROR_MESSAGE)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR_MESSAGE),
});

export const login = async (prevState: any, formData: FormData) => {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
};
