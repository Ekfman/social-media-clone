import { useSession } from "next-auth/react";
import { Button } from "./Button";
import { ProfileImage } from "./ProfileImage";

export function NewPostForm() {
  const session = useSession();
  if (session.status !== "authenticated") return; //this is saying to not render a new tweet, if we are not a logged in user
  console.log(session.data.user.image);
  return (
    <form className="flex flex-col gap-2 border-b px-4 py-2">
      <div className="flex gap-4">
        <ProfileImage src={session.data.user.image} />
        <textarea
          className="flex-grow resize-none overflow-hidden p-4 text-lg"
          placeholder="What's happening?"
        />
      </div>
      <Button className="self-end">Post</Button>
    </form>
  );
}
