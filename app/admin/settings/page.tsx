"use client";

import { useRouter } from "next/navigation";
import SettingsTab from "../components/SettingsTab";

export default function SettingsPage() {
  const router = useRouter();
  return <SettingsTab onSignOut={() => router.push("/admin")} />;
}
