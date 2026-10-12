import React, { useState } from "react";

import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  Store,
  Heart,
  Clock,
} from "lucide-react";
import UserAvatar from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import AppLogo from "@/components/shared/app-logo";

interface NavbarProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

const Navbar = ({ onMobileMenuToggle, isMobileMenuOpen }: NavbarProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock user data - in a real app this would come from auth context
  const user = {
    name: "Adebayo Olatunji",
    type: "individual",
    isVerified: false,
    avatar: "",
  };

  return (
    <div className="bg-white sticky top-0 z-50 w-full px-4 py-2 flex items-center justify-between border-b border-border">
      <div className="flex items-center justify-between gap-2">
        <AppLogo size="sm" showText={false} className="md:hidden" />
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMobileMenuToggle}
        >
          <UserAvatar src={user.avatar} name={user.name} />
        </Button>
      </div>

      <div className="hidden relative md:flex items-center bg-muted rounded-full flex-1 max-w-md mx-4">
        <Search size={16} className="text-muted-foreground absolute left-3" />
        <Input
          type="search"
          placeholder="Search businesses, products..."
          className="bg-transparent rounded-full pl-9 font-semibold border-none outline-none w-full text-sm"
        />
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <Bell size={20} />
        </Button>

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <UserAvatar
                  name={user.name}
                  size="sm"
                  userType={user.type as "individual" | "business"}
                  src={user.avatar}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 mr-2 mt-1"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.type === "individual"
                      ? "Individual Account"
                      : "Business Account"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Favorites</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Store className="mr-2 h-4 w-4" />
                  <span>My Business</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Activity</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="text-sm hidden md:block"
              onClick={() => setIsAuthenticated(true)}
            >
              Log in
            </Button>
            <Button
              className="bg-klozui-green-600 hover:bg-klozui-green-600/90 text-white text-sm"
              onClick={() => setIsAuthenticated(true)}
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
