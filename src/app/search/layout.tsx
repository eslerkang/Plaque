import { BottomNav } from "@/components/BottomNav";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 pb-20">{children}</div>
      <BottomNav />
    </div>
  );
}
