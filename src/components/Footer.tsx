import { APP_CONFIG } from "@/lib/config";
import Container from "@/components/ui/Container";

interface FooterProps {
  copyright?: string;
}

export default function Footer({
  copyright = `© 2024 ${APP_CONFIG.NAME}. 讓 AI 幫您解決選擇困難症。`,
}: FooterProps) {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <Container maxWidth="7xl" className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">{copyright}</p>
        </div>
      </Container>
    </footer>
  );
}
