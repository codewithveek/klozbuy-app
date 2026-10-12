import { Metadata } from "next";
import Layout from "@/components/layouts/layout";
import ProfilePage from "@/components/profile/profile-page";
import { getStoredPostsByUsername, getStoredUser } from "@/lib/store/posts";
import { notFound } from "next/navigation";
type Props = {
  params: { userId: string };
};

// Sample posts for demo

async function fetchUserData(userId: string) {
  return getStoredUser(userId);
}
async function fetchPosts(userId: string) {
  return getStoredPostsByUsername(userId);
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  const userData = await fetchUserData(userId);
  if (!userData) return notFound();
  return {
    title: `${
      userData?.businessProfile?.businessName
        ? userData?.businessProfile?.businessName
        : userData?.firstName + " " + userData.lastName || ""
    } - Klozbuy Profile`,
    description:
      userData.bio || `Check out ${userData?.firstName}'s profile on Klozbuy`,
  };
}

export default async function Page({ params }: Props) {
  const { userId } = await params;
  const userData = await fetchUserData(userId);
  const posts = await fetchPosts(userId);
  if (!userData) return notFound();
  return (
    <>
      <Layout>
        <ProfilePage user={userData} posts={posts} />
      </Layout>
    </>
  );
}
