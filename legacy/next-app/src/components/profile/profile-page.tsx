"use client";
import ProfileHeader from "./profile-header";
import { ProfileTabs } from "./profile-tabs";
import SuggestionsPanel from "../home/suggestions-panel";
import { SamplePostType } from "@/lib/store/posts";

interface ProfilePageProps {
  user: SamplePostType["author"];
  posts: SamplePostType[];
}
export default function ProfilePage({ user, posts }: ProfilePageProps) {
  return (
    <div className="flex flex-row gap-6 ">
      <div className="border-r border-border flex-1 max-w-[650px]">
        <ProfileHeader user={user} />
        <ProfileTabs userId={user.id} posts={posts} />
      </div>
      <SuggestionsPanel className="py-6 max-w-[340px]" />
    </div>
  );
}
