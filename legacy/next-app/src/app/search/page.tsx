"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import UserCard from "@/components/shared/user-card";
import { Layout } from "lucide-react";
import { Metadata } from "next";
import PostCard from "@/components/shared/post-cards/post-card";

const samplePosts = [
  {
    id: 1,
    userId: 101,
    userName: "Lagos Cosmetics",
    userType: "business",
    isVerified: true,
    type: "product",
    content:
      "Our bestselling shea butter face cream is back in stock! Made with 100% natural ingredients.",
    productName: "Natural Shea Butter Face Cream",
    productImage:
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29zbWV0aWNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    isPromoted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    likesCount: 42,
    commentsCount: 7,
  },
  {
    id: 2,
    userId: 102,
    userName: "Ibukun Shoes",
    userType: "business",
    isVerified: false,
    type: "product",
    content:
      "Step out in style with our handmade leather sandals. Available in all sizes.",
    productName: "Handmade Leather Sandals",
    productImage:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2hvZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    isPromoted: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    likesCount: 35,
    commentsCount: 4,
  },
  {
    id: 3,
    userId: 103,
    userName: "Naija Foodies",
    userType: "business",
    isVerified: true,
    type: "text",
    content:
      "Craving something spicy? Try our new pepper soup mix! Order online for delivery anywhere in Lagos.",
    isPromoted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    likesCount: 68,
    commentsCount: 12,
  },
  {
    id: 4,
    userId: 104,
    userName: "Tech Solutions",
    userType: "business",
    isVerified: false,
    type: "video",
    content:
      "Check out our latest video on how to set up your new smart home devices!",
    isPromoted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    likesCount: 52,
    commentsCount: 9,
  },
  {
    id: 5,
    userId: 105,
    userName: "Zara Okoro",
    userType: "individual",
    type: "story",
    content:
      "Just had the most amazing Jollof rice at a local restaurant. You guys should try it!",
    isPromoted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    likesCount: 81,
    commentsCount: 15,
  },
];

const sampleUsers = [
  {
    id: 101,
    userName: "Lagos Cosmetics",
    userType: "business",
    isVerified: true,
    avatar:
      "https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29zbWV0aWNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 102,
    userName: "Ibukun Shoes",
    userType: "business",
    isVerified: false,
    avatar:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2hvZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 105,
    userName: "Zara Okoro",
    userType: "individual",
    isVerified: false,
    avatar:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2hvZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
  },
];

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    const combinedResults = [...samplePosts, ...sampleUsers];
    const filteredResults = combinedResults.filter((item) => {
      if (item.userName) {
        return item.userName.toLowerCase().includes(searchTerm.toLowerCase());
      }
      if (item.content) {
        return item.content.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });

    setSearchResults(filteredResults);
  }, [searchTerm]);

  const clearSearchTerm = () => {
    setSearchTerm("");
  };

  const getSearchResults = () => {
    return searchResults.map((result) => {
      if ("avatar" in result) {
        return {
          ...result,
          userType: result.userType as "business" | "individual",
          isUser: true,
        };
      } else {
        return {
          ...result,
          userType: result.userType as "business" | "individual",
          type: result.type as "text" | "product" | "video" | "story",
          isUser: false,
        };
      }
    });
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-full pl-12 pr-20"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSearchTerm}
              className="absolute inset-y-0 right-2 rounded-full hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button className="absolute inset-y-0 right-12 px-4 rounded-full bg-klozui-green-600 hover:bg-klozui-green-600/90 text-white">
            Search
          </Button>
        </div>

        {searchResults.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Search Results</h2>
            {getSearchResults().map((result, index) => {
              if (result.isUser) {
                return (
                  <UserCard
                    key={index}
                    id={result.id}
                    userName={result.userName}
                    userType={result.userType}
                    isVerified={result.isVerified}
                    avatar={result.avatar}
                  />
                );
              } else {
                return (
                  <PostCard
                    key={index}
                    post={{
                      id: result.id,
                      userId: result.userId,
                      owner: {
                        id: result.userId,
                        name: result.userName,
                        userType: result.userType,
                        isVerified: result.isVerified,
                      },
                      type: result.type,
                      content: result.content,
                      productName: result.productName,
                      productImage: result.productImage,
                      isPromoted: result.isPromoted,
                      createdAt: result.createdAt,
                      likesCount: result.likesCount,
                      commentsCount: result.commentsCount,
                    }}
                  />
                );
              }
            })}
          </div>
        ) : (
          <Card className="w-full">
            <CardContent className="py-8 flex items-center justify-center">
              <p className={cn("text-muted-foreground text-center")}>
                {searchTerm ? "No results found." : "Start typing to search..."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
