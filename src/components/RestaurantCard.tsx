import Card from "@/components/ui/Card";
import { getPriceRangeText } from "@/lib/utils";
import { Restaurant } from "@/types";
import { Clock, MapPin, Star } from "lucide-react";
import Image from "next/image";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card
      variant="outlined"
      className="hover:border-gray-300 transition-colors overflow-hidden"
    >
      <div className="w-full h-44 bg-gray-100 relative">
        <Image
          src={restaurant.photoUrl || "/window.svg"}
          alt={restaurant.name}
          fill
          className="object-cover"
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

        {/* 操作按鈕 */}
        <div className="flex space-x-2">
          <a
            href={
              restaurant.mapsUrl ||
              `https://www.google.com/maps/search/${encodeURIComponent(
                restaurant.name + " " + restaurant.address
              )}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition-colors text-center"
          >
            在 Google Maps 查看
          </a>
        </div>
      </div>
    </Card>
  );
}
