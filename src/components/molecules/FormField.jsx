import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const FormField = ({ label, error, className, ...props }) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <Input {...props} />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default FormField;