"use client";
import React, { useState, useEffect, useRef, use } from "react";
import Layout from "@/components/layouts/layout";
import UserAvatar from "@/components/shared/user-avatar";
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Info,
  Clock,
  Check,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Sample data for chat conversations
const sampleConversations = [
  {
    id: 1,
    userId: 101,
    name: "Lagos Cosmetics",
    type: "business",
    avatar: "",
    isVerified: true,
    lastMessage: "Thank you for your interest in our shea butter cream!",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    unread: 2,
    online: true,
  },
  {
    id: 2,
    userId: 102,
    name: "Adebola Foods",
    type: "business",
    avatar: "",
    isVerified: false,
    lastMessage: "Yes, we can deliver to your location tomorrow.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    unread: 0,
    online: false,
  },
  {
    id: 3,
    userId: 103,
    name: "Lekki Tech Hub",
    type: "business",
    avatar: "",
    isVerified: true,
    lastMessage: "The tech meetup starts at 4pm. Will you be attending?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    unread: 0,
    online: true,
  },
  {
    id: 4,
    userId: 204,
    name: "Funmi Adeleke",
    type: "individual",
    avatar: "",
    isVerified: false,
    lastMessage:
      "I saw your post about the new restaurant. Have you been there?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    unread: 0,
    online: false,
  },
];

// Sample chat messages
const sampleMessages = [
  {
    id: 1,
    senderId: 201, // current user
    receiverId: 101, // Lagos Cosmetics
    content:
      "Hi, I'm interested in your shea butter face cream. Is it good for sensitive skin?", // Fixed: Changed to double quotes
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isRead: true,
  },
  {
    id: 2,
    senderId: 101, // Lagos Cosmetics
    receiverId: 201, // current user
    content:
      "Hello! Yes, our shea butter cream is perfect for sensitive skin. It's made with 100% natural ingredients and has no added fragrances.", // Fixed: Changed to double quotes
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    isRead: true,
  },
  {
    id: 3,
    senderId: 201, // current user
    receiverId: 101, // Lagos Cosmetics
    content: "That sounds great! Do you offer delivery to Yaba?",
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    isRead: true,
  },
  {
    id: 4,
    senderId: 101, // Lagos Cosmetics
    receiverId: 201, // current user
    content:
      "Yes, we deliver to Yaba. Delivery fee is ₦1,000 and it takes 1-2 business days.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    isRead: true,
  },
  {
    id: 5,
    senderId: 101, // Lagos Cosmetics
    receiverId: 201, // current user
    content:
      "We also have a special offer right now - buy 2 creams and get a free face wash!",
    timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    isRead: true,
  },
  {
    id: 6,
    senderId: 201, // current user
    receiverId: 101, // Lagos Cosmetics
    content:
      "That's a great deal! I'd like to order 2 shea butter creams then.", // Fixed: Changed to double quotes
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    isRead: true,
  },
  {
    id: 7,
    senderId: 101, // Lagos Cosmetics
    receiverId: 201, // current user
    content:
      "Excellent choice! Please provide your delivery address and phone number, and we'll process your order.", // Fixed: Changed to double quotes
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    isRead: true,
  },
  {
    id: 8,
    senderId: 201, // current user
    receiverId: 101, // Lagos Cosmetics
    content: "12B Herbert Macaulay Way, Yaba. My phone number is 08076543210.",
    timestamp: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
    isRead: true,
  },
  {
    id: 9,
    senderId: 101, // Lagos Cosmetics
    receiverId: 201, // current user
    content:
      "Thank you for your interest in our shea butter cream! Your order has been processed. You'll receive it within 1-2 business days. Payment will be on delivery (₦10,000 for 2 creams).", // Fixed: Changed to double quotes
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    isRead: false,
  },
];

type PageProps = {
  params: {
    conversationId: string;
  };
};
export default function Page({ params }: PageProps) {
  const { conversationId: covId = "204" } = use<PageProps["params"]>(params);
  const conversationId = +covId;
  const [activeConversation, setActiveConversation] = useState<number | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState(sampleConversations);
  const [messages, setMessages] = useState(sampleMessages);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) {
      setActiveConversation(parseInt(conversationId));
    } else if (conversations.length > 0) {
      setActiveConversation(conversations[0].id);
    }
  }, [conversationId, conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeConversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !activeConversation) return;

    const newMessage = {
      id: messages.length + 1,
      senderId: 201, // current user
      receiverId: activeConversation,
      content: message,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return (
        date.toLocaleDateString([], { weekday: "short" }) +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }

    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getActiveConversation = () => {
    return conversations.find((conv) => conv.id === activeConversation);
  };

  const getConversationMessages = () => {
    return messages.filter(
      (msg) =>
        (msg.senderId === activeConversation && msg.receiverId === 201) ||
        (msg.receiverId === activeConversation && msg.senderId === 201)
    );
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh - 170px)] md:h-[calc(100vh-56px)]">
        <div
          className={cn(
            "w-full md:w-80 border-r overflow-hidden flex flex-col",
            activeConversation && "hidden md:flex"
          )}
        >
          <div className="p-4 border-b">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <Input placeholder="Search messages..." className="pl-9" />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="divide-y">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={cn(
                    "flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/50",
                    conv.id === activeConversation && "bg-muted"
                  )}
                  onClick={() => setActiveConversation(conv.id)}
                >
                  <div className="relative">
                    <UserAvatar
                      name={conv.name}
                      size="md"
                      userType={conv.type as "individual" | "business"}
                      src={conv.avatar}
                    />
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-klozui-green-600 rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{conv.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(conv.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-muted-foreground truncate max-w-[160px]">
                        {conv.lastMessage}
                      </p>
                      {conv.unread > 0 && (
                        <span className="bg-klozui-green-600 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {activeConversation ? (
          <div
            className={cn(
              "flex flex-col flex-1  h-full",
              !activeConversation && "hidden md:flex"
            )}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setActiveConversation(null)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-left"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </Button>

                <UserAvatar
                  name={getActiveConversation()?.name || ""}
                  size="sm"
                  userType={
                    getActiveConversation()?.type as "individual" | "business"
                  }
                  src={getActiveConversation()?.avatar || ""}
                />

                <div>
                  <div className="font-medium">
                    {getActiveConversation()?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {getActiveConversation()?.online ? "Online" : "Offline"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <Phone size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <Video size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <Info size={18} />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical size={18} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View profile</DropdownMenuItem>
                    <DropdownMenuItem>Clear chat</DropdownMenuItem>
                    <DropdownMenuItem>Block user</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {getConversationMessages().map((msg, index) => {
                  const isCurrentUser = msg.senderId === 201;
                  const showTimestamp =
                    index === 0 ||
                    new Date(msg.timestamp).getTime() -
                      new Date(
                        getConversationMessages()[index - 1].timestamp
                      ).getTime() >
                      10 * 60 * 1000;

                  return (
                    <div key={msg.id}>
                      {showTimestamp && (
                        <div className="flex justify-center my-4">
                          <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                            {new Date(msg.timestamp).toLocaleDateString([], {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      )}

                      <div
                        className={cn(
                          "flex items-end gap-2 max-w-[80%]",
                          isCurrentUser ? "ml-auto" : "mr-auto"
                        )}
                      >
                        {!isCurrentUser && (
                          <UserAvatar
                            name={getActiveConversation()?.name || ""}
                            size="xs"
                            userType={
                              getActiveConversation()?.type as
                                | "individual"
                                | "business"
                            }
                            src={getActiveConversation()?.avatar || ""}
                          />
                        )}

                        <div
                          className={cn(
                            "rounded-lg p-3 min-w-0",
                            isCurrentUser
                              ? "bg-klozui-green-600 text-white rounded-br-none"
                              : "bg-muted rounded-bl-none"
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {msg.content}
                          </p>
                          <div
                            className={cn(
                              "flex items-center justify-end gap-1 mt-1",
                              isCurrentUser
                                ? "text-white/70"
                                : "text-muted-foreground"
                            )}
                          >
                            <span className="text-[10px]">
                              {formatTimestamp(msg.timestamp)}
                            </span>
                            {isCurrentUser &&
                              (msg.isRead ? (
                                <CheckCheck size={12} />
                              ) : (
                                <Check size={12} />
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <form onSubmit={handleSendMessage} className="border-t p-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-klozui-green-600 hover:bg-klozui-green-600/90 text-white"
                >
                  <Send size={18} />
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="hidden md:flex flex-col flex-1 items-center justify-center text-center p-4">
            <div className="max-w-md space-y-4">
              <h3 className="text-xl font-semibold">Your Messages</h3>
              <p className="text-muted-foreground">
                Select a conversation from the list to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
