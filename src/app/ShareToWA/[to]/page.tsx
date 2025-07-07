"use client";
import ShareToWA from "../../ShareToWA";

export default function Page({ params }: { params: { to: string } }) {
  const nama = decodeURIComponent(params.to || "");
  return <ShareToWA initialNama={nama} />;
} 