import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  className,
  variant = "default"
}) => {
  const variants = {
    default: "card",
    accent: "card-accent",
    primary: "bg-gradient-to-br from-primary to-blue-600 text-white",
    secondary: "bg-gradient-to-br from-secondary to-purple-600 text-white",
    success: "bg-gradient-to-br from-green-500 to-green-600 text-white",
    warning: "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white"
  };

  return (
    <div className={cn(variants[variant], className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={cn(
            "text-sm font-medium",
            variant === "default" || variant === "accent" ? "text-gray-600" : "text-white/80"
          )}>
            {title}
          </p>
          <p className={cn(
            "text-3xl font-bold mt-2",
            variant === "default" || variant === "accent" ? "gradient-text" : "text-white"
          )}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                className={cn(
                  "h-4 w-4 mr-1",
                  trend === "up" ? "text-green-500" : "text-red-500"
                )}
              />
              <span className={cn(
                "text-sm font-medium",
                trend === "up" ? "text-green-600" : "text-red-600"
              )}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-lg",
          variant === "default" || variant === "accent" ? "bg-gradient-to-r from-primary to-blue-600" : "bg-white/20"
        )}>
          <ApperIcon 
            name={icon} 
            className={cn(
              "h-6 w-6",
              variant === "default" || variant === "accent" ? "text-white" : "text-white"
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default StatCard;