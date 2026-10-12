import Link from "next/link";
import { VerifiedCircleIcon } from "../custom-icons/badges";

type PostOwner = {
  id: string;
  name: string;
  isVerified?: boolean;
  username?: string;
  showUsername?: boolean;
};
export default function UserName({
  username,
  name,
  isVerified,
  id,
  showUsername = false,
}: PostOwner) {
  return (
    <div className="flex items-center relative">
      <Link
        href={`/${username || id}`}
        className="font-medium hover:underline mr-1 truncate"
      >
        {name || ""}
      </Link>
      {isVerified && <VerifiedCircleIcon size={20} />}
    </div>
  );
}
