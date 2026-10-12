import { Button } from "@/components/ui/button";
import { PenLine, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/shared/user-avatar";
import { Clock } from "lucide-react";

const sampleReviews = [
  {
    id: 1,
    reviewerId: 201,
    reviewerName: "Chioma Nwosu",
    reviewerType: "individual",
    reviewerImage: "",
    rating: 5,
    comment:
      "Amazing products! I love the shea butter face cream, it's made my skin so much smoother.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: 2,
    reviewerId: 202,
    reviewerName: "Oluwaseun Adeyemi",
    reviewerType: "individual",
    reviewerImage: "",
    rating: 4,
    comment:
      "Great quality products. The hibiscus toner is refreshing and smells wonderful.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
];
export default function ProfileReviews({ userId }: { userId: string }) {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          Reviews ({sampleReviews.length})
        </h3>
        <Button variant="outline" className="text-sm">
          <PenLine size={16} className="mr-2" />
          Write a Review
        </Button>
      </div>

      <div className="space-y-4">
        {sampleReviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={review.reviewerName}
                  size="sm"
                  userType={review.reviewerType as "individual" | "business"}
                  src={review.reviewerImage}
                />

                <div>
                  <div className="font-medium">{review.reviewerName}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock size={12} />
                    <span>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={cn(
                      i < review.rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted"
                    )}
                  />
                ))}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
