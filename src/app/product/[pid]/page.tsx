import { HydrateClient } from "@/trpc/server";
import SingleView from "../_components/single-view";

export default async function ProductView({
  params,
}: {
  params: Promise<{ pid: string }>;
}) {
  const { pid } = await params;

  return (
    <HydrateClient>
      <main className="mt-4 flex min-h-screen flex-col items-center gap-16 bg-gradient-to-b from-primary-800 to-primary-900 p-2 py-20 font-subhead text-headings lg:p-8">
        <SingleView pid={pid} />
      </main>
    </HydrateClient>
  );
}
