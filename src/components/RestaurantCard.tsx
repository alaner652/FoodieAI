import { Restaurant } from "@/types";
import { ChefHat, Clock, Heart, MapPin, Star, Utensils } from "lucide-react";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onViewDetails?: (restaurant: Restaurant) => void;
}

export default function RestaurantCard({
  restaurant,
  onViewDetails,
}: RestaurantCardProps) {
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

  const getCuisineColor = (cuisine: string) => {
    const colors = {
      日式: "bg-blue-100 text-blue-700",
      韓式: "bg-red-100 text-red-700",
      中式: "bg-orange-100 text-orange-700",
      義大利: "bg-green-100 text-green-700",
      美式: "bg-purple-100 text-purple-700",
      泰式: "bg-yellow-100 text-yellow-700",
    };
    return (
      colors[cuisine as keyof typeof colors] || "bg-gray-100 text-gray-700"
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden">
      <div className="w-full h-44 bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={restaurant.photoUrl || "/window.svg"}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            if (img.src.endsWith("/window.svg")) return;
            img.src = "/window.svg";
          }}
        />
      </div>
      {/* 卡片頭部 */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {restaurant.name}
            </h3>
            <div className="flex items-center space-x-2 mb-3">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getCuisineColor(
                  restaurant.cuisine
                )}`}
              >
                {restaurant.cuisine}
              </span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-800">
                {getPriceRangeText(restaurant.priceRange)}
              </span>
            </div>
          </div>
        </div>

        {/* 餐廳信息 */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-700">
            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
            <span className="truncate">{restaurant.address}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-900">
                  {restaurant.rating}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {restaurant.distance}km
                </span>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                restaurant.openNow
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {restaurant.openNow ? "營業中" : "已關閉"}
            </span>
          </div>
        </div>

        {/* 菜單資訊 */}
        {restaurant.menu && (
          <div className="mb-4 space-y-3">
            {/* 特色菜餚 */}
            {restaurant.menu.specialties &&
              restaurant.menu.specialties.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center text-sm font-medium text-gray-900">
                    <ChefHat className="w-4 h-4 mr-2 text-orange-500" />
                    特色菜餚
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {restaurant.menu.specialties
                      .slice(0, 3)
                      .map((dish, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full border border-orange-200"
                        >
                          {dish}
                        </span>
                      ))}
                    {restaurant.menu.specialties.length > 3 && (
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                        +{restaurant.menu.specialties.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

            {/* 熱門菜餚 */}
            {restaurant.menu.popularDishes &&
              restaurant.menu.popularDishes.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center text-sm font-medium text-gray-900">
                    <Heart className="w-4 h-4 mr-2 text-red-500" />
                    熱門菜餚
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {restaurant.menu.popularDishes
                      .slice(0, 3)
                      .map((dish, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full border border-red-200"
                        >
                          {dish}
                        </span>
                      ))}
                    {restaurant.menu.popularDishes.length > 3 && (
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                        +{restaurant.menu.popularDishes.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

            {/* 菜系類型 */}
            {restaurant.menu.cuisineType &&
              restaurant.menu.cuisineType.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center text-sm font-medium text-gray-900">
                    <Utensils className="w-4 h-4 mr-2 text-green-500" />
                    菜系類型
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {restaurant.menu.cuisineType.map((type, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* 操作按鈕 */}
        <div className="flex space-x-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(restaurant)}
              className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              查看詳情
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
