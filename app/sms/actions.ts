"use server";

import { z } from "zod";
import validator from "validator";
import {
  VALIDATION_TOKEN_MAX_LENGTH,
  VALIDATION_TOKEN_MIN_LENGTH,
} from "@/lib/constants";
import { redirect } from "next/navigation";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone number format"
  );
const tokenSchema = z.coerce
  .number()
  .min(VALIDATION_TOKEN_MIN_LENGTH)
  .max(VALIDATION_TOKEN_MAX_LENGTH);

interface ActionState {
  token: boolean;
}

export async function smsLogIn(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      return {
        token: true,
      };
    }
  } else {
    const result = tokenSchema.safeParse(token);
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else {
      // Log In
      redirect("/");
    }
  }
}
