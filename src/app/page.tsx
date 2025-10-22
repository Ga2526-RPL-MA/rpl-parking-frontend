import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Button>
        <Link href="/sandbox">Go To Sandbox</Link>
      </Button>
    </div>
  );
}
