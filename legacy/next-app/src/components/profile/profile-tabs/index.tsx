import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileProducts from "./shop";
import ProfilePosts from "./posts";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import ProfileReviews from "./reviews";
import ProfileAbout from "./about";
import { SamplePostType } from "@/lib/store/posts";

interface ProfileTabsProps {
  userId: string;
  posts: SamplePostType[];
}
export const ProfileTabs = ({ userId, posts }: ProfileTabsProps) => {
  const [tab, setTab] = useQueryState("t", {
    defaultValue: "posts",
  });
  const tabTriggerClassName = cn(
    "rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-klozui-green-500 data-[state=active]:bg-transparent",
    "text-base font-medium"
  );
  return (
    <Tabs value={tab} onValueChange={setTab} className="mt-5">
      <TabsList className="w-full border-b border-border bg-transparent justify-start rounded-none">
        <TabsTrigger value="posts" className={tabTriggerClassName}>
          Posts
        </TabsTrigger>
        <TabsTrigger value="shop" className={tabTriggerClassName}>
          Shop
        </TabsTrigger>
        <TabsTrigger value="reviews" className={tabTriggerClassName}>
          Reviews
        </TabsTrigger>
        <TabsTrigger value="about" className={tabTriggerClassName}>
          About
        </TabsTrigger>
      </TabsList>
      <TabsContent value="posts" className="px-3 md:px-4 pt-6">
        <ProfilePosts posts={posts} />
      </TabsContent>
      <TabsContent value="shop" className="px-3 md:px-4 pt-6">
        <ProfileProducts />
      </TabsContent>
      <TabsContent value="reviews" className="px-3 md:px-4 pt-6">
        <ProfileReviews userId={userId} />
      </TabsContent>
      <TabsContent value="about" className="px-3 md:px-4 pt-6">
        <ProfileAbout />
      </TabsContent>
    </Tabs>
  );
};
