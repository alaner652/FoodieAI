import Container from "@/components/ui/Container";
import { APP_CONFIG } from "@/lib/config";

interface FooterProps {
  copyright?: string;
}

export default function Footer({
  copyright = `© 2024 ${APP_CONFIG.NAME}. 讓 AI 幫您解決選擇困難症。`,
}: FooterProps) {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <Container maxWidth="4xl" className="px-4 py-6 text-center text-gray-700">
        <p>{copyright}</p>
      </Container>
    </footer>
  );
}
