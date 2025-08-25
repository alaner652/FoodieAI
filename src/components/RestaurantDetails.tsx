import { Restaurant } from "@/types";
import {
  Calendar,
  ChefHat,
  ExternalLink,
  Globe,
  Heart,
  MapPin,
  Star,
  Utensils,
  X,
} from "lucide-react";

interface RestaurantDetailsProps {
  restaurant: Restaurant;
  onClose: () => void;
}

export default function RestaurantDetails({
  restaurant,
  onClose,
}: RestaurantDetailsProps) {
  const getPriceRangeText = (priceRange: string) => {
    switch (priceRange) {
      case "$":
        return "平價";
      case "$$":
        return "中等";
      case "$$$":
        return "高級";
      case "$$$$":
        return "奢華";
      default:
        return "中等";
    }
  };

  const getDayName = (day: number) => {
    const days = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
    return days[day] || "";
  };

  const formatTime = (time: string) => {
    // Google API 時間格式為 "HHMM"，轉換為 "HH:MM"
    if (time.length === 4) {
      return `${time.slice(0, 2)}:${time.slice(2)}`;
    }
    return time;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 頭部 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">餐廳詳情</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 內容 */}
        <div className="p-4 space-y-6">
          {/* 餐廳照片 */}
          <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={restaurant.photoUrl || "/window.svg"}
              alt={restaurant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (img.src.endsWith("/window.svg")) return;
                img.src = "/window.svg";
              }}
            />
          </div>

          {/* 基本資訊 */}
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
                  {restaurant.openNow ? "營業中" : "已關閉"}
                </span>
              </div>
            </div>

            {/* 評分和距離 */}
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

            {/* 地址 */}
            <div className="flex items-start">
              <MapPin className="w-5 h-5 mr-2 text-gray-500 mt-0.5" />
              <span className="text-gray-700">{restaurant.address}</span>
            </div>
          </div>

          {/* 營業時間 */}
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

          {/* 菜單資訊 */}
          {restaurant.menu && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Utensils className="w-5 h-5 mr-2 text-green-500" />
                菜系類型
              </h3>

              {/* 特色菜餚 */}
              {restaurant.menu.specialties &&
                restaurant.menu.specialties.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-md font-medium text-gray-900 flex items-center">
                      <ChefHat className="w-4 h-4 mr-2 text-orange-500" />
                      特色菜餚
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.menu.specialties.map((dish, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-orange-50 text-orange-700 rounded-lg border border-orange-200 text-sm"
                        >
                          {dish}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* 熱門菜餚 */}
              {restaurant.menu.popularDishes &&
                restaurant.menu.popularDishes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-md font-medium text-gray-900 flex items-center">
                      <Heart className="w-4 h-4 mr-2 text-red-500" />
                      熱門菜餚
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.menu.popularDishes.map((dish, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm"
                        >
                          {dish}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* 菜系類型 */}
              {restaurant.menu.cuisineType &&
                restaurant.menu.cuisineType.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {restaurant.menu.cuisineType.map((type, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* 詳細菜單 */}
              {restaurant.menu.items && restaurant.menu.items.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-md font-medium text-gray-900">
                    詳細菜單
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {restaurant.menu.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.name}
                          </div>
                          {item.description && (
                            <div className="text-sm text-gray-600">
                              {item.description}
                            </div>
                          )}
                        </div>
                        {item.price && (
                          <div className="text-sm font-medium text-gray-900">
                            {item.price}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 評論 */}
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

          {/* 外部連結 */}
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
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Globe className="w-4 h-4 mr-2" />
                官方網站
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
