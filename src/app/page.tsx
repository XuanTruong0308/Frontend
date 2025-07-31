import Hero from "@/components/Hero";
import HighlightServices from "@/components/HighlightServices";
import WorkingProcess from "@/components/WorkingProcess";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <HighlightServices />
      <WorkingProcess />
    </div>
  );
}
