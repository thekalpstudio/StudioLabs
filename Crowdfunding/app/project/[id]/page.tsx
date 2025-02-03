"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Copy, Check } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Project {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  image: string;
  creator: string;
  walletAddress: string;
  deadline: number;
}

const API_CONFIG = {
  URL: process.env.NEXT_PUBLIC_PROJECT_BY_ID_API_URL as string,
  KEY: process.env.NEXT_PUBLIC_API_KEY as string,
  NETWORK: "TESTNET",
  BLOCKCHAIN: "KALP",
  WALLET_ADDRESS: "f7ab37ac45651c19cd73fba93b1b1a2b5fe18e3e",
} as const;


export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      try {
        const response = await fetch(API_CONFIG.URL, {
          method: 'POST',
          headers: {
            'x-api-key': API_CONFIG.KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            network: API_CONFIG.NETWORK,
            blockchain: API_CONFIG.BLOCKCHAIN,
            walletAddress: API_CONFIG.WALLET_ADDRESS,
            args: {
              id: id
            }
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }

        const data = await response.json();
        
        if (data.status === "SUCCESS" && data.result.success) {
          setProject(data.result.result);
        } else {
          throw new Error(data.message || 'Failed to fetch project');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching the project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(project?.walletAddress || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 text-muted-foreground">⚠️</div>
          <h1 className="mb-2 text-2xl font-bold">Project Not Found</h1>
          <p className="text-muted-foreground">
            {error || "The project you're looking for doesn't exist or has been removed."}
          </p>
        </div>
      </div>
    );
  }

  // Calculate progress and days left
  const progress = (project.raised / project.goal) * 100;
  const daysLeft = Math.max(0, Math.floor((project.deadline - Date.now() / 1000) / (24 * 60 * 60)));

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
          <h1 className="mb-2 text-3xl font-bold">{project.title}</h1>
          <p className="mb-6 text-lg text-muted-foreground">
            by {project.creator}
          </p>
          <div className="prose max-w-none">
            <p>{project.description}</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <Progress value={progress} className="h-2" />
            <div className="mt-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-lg font-medium">
                  ${project.raised.toLocaleString()}
                </span>
                <span className="text-muted-foreground">
                  ${project.goal.toLocaleString()} goal
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <span>{daysLeft} days left</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Support this project</h3>
            <div className="mb-6 flex justify-center">
              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ethereum:${project.walletAddress}`}
                alt="Wallet QR Code"
                width={200}
                height={200}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-lg border p-3">
                <code className="flex-1 break-all text-sm">{project.walletAddress}</code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="h-8 w-8"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Scan the QR code or copy the wallet address to donate any amount to support this project.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}