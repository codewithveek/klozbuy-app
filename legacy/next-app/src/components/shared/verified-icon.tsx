import React from "react";

const VerifiedBadgeIcon = ({
  size = 24,
  color = "#1DA1F2",
  stroke = "#ffffff",
  strokeWidth = 2,
  className = "bg-klozui-green-600",
}) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L14.12 5.47L18.09 6.18L15.5 9.5L16.18 13.5L12 11.67L7.82 13.5L8.5 9.5L5.91 6.18L9.88 5.47L12 2Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12L11.3 13.8L15 10"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default VerifiedBadgeIcon;
