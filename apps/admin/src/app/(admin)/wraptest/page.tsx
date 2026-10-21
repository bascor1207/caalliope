import { FlagSwitch } from "./flag-switch";
export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <main className="p-8">
      <h1>wraptest</h1>
      <FlagSwitch flagKey="auth.email" checked={false} />
    </main>
  );
}
