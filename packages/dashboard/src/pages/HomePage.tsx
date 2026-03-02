import FFNavbar from "@/components/FFNavbar";
import FFHero from "@/components/FFHero";
import FFFeatures from "@/components/FFFeatures";
import FFHowItWorks from "@/components/FFHowItWorks";
import FFArchitecture from "@/components/FFArchitecture";
import FFStack from "@/components/FFStack";
import FFCTA from "@/components/FFCTA";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#060608] text-[#f5f5f5]">
      <FFNavbar />
      <FFHero />
      <FFFeatures />
      <FFHowItWorks />
      <FFArchitecture />
      <FFStack />
      <FFCTA />
    </div>
  );
}
