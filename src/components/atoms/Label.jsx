import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Label = forwardRef(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn("label-field", className)}
      {...props}
    />
  );
});

Label.displayName = "Label";

export default Label;