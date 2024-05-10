import db from "@/lib/database";
import getAccessToken from "@/lib/oauth/github/getAccessToken";
import getGithubEmail from "@/lib/oauth/github/getGithubEmail";
import getGithubUser from "@/lib/oauth/github/getGithubUser";
import sessionLogin from "@/lib/session-login";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return notFound();
  }
  const { error, access_token } = await getAccessToken(code);
  if (error) {
    return new Response(null, {
      status: 400,
    });
  }
  const { github_id, avatar_url, username } = await getGithubUser(access_token);
  const github_email = await getGithubEmail(access_token);
  const user = await db.user.findUnique({
    where: {
      github_id,
    },
    select: {
      id: true,
    },
  });
  if (user) {
    await sessionLogin(user.id);
    return redirect("/profile");
  }
  const newUser = await db.user.create({
    data: {
      github_id,
      avatar: avatar_url,
      username,
      github_email,
    },
    select: {
      id: true,
    },
  });
  await sessionLogin(newUser.id);
  return redirect("/profile");
}
