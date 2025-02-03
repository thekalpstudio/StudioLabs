import Link from "next/link";
import { Button } from "./ui/button";
import { Rocket } from "lucide-react";

function CreateProjectButton() {
  return (
    <div className="mb-12 flex justify-center">
      <Link href="/create">
        <Button size="lg" className="gap-2">
          <Rocket className="h-5 w-5" />
          Start Your Project
        </Button>
      </Link>
    </div>
  );
}

export function Header() {
    return (
    <div>
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Mini Crowdfunding Platform</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Support innovative projects and help bring creative ideas to life.
          Learn how crowdfunding works by exploring our platform.
        </p>
      </div>
      <CreateProjectButton/>
      </div>
    );
  }