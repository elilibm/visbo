import VisionRow from "@/components/VisionRow";

export default function Home() {
  return (
    <main className="p-8 space-y-4">
      <VisionRow goal="Run a 5 km race under 25 min" />
      <VisionRow goal="Read 20 books this year" />
      {/* …more rows… */}
    </main>
  );
}
