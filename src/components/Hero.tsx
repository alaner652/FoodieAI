interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

export default function Hero({
  title = "不知道吃什麼？",
  subtitle = "AI 幫您決定",
  description = "告訴我們您的偏好，AI 會為您推薦最適合的餐廳",
}: HeroProps) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
        {title}
        <br />
        <span className="text-orange-600">{subtitle}</span>
      </h2>
      <p className="text-lg text-gray-700 max-w-2xl mx-auto">{description}</p>
    </div>
  );
}
