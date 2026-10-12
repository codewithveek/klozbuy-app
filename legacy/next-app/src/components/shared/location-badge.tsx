import React from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge2 } from "../ui/badge";

interface LocationBadgeProps {
  distance?: number;
  landmark?: string;
  className?: string;
}

const LocationBadge = ({
  distance,
  landmark,
  className,
}: LocationBadgeProps) => {
  return (
    <Badge2 className={className}>
      <MapPin size={14} />
      {/* Display distance if available, otherwise show landmark or default text */}
      <span className="truncate text-xs">
        {distance !== undefined ? `${distance}km away` : landmark || "Nearby"}
      </span>
    </Badge2>
  );
};

export default LocationBadge;
