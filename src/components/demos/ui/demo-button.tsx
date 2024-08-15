import { useToggle } from "@/components/hooks/use-toggle";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function DemoButton() {
  const [loading, toggle] = useToggle(false);

  return (
    <div className="space-y-4">
      <Switch onClick={toggle}>Loading</Switch>
      <Button loading={loading} className="w-full">
        Button
      </Button>
    </div>
  );
}
