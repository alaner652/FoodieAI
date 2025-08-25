interface FooterProps {
  copyright?: string;
}

export default function Footer({
  copyright = "© 2024 FoodieAI. 讓 AI 幫您解決選擇困難症。",
}: FooterProps) {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-700">
        <p>{copyright}</p>
      </div>
    </footer>
  );
}
