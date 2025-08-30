import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  onClose?: () => void;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "info", title, children, onClose, ...props }, ref) => {
    const variants = {
      info: {
        container: "bg-blue-50 border-blue-200 text-blue-800",
        icon: "text-blue-600",
        iconComponent: Info,
      },
      success: {
        container: "bg-green-50 border-green-200 text-green-800",
        icon: "text-green-600",
        iconComponent: CheckCircle,
      },
      warning: {
        container: "bg-amber-50 border-amber-200 text-amber-800",
        icon: "text-amber-600",
        iconComponent: AlertCircle,
      },
      error: {
        container: "bg-red-50 border-red-200 text-red-800",
        icon: "text-red-600",
        iconComponent: XCircle,
      },
    };

    const { container, icon, iconComponent: IconComponent } = variants[variant];

    return (
      <div
        ref={ref}
        className={cn(
          "border rounded-lg p-4",
          container,
          className
        )}
        {...props}
      >
        <div className="flex items-start">
          <IconComponent className={cn("h-5 w-5 mt-0.5 flex-shrink-0 mr-3", icon)} />
          <div className="flex-1">
            {title && (
              <h3 className="font-medium mb-1">{title}</h3>
            )}
            <div className="text-sm">{children}</div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = "Alert";

export default Alert;
