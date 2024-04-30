"use server";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "@/lib/constants";
import db from "@/lib/database";
import {
  EMAIL_UNIQUE_ERROR_MESSAGE,
  PASSWORD_CHECK_ERROR_MESSAGE,
  PASSWORD_LENGTH_ERROR_MESSAGE,
  PASSWORD_REGEX_ERROR_MESSAGE,
  REQUIRED_ERROR_MESSAGE,
  USERNAME_LENGTH_ERROR_MESSAGE,
  USERNAME_UNIQUE_ERROR_MESSAGE,
} from "@/lib/errors";
import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkPasswords = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => password === confirmPassword;

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};

const formSchema = z
  .object({
    username: z
      .string({
        required_error: REQUIRED_ERROR_MESSAGE("닉네임"),
      })
      .min(USERNAME_MIN_LENGTH, USERNAME_LENGTH_ERROR_MESSAGE)
      .max(USERNAME_MAX_LENGTH, USERNAME_LENGTH_ERROR_MESSAGE)
      .trim()
      .refine(checkUniqueUsername, USERNAME_UNIQUE_ERROR_MESSAGE),
    email: z
      .string({
        required_error: REQUIRED_ERROR_MESSAGE("이메일"),
      })
      .email()
      .toLowerCase()
      .refine(checkUniqueEmail, EMAIL_UNIQUE_ERROR_MESSAGE),
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
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    const session = await getSession();
    session.id = user.id;
    await session.save();
    redirect("/profile");
  }
}
