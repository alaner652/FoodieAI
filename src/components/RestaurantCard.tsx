import Button from "@/components/ui/Button";
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
      className="hover:border-orange-300 hover:shadow-md transition-all duration-200 overflow-hidden w-full max-w-full group"
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
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 break-words">
              {restaurant.name}
            </h3>
            <div className="flex items-center space-x-2 mb-3">
              <span className="px-2 py-1 rounded text-xs font-medium bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 border border-orange-200">
                {getPriceRangeText(restaurant.priceRange)}
              </span>
            </div>
          </div>
        </div>

        {/* Restaurant Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-start text-sm text-gray-700">
            <MapPin className="w-4 h-4 mr-2 text-orange-500 mt-0.5 flex-shrink-0" />
            <span className="break-words leading-relaxed">
              {restaurant.address}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-orange-400 fill-current" />
                <span className="text-sm font-medium text-gray-900">
                  {restaurant.rating}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-pink-500" />
                <span className="text-sm text-gray-700">
                  {restaurant.distance}km
                </span>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                restaurant.openNow
                  ? "bg-orange-100 text-orange-700 border border-orange-200"
                  : "bg-gray-100 text-gray-700 border border-gray-200"
              }`}
            >
              {restaurant.openNow ? "營業中" : "已關閉"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="gradient"
            className={`bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 text-center shadow-sm hover:shadow-md transform hover:scale-[1.02] ${
              restaurant.website ? "flex-1" : "w-full"
            }`}
            onClick={() => {
              const url =
                restaurant.mapsUrl ||
                `https://www.google.com/maps/search/${encodeURIComponent(
                  restaurant.name + " " + restaurant.address
                )}`;
              window.open(url, "_blank", "noopener,noreferrer");
            }}
          >
            在 Google Maps 查看
          </Button>

          {restaurant.website && (
            <Button
              variant="gradient"
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 text-center shadow-sm hover:shadow-md transform hover:scale-[1.02]"
              onClick={() => {
                window.open(
                  restaurant.website,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              官方網站
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
