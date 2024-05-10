import getSession from "./session";

export default async function sessionLogin(userId: number) {
  const session = await getSession();
  session.id = userId;
  await session.save();
}
