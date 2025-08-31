import { useToastContext } from "@/contexts/ToastContext";
import { useLocation } from "@/hooks/useLocation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LocationPermissionProps {
  onLocationObtained?: (lat: number, lng: number) => void;
  showManualInput?: boolean;
}

export default function LocationPermission({
  onLocationObtained,
}: LocationPermissionProps) {
  const location = useLocation();
  const { showWarning, showInfo } = useToastContext();
  const router = useRouter();
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    // Check permission status on mount
    location.checkPermission();
  }, [location]);

  useEffect(() => {
    // Call callback when location is obtained
    if (location.latitude && location.longitude && onLocationObtained) {
      onLocationObtained(location.latitude, location.longitude);
    }
  }, [location.latitude, location.longitude, onLocationObtained]);

  useEffect(() => {
    // Show toast notification when location is needed
    // Only show once when component mounts and location is not available
    if (
      !hasShownToast &&
      (!location.latitude || !location.longitude) &&
      location.permissionStatus !== null // Wait for permission status to be determined
    ) {
      setHasShownToast(true);

      // Add a small delay to prevent duplicate toasts
      const timer = setTimeout(() => {
        if (location.permissionStatus === "denied") {
          showWarning(
            "位置存取被拒絕，請前往設定頁面手動輸入位置或在瀏覽器中允許位置存取",
            "需要位置資訊",
            8000
          );
        } else {
          showInfo(
            "需要您的位置來找尋附近餐廳，您可以允許位置存取或前往設定頁面手動輸入",
            "位置權限",
            8000
          );
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [location.permissionStatus, hasShownToast, showWarning, showInfo]);

  const handleRequestPermission = async () => {
    await location.handleGetLocation();
  };

  const handleGoToSettings = () => {
    router.push("/settings");
  };

  // If location is available, don't render anything
  if (location.latitude && location.longitude) {
    return null;
  }

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 text-sm">📍</span>
            </div>
            <h3 className="font-medium text-orange-800">位置設定</h3>
          </div>

          <p className="text-sm text-orange-700 mb-3">
            {location.permissionStatus === "denied"
              ? "位置存取被拒絕，您可以手動設定位置或在瀏覽器中重新允許位置存取"
              : "為了提供最佳的餐廳推薦服務，我們需要您的位置資訊"}
          </p>

          <div className="flex flex-wrap gap-2">
            {location.permissionStatus !== "denied" && (
              <button
                onClick={handleRequestPermission}
                disabled={location.isGettingLocation}
                className="inline-flex items-center px-3 py-1.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {location.isGettingLocation ? "取得中..." : "允許位置存取"}
              </button>
            )}

            <button
              onClick={handleGoToSettings}
              className="inline-flex items-center px-3 py-1.5 bg-white border border-orange-300 text-orange-700 text-sm font-medium rounded-lg hover:bg-orange-50"
            >
              前往設定頁面
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
