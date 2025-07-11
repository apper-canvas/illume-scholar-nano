import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn("input-field", className)}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;