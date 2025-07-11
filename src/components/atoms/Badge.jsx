import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-purple-100 text-purple-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    present: "status-present",
    absent: "status-absent",
    late: "status-late",
    excused: "status-excused"
  };

  return (
    <span
      ref={ref}
      className={cn("status-badge", variants[variant], className)}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;