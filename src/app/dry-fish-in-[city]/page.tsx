import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface DryFishInCityPageProps {
  params: Promise<{ city?: string }>;
}

export default async function DryFishInCityPage({ params }: DryFishInCityPageProps) {
  const resolvedParams = (await params) || {};
  const city = resolvedParams.city || "hyderabad";
  redirect(`/location/${city}`);
}
