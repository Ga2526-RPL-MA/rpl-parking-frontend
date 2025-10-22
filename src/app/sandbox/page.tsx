import Link from "next/link";

import Typography from "@/components/Typography";
import { Button } from "@/components/ui/button";

export default function SandboxPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-8">
      <Typography variant="h1" weight="bold">
        Sandbox
      </Typography>

      <div className="flex flex-wrap gap-5">
        {sandboxContent.map((item, index) => (
          <Link key={index} className="mt-4" href={item.href}>
            <Button variant="outline">{item.name}</Button>
          </Link>
        ))}
        
      </div>
    </main>
  );
}

const sandboxContent = [
  {
    href: "/sandbox/form",
    name: "Form",
  },
  {
    href: "/sandbox/typography",
    name: "Typography",
  },
  {
    href: "/sandbox/button",
    name: "Buttons",
  },
];
