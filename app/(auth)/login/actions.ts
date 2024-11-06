"use server";

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
} from "@/lib/constants";
import db from "@/lib/database";
import {
  LOGIN_ERROR_MESSAGE,
  PASSWORD_LENGTH_ERROR_MESSAGE,
  PASSWORD_REGEX_ERROR_MESSAGE,
} from "@/lib/errors";
import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import sessionLogin from "@/lib/session-login";

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, LOGIN_ERROR_MESSAGE),
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
  const result = await formSchema.spa(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    const ok = await bcrypt.compare(
      result.data.password,
      user!.password ?? "xxxx"
    );
    if (ok) {
      await sessionLogin(user!.id);
      redirect("/profile");
    } else {
      return {
        fieldErrors: {
          password: [LOGIN_ERROR_MESSAGE],
          email: [],
        },
      };
    }
  }
};
