import { useLocation } from "@/hooks/useLocation";
import { CheckCircle, MapPin, Shield, X } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "./ui/Button";

interface LocationPermissionProps {
  onLocationObtained?: (lat: number, lng: number) => void;
  showManualInput?: boolean;
}

export default function LocationPermission({
  onLocationObtained,
  showManualInput = false,
}: LocationPermissionProps) {
  const location = useLocation();
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check permission status on mount
    location.checkPermission();
  }, [location.checkPermission]);

  useEffect(() => {
    // Call callback when location is obtained
    if (location.latitude && location.longitude && onLocationObtained) {
      onLocationObtained(location.latitude, location.longitude);
    }
  }, [location.latitude, location.longitude, onLocationObtained]);

  const handleRequestPermission = async () => {
    await location.handleGetLocation();
  };

  const handleManualLocation = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng)) {
      return;
    }

    location.setManualLocation(lat, lng);
    setShowManual(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  // Hide component if location is set and user dismissed it
  if (!isVisible && location.latitude && location.longitude) {
    return null;
  }

  // Auto-hide if location is already granted and available
  if (
    location.latitude &&
    location.longitude &&
    location.permissionStatus === "granted" &&
    !showManual
  ) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-green-800">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Location Ready</span>
            <span className="text-xs text-green-600">
              ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
            </span>
          </div>
          <button
            onClick={handleDismiss}
            className="text-green-600 hover:text-green-800 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            <h3 className="font-medium text-orange-800">Location Required</h3>
          </div>

          <p className="text-sm text-orange-700 mb-3">
            We need your location to find nearby restaurants.
            {location.permissionStatus === "denied" &&
              " Location access is currently blocked."}
          </p>

          <div className="flex flex-wrap gap-2">
            {(!location.latitude || !location.longitude) &&
              location.permissionStatus !== "denied" && (
                <Button
                  onClick={handleRequestPermission}
                  disabled={location.isGettingLocation}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  {location.isGettingLocation ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                      <span>Getting...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-3 h-3" />
                      <span>Allow Location</span>
                    </>
                  )}
                </Button>
              )}

            {showManualInput && (
              <Button
                variant="outline"
                onClick={() => setShowManual(!showManual)}
                size="sm"
                className="text-orange-700 border-orange-300 hover:bg-orange-100"
              >
                Manual Input
              </Button>
            )}
          </div>

          {/* Compact Manual Location Input */}
          {showManual && (
            <div className="mt-3 p-3 bg-white border border-orange-200 rounded-md">
              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  step="any"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  placeholder="Latitude"
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <input
                  type="number"
                  step="any"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  placeholder="Longitude"
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleManualLocation} size="sm">
                  Set
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowManual(false)}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Compact Permission Instructions */}
          {location.permissionStatus === "denied" && (
            <div className="mt-3 text-xs text-orange-600">
              💡 Enable location: Click the location icon in your browser's
              address bar → Allow
            </div>
          )}
        </div>

        <button
          onClick={handleDismiss}
          className="text-orange-600 hover:text-orange-800 p-1 ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
