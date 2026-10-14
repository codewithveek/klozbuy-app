import PostCard from "@/components/shared/post-cards/post-card";
import ProductPostCard from "@/components/shared/post-cards/product-post";
import { SamplePostType } from "@/lib/store/posts";

export default function ProfilePosts({ posts }: { posts: SamplePostType[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 max-w-3xl pb-20">
      {posts.map((post) =>
        post.type === "product" ? (
          <ProductPostCard key={post.id} post={post} />
        ) : (
          <PostCard key={post.id} post={post} />
        )
      )}
    </div>
  );
}
