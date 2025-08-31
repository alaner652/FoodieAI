import Card from "@/components/ui/Card";
import { BUSINESS_STATUS, WEEKDAY_NAMES } from "@/constants/dateTime";
import { getPriceRangeText } from "@/lib/utils";
import { Restaurant } from "@/types";
import { Calendar, ExternalLink, Globe, MapPin, Star, X } from "lucide-react";
import Image from "next/image";

interface RestaurantDetailsProps {
  restaurant: Restaurant;
  onClose: () => void;
}

export default function RestaurantDetails({
  restaurant,
  onClose,
}: RestaurantDetailsProps) {
  const getDayName = (day: number) => {
    return WEEKDAY_NAMES[day] || "";
  };

  const formatTime = (time: string) => {
    // Google API time format is "HHMM", convert to "HH:MM"
    if (time.length === 4) {
      return `${time.slice(0, 2)}:${time.slice(2)}`;
    }
    return time;
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center p-4 z-[9999]">
      <Card
        variant="outlined"
        className="max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">餐廳詳情</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          {/* Restaurant Photos */}
          <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden relative">
            <Image
              src={restaurant.photoUrl || "/window.svg"}
              alt={restaurant.name}
              fill
              className="object-cover"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (img.src.endsWith("/window.svg")) return;
                img.src = "/window.svg";
              }}
            />
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {restaurant.name}
              </h1>
              <div className="flex items-center space-x-2 mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {restaurant.cuisine}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {getPriceRangeText(restaurant.priceRange)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    restaurant.openNow
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {restaurant.openNow
                    ? BUSINESS_STATUS.OPEN
                    : BUSINESS_STATUS.CLOSED}
                </span>
              </div>
            </div>

            {/* Rating and Distance */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-400 fill-current" />
                <span className="text-lg font-semibold text-gray-900">
                  {restaurant.rating}
                </span>
                {restaurant.userRatingsTotal && (
                  <span className="text-sm text-gray-600 ml-1">
                    ({restaurant.userRatingsTotal} 則評價)
                  </span>
                )}
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                <span className="text-gray-700">{restaurant.distance}km</span>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start">
              <MapPin className="w-5 h-5 mr-2 text-gray-500 mt-0.5" />
              <span className="text-gray-700">{restaurant.address}</span>
            </div>
          </div>

          {/* Opening Hours */}
          {restaurant.openingHours && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                營業時間
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {restaurant.openingHours.weekdayText ? (
                  <div className="space-y-1">
                    {restaurant.openingHours.weekdayText.map((day, index) => (
                      <div key={index} className="text-sm text-gray-700">
                        {day}
                      </div>
                    ))}
                  </div>
                ) : restaurant.openingHours.periods ? (
                  <div className="space-y-1">
                    {restaurant.openingHours.periods.map((period, index) => (
                      <div key={index} className="text-sm text-gray-700">
                        {getDayName(period.open.day)}:{" "}
                        {formatTime(period.open.time)} -{" "}
                        {formatTime(period.close.time)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">營業時間資訊暫無</div>
                )}
              </div>
            </div>
          )}

          {/* Reviews */}
          {restaurant.reviews && restaurant.reviews.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">顧客評論</h3>
              <div className="space-y-3">
                {restaurant.reviews.map((review, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                        <span className="font-medium text-gray-900">
                          {review.rating}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {review.authorName} • {review.time}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* External Links */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            {restaurant.mapsUrl && (
              <a
                href={restaurant.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />在 Google Maps 查看
              </a>
            )}
            {restaurant.website && (
              <a
                href={restaurant.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Globe className="w-4 h-4 mr-2" />
                官方網站
              </a>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
