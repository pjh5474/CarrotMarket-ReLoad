"use server";

import { Vonage } from "@vonage/server-sdk";
import { Auth } from "@vonage/auth";
import crypto from "crypto";
import { z } from "zod";
import validator from "validator";
import {
  VALIDATION_TOKEN_MAX_LENGTH,
  VALIDATION_TOKEN_MIN_LENGTH,
} from "@/lib/constants";
import { redirect } from "next/navigation";
import db from "@/lib/database";
import sessionLogin from "@/lib/session-login";

let UserPhoneNumber: string;

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone number format"
  );

async function tokenExists(token: number) {
  const smsToken = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
      phone: true,
    },
  });

  return Boolean(smsToken && smsToken?.phone === UserPhoneNumber);
}

const tokenSchema = z.coerce
  .number()
  .min(VALIDATION_TOKEN_MIN_LENGTH)
  .max(VALIDATION_TOKEN_MAX_LENGTH)
  .refine(
    tokenExists,
    "This token does not exist or not for your phone number."
  );

interface ActionState {
  token: boolean;
  phone: string;
}

async function getToken() {
  const token = crypto
    .randomInt(VALIDATION_TOKEN_MIN_LENGTH, VALIDATION_TOKEN_MAX_LENGTH)
    .toString();

  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });
  if (exists) {
    return getToken();
  } else {
    return token;
  }
}

const credentials = new Auth({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

export async function smsLogIn(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        phone: "",
        error: result.error.flatten(),
      };
    } else {
      // delete prev token
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });
      // create token
      const token = await getToken();
      await db.sMSToken.create({
        data: {
          token,
          phone: result.data,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });

      // send the token using vonage
      const vonage = new Vonage(credentials);
      await vonage.sms
        .send({
          to: process.env.MY_PHONE_NUMBER!,
          //to: result.data,
          from: process.env.VONAGE_SMS_FROM!,
          text: `Your Karrot verification code is: ${token}`,
        })
        .then((resp) => {
          console.log("Message sent successfully");
          console.log(resp);
        })
        .catch((err) => {
          console.log("There was an error sending the messages.");
          console.error(err);
        });
      return {
        token: true,
        phone: result.data,
      };
    }
  } else {
    UserPhoneNumber = prevState.phone;
    const result = await tokenSchema.safeParseAsync(token);
    if (!result.success) {
      return {
        token: true,
        phone: UserPhoneNumber,
        error: result.error.flatten(),
      };
    } else {
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
          phone: UserPhoneNumber,
        },
        select: {
          id: true,
          userId: true,
        },
      });

      await sessionLogin(token!.userId);
      await db.sMSToken.delete({
        where: {
          id: token!.id,
        },
      });

      redirect("/profile");
    }
  }
}
