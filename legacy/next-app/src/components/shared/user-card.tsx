import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart } from "lucide-react";
import UserName from "./user-name";

interface UserCardProps {
  id: string;
  userName: string;
  userType: "individual" | "business";
  isVerified: boolean;
  avatar?: string;
  bio?: string;
  className?: string;
  name?: string;
}

const UserCard = ({
  id,
  userName,
  userType,
  isVerified,
  avatar,
  name,
  bio,
  className,
}: UserCardProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border border-border overflow-hidden",
        "transition-all duration-300 hover:shadow-md p-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Link href={`/profile/${id}`}>
          <UserAvatar
            name={userName}
            src={avatar}
            size="md"
            userType={userType}
          />
        </Link>

        <div className="flex-1">
          <UserName id={id} name={userName} />

          {bio && (
            <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
              {bio}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          (
          <Button variant="outline" size="sm">
            <MessageSquare size={14} className="mr-1" />
            <span>Message</span>
          </Button>
          )
          <Button
            size="sm"
            className=" bg-klozui-green-600 hover:bg-klozui-green-600/90 text-white"
          >
            <Heart size={14} className="mr-1" />
            Follow
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
