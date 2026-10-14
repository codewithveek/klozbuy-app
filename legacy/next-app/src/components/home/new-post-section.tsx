import {
  Camera,
  MapPin,
  Tag,
  Users,
  Image,
  Video,
  Calendar,
  Smile,
  PackagePlus,
} from "lucide-react";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import UserAvatar from "../shared/user-avatar";

const NewPostSection = () => {
  const [postText, setPostText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    {
      id: "product",
      label: "Product",
      icon: PackagePlus,
      color: "bg-purple-500",
    },
    { id: "service", label: "Service", icon: Users, color: "bg-amber-500" },
    { id: "event", label: "Event", icon: Calendar, color: "bg-blue-500" },
  ];

  const quickActions = [
    { icon: Image, label: "Photo", color: "text-green-600" },
    { icon: Video, label: "Video", color: "text-blue-600" },
    { icon: MapPin, label: "Location", color: "text-red-600" },
    { icon: Tag, label: "Tag People", color: "text-amber-600" },
  ];

  const handlePost = () => {
    if (postText.trim() || selectedCategory) {
      // Handle post submission
      console.log("Post:", { text: postText, category: selectedCategory });
      setPostText("");
      setSelectedCategory("");
      setIsExpanded(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mb-5">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-3 md:p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <UserAvatar name="John Doe" src="" />
            <div className="flex-1">
              <Textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                placeholder="What's on your mind? Share a post, product, or service..."
                className="w-full resize-none border border-border outline-none text-gray-700 placeholder-gray-400 text-base bg-gray-50 rounded-lg px-3 md:px-4 py-2 min-h-[30px]"
                rows={isExpanded ? 4 : 2}
              />
            </div>
          </div>
        </div>

        {/* Expanded Options */}
        {isExpanded && (
          <div className="p-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={index}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <IconComponent className={`w-4 h-4 ${action.color}`} />
                    <span className="text-sm text-gray-700">
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What are you sharing?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 ${
                        selectedCategory === category.id
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full ${category.color} flex items-center justify-center`}
                      >
                        <IconComponent className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {category.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}

            {/* Location Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">
                  Share your location
                </span>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Lagos, Nigeria</span>
          </div>

          <div className="flex space-x-2">
            {isExpanded && (
              <Button
                onClick={() => {
                  setIsExpanded(false);
                  setPostText("");
                  setSelectedCategory("");
                }}
                variant="outline"
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handlePost}
              disabled={!postText.trim() && !selectedCategory}
              className=" transition-colors duration-200"
            >
              {selectedCategory === "product"
                ? "List Product"
                : selectedCategory === "service"
                ? "Post Service"
                : selectedCategory === "event"
                ? "Create Event"
                : "Share"}
            </Button>
          </div>
        </div>
        {/* Recent Activity Hint */}
        {/* <div className="mt-4 text-center mb-3 p-3">
          <p className="text-sm text-gray-500">
            Share products, services, or connect with your local community in
            Lagos
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default NewPostSection;
