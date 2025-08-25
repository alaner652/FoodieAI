import { Clock, MapPin, Sparkles } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}

interface FeaturesProps {
  features?: Feature[];
}

export default function Features({ features }: FeaturesProps) {
  const defaultFeatures: Feature[] = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI 智能分析",
      description: "運用 AI 技術，深度理解您的偏好，提供個性化推薦",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "精準定位",
      description: "結合位置數據，確保推薦的餐廳都在您方便到達的範圍內",
      bgColor: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "快速決策",
      description: "告別選擇困難症，幾秒鐘內獲得最適合的餐廳推薦",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  const displayFeatures = features || defaultFeatures;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-center text-gray-900 mb-6">
        為什麼選擇 FoodieAI？
      </h3>
      <div className="grid md:grid-cols-3 gap-4">
        {displayFeatures.map((feature, index) => (
          <div key={index} className="text-center p-3">
            <div
              className={`w-10 h-10 ${feature.bgColor} rounded flex items-center justify-center mx-auto mb-2`}
            >
              <div className={feature.iconColor}>{feature.icon}</div>
            </div>
            <h4 className="text-base font-medium mb-2 text-gray-900">
              {feature.title}
            </h4>
            <p className="text-gray-800 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
