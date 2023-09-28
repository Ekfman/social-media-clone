import { Button } from "./Button";

export function NewPostForm () {
    return <form className="flex flex-col gap-2 border-b px-4 py-2">
        <div className="flex gap-4">
            {/* <ProfileImage src="#url"/> */}
            <textarea className="flex-grow resize-none overflow-hidden p-4 text-lg" placeholder="What's happening?"/>

        </div>
        <Button className="self-end">Post</Button>
    </form>
}