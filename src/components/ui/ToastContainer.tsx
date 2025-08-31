import { Toast as ToastType } from "@/hooks/useToast";
import Toast from "./Toast";

interface ToastContainerProps {
  toasts: ToastType[];
  onClose: (id: string) => void;
}

export default function ToastContainer({
  toasts,
  onClose,
}: ToastContainerProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-3 sm:bottom-4 sm:right-4 sm:w-96 w-full px-4 sm:px-0">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}
