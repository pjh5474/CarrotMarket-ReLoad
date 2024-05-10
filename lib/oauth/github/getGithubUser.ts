interface IGithubUser {
  github_id: string;
  username: string;
  avatar_url: string;
}

export default async function getGithubUser(
  access_token: string
): Promise<IGithubUser> {
  const { id, avatar_url, login } = await (
    await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-cache",
    })
  ).json();

  return {
    github_id: id + "",
    username: login,
    avatar_url,
  };
}
