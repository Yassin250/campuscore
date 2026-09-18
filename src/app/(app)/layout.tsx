import { Shell } from "@/components/layout/shell";
import { React } from "next/dist/server/route-modules/app-page/vendored/ssr/entrypoints";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Shell>{children}</Shell>;
}