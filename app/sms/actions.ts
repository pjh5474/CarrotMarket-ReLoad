"use server";

import { z } from "zod";
import validator from "validator";
import {
  VALIDATION_TOKEN_MAX_LENGTH,
  VALIDATION_TOKEN_MIN_LENGTH,
} from "@/lib/constants";

const phoneSchema = z.string().trim().refine(validator.isMobilePhone);
const tokenSchema = z.coerce
  .number()
  .min(VALIDATION_TOKEN_MIN_LENGTH)
  .max(VALIDATION_TOKEN_MAX_LENGTH);

export async function smsLogin(prevState: any, formData: FormData) {
  const data = {};
}
