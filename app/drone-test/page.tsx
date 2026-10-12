import type { Metadata } from "next";
import DroneTest from "./DroneTest";

// Private test page: not linked from the site and not indexed.
export const metadata: Metadata = {
  title: "Drone test",
  robots: { index: false, follow: false },
};

export default function DroneTestPage() {
  return <DroneTest />;
}
