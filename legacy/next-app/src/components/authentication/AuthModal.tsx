"use client";
import React, { useState } from "react";
import { X, Mail, Lock, User, Store, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import AppLogo from "@/components/shared/app-logo";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "register";
}

const AuthModal = ({
  open,
  onOpenChange,
  defaultTab = "login",
}: AuthModalProps) => {
  const [currentTab, setCurrentTab] = useState<"login" | "register">(
    defaultTab
  );
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  const [userType, setUserType] = useState<"individual" | "business">(
    "individual"
  );

  const handleTabChange = (value: string) => {
    setCurrentTab(value as "login" | "register");
    setRegisterStep(1);
  };

  const goToNextStep = () => {
    setRegisterStep(2);
  };

  const goToPreviousStep = () => {
    setRegisterStep(1);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic
    onOpenChange(false);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 relative flex flex-row items-center justify-center">
          <AppLogo size="md" className="mx-auto" />
          <Button
            className="absolute right-4 top-4"
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X size={18} />
          </Button>
        </DialogHeader>

        <Tabs
          value={currentTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 px-6">
            <TabsTrigger value="login">Log In</TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4 px-6 pb-6">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      required
                    />
                    <Mail
                      size={16}
                      className="absolute left-3 top-3 text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-xs"
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      required
                    />
                    <Lock
                      size={16}
                      className="absolute left-3 top-3 text-muted-foreground"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-6 bg-klozui-green-600 hover:bg-klozui-green-600/90"
              >
                Log In
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-4 px-6 pb-6">
            {registerStep === 1 ? (
              <div className="animate-slide-up">
                <div className="text-center mb-6">
                  <h3 className="font-semibold text-lg">
                    I want to join as a...
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className={cn(
                      "flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all hover:bg-muted/30",
                      userType === "individual"
                        ? "border-klozui-green-600 bg-klozui-green-600/5"
                        : "border-muted"
                    )}
                    onClick={() => setUserType("individual")}
                  >
                    <div
                      className={cn(
                        "p-3 rounded-full",
                        userType === "individual"
                          ? "bg-klozui-green-600/10 text-klozui-green-600"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <User size={24} />
                    </div>
                    <span className="font-medium">Individual</span>
                    <span className="text-xs text-muted-foreground text-center">
                      I&apos;m looking to discover local businesses
                    </span>
                  </button>

                  <button
                    type="button"
                    className={cn(
                      "flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all hover:bg-muted/30",
                      userType === "business"
                        ? "border-klozui-amber-500 bg-klozui-amber-500/5"
                        : "border-muted"
                    )}
                    onClick={() => setUserType("business")}
                  >
                    <div
                      className={cn(
                        "p-3 rounded-full",
                        userType === "business"
                          ? "bg-klozui-amber-500/10 text-klozui-amber-500"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Store size={24} />
                    </div>
                    <span className="font-medium">Business</span>
                    <span className="text-xs text-muted-foreground text-center">
                      I want to reach local customers
                    </span>
                  </button>
                </div>

                <Button
                  className="w-full mt-6 bg-klozui-green-600 hover:bg-klozui-green-600/90"
                  onClick={goToNextStep}
                >
                  Continue
                </Button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="animate-slide-up">
                <div className="flex items-center mb-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mr-2 h-8 w-8"
                    onClick={goToPreviousStep}
                  >
                    <ArrowLeft size={16} />
                  </Button>
                  <h3 className="font-semibold">
                    {userType === "individual"
                      ? "Create Individual Account"
                      : "Create Business Account"}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">
                      {userType === "individual"
                        ? "Full Name"
                        : "Business Name"}
                    </Label>
                    <div className="relative">
                      <Input
                        id="register-name"
                        type="text"
                        placeholder={
                          userType === "individual"
                            ? "John Doe"
                            : "Your Business Name"
                        }
                        className="pl-10"
                        required
                      />
                      <User
                        size={16}
                        className="absolute left-3 top-3 text-muted-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10"
                        required
                      />
                      <Mail
                        size={16}
                        className="absolute left-3 top-3 text-muted-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        required
                      />
                      <Lock
                        size={16}
                        className="absolute left-3 top-3 text-muted-foreground"
                      />
                    </div>
                  </div>

                  {userType === "business" && (
                    <div className="space-y-2">
                      <Label htmlFor="business-type">Business Type</Label>
                      <select
                        id="business-type"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        required
                      >
                        <option value="">Select Business Type</option>
                        <option value="retail">Retail</option>
                        <option value="food">Food & Beverage</option>
                        <option value="service">Service Provider</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="tech">Technology</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <Button
                    type="submit"
                    className="w-full bg-klozui-green-600 hover:bg-klozui-green-600/90"
                  >
                    Create Account
                  </Button>

                  <p className="text-xs text-center mt-4 text-muted-foreground">
                    By signing up, you agree to our{" "}
                    <a
                      href="#"
                      className="text-klozui-green-600 hover:underline"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-klozui-green-600 hover:underline"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
