import Card from "@/components/ui/Card";
import { DEFAULT_FEATURES, Feature } from "@/constants";

interface FeaturesProps {
  features?: Feature[];
}

export default function Features({ features }: FeaturesProps) {
  const displayFeatures = features || DEFAULT_FEATURES;

  return (
    <div>
      {/* 標題區域 */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          為什麼選擇 <span className="text-orange-600">FoodieAI</span>？
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          結合最新AI技術與豐富的餐廳資料庫，為您提供最智能的用餐建議
        </p>
      </div>

      {/* 特色卡片 */}
      <div className="grid md:grid-cols-3 gap-8">
        {displayFeatures.map((feature, index) => (
          <Card
            key={index}
            variant="outlined"
            className="text-center p-8 hover:border-orange-300 transition-colors duration-200"
          >
            <div
              className={`w-16 h-16 bg-gradient-to-br ${feature.bgColor} rounded-xl flex items-center justify-center mx-auto mb-6`}
            >
              <div className={feature.iconColor}>{feature.icon}</div>
            </div>
            <h4 className="text-xl font-semibold mb-4 text-gray-900">
              {feature.title}
            </h4>
            <p className="text-gray-600 leading-relaxed">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
