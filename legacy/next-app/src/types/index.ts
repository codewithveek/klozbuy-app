export interface User {
  id: string;
  name: string;
  bio: string;
  email: string;
  phone: string;
  username: string;
  profilePicture: string;
  businessType: string;
  isVerified: boolean;
  isRegistered: boolean;
  followersCount: number;
  rating: number;
  reviewsCount: number;
  joinedDate: string;
  landmark: string;
  distance: number;
  userType: "individual" | "business";
  address: string;
}
export interface Posts {
  id: string;
  userId: string;
  videoUrl?: string;
  owner: Partial<User>;

  type: "text" | "product" | "video" | "story";
  content: string;
  productName?: string;
  productImage?: string;
  isPromoted: boolean;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
}
