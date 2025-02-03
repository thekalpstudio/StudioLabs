"use client";

import { ProjectCard } from "@/components/project-card";
import { useEffect, useState } from "react";
import { Project, ApiResponse } from "./types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Header } from "@/components/header";
import { calculateDaysLeft } from "@/lib/utils";

const API_CONFIG = {
  URL: process.env.NEXT_PUBLIC_API_URL as string,
  KEY: process.env.NEXT_PUBLIC_API_KEY as string,
  NETWORK: "TESTNET",
  BLOCKCHAIN: "KALP",
  WALLET_ADDRESS: "f7ab37ac45651c19cd73fba93b1b1a2b5fe18e3e",
} as const;

async function fetchProjects(): Promise<Project[]> {
  try {
    const response = await fetch(API_CONFIG.URL, {
      method: "POST",
      headers: {
        "x-api-key": API_CONFIG.KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        network: API_CONFIG.NETWORK,
        blockchain: API_CONFIG.BLOCKCHAIN,
        walletAddress: API_CONFIG.WALLET_ADDRESS,
        args: {},
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    
    if (data.status !== "SUCCESS" || !data.result.success) {
      throw new Error("API returned unsuccessful response");
    }

    return data.result.result
      .map((project: any) => ({
        ...project,
        daysLeft: calculateDaysLeft(project.deadline),
      }))
      .reverse();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to fetch projects");
  }
}




export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const fetchedProjects = await fetchProjects();
        setProjects(fetchedProjects);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <Header />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-pulse text-lg">Loading projects...</div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </main>
  );
}
