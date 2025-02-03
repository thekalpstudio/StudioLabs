import { CircleDollarSign } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <CircleDollarSign className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">CrowdFund</span>
        </Link>
      </div>
    </nav>
  );
}