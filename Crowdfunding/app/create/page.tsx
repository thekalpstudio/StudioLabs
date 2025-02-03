"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

const API_CONFIG = {
  URL: process.env.NEXT_PUBLIC_CREATE_PROJECT_API_URL as string,
  KEY: process.env.NEXT_PUBLIC_API_KEY as string,
  NETWORK: "TESTNET",
  BLOCKCHAIN: "KALP",
  WALLET_ADDRESS: "f7ab37ac45651c19cd73fba93b1b1a2b5fe18e3e",
} as const;

export default function CreateProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    image: "",
    walletAddress: "",
    organizationName: "",
    deadline: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const deadlineDate = new Date(formData.deadline);
      const deadlineTimestamp = Math.floor(deadlineDate.getTime() / 1000);
      const projectId = Math.floor(Math.random() * 1000).toString();

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
            id: projectId,
            title: formData.title,
            description: formData.description,
            goal: formData.goal,
            image: formData.image,
            creator: formData.organizationName,
            walletAddress: formData.walletAddress,
            deadline: deadlineTimestamp
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const data = await response.json();
      
      if (data.status === "SUCCESS") {
        // Redirect to home page on success
        router.push('/');
      } else {
        throw new Error(data.message || 'Failed to create project');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Create Your Project</h1>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Project Title
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter your project title"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="organizationName" className="text-sm font-medium">
                Organization Name
              </label>
              <Input
                id="organizationName"
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                placeholder="Enter your organization name"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your project"
                required
                className="min-h-[150px]"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="goal" className="text-sm font-medium">
                Funding Goal ($)
              </label>
              <Input
                id="goal"
                type="number"
                min="1"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                placeholder="Enter your funding goal"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="walletAddress" className="text-sm font-medium">
                Wallet Address
              </label>
              <Input
                id="walletAddress"
                value={formData.walletAddress}
                onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                placeholder="Enter your wallet address"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="deadline" className="text-sm font-medium">
                Fundraising Deadline
              </label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">
                Project Image URL
              </label>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="Enter an image URL for your project"
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                  Creating Project...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}