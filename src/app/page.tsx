import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HomeClient from "@/components/HomeClient";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-4xl mx-auto px-4 py-8">
          <Hero />

          <HomeClient />

          <Features />
        </main>

        <Footer />
      </div>
    </>
  );
}
