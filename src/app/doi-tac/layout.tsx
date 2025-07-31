import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đối tác | Beauty Studio",
  description: "Khu vực dành cho đối tác Beauty Studio",
};

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
