"use server";

export const handleForm = async (prevState: any, formData: FormData) => {
  console.log(prevState);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return {
    errors: ["wrong password 1", "wrong password 2"],
  };
};
