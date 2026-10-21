import { setFlagValue } from "@/app/actions";
import { OptimisticSwitch } from "@/components/optimistic-switch";
export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <main className="p-8">
      <h1>bindtest</h1>
      <OptimisticSwitch checked={false} label="x" action={setFlagValue.bind(null, "auth.email")} successMessage={() => "ok"} />
    </main>
  );
}
