"use server";
import { z } from "zod";

const checkUsername = (username: string) => !username.includes("potato");
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
        invalid_type_error: "Username must be a string!",
        required_error: "Where is my username???",
      })
      .min(3, "Username 은 3 글자 이상, 10 글자 미만이어야 합니다.")
      .max(10, "Username 은 3 글자 이상, 10 글자 미만이어야 합니다.")
      .refine(checkUsername, "No potatoes allowed"),
    email: z.string().email(),
    password: z.string().min(8).max(20),
    confirmPassword: z.string().min(8).max(20),
  })
  .refine(checkPasswords, {
    message: "Password와 confromPassword가 일치하지 않습니다.",
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
    return result.error.flatten();
  }
}
