"use client";

import { Project } from "@/app/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { Clock } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const progress = (project.raised / project.goal) * 100;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold">{project.title}</h3>
            <p className="text-sm text-muted-foreground">by {project.creator}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {project.description}
        </p>
        <Progress value={progress} className="h-2" />
        <div className="mt-4 flex justify-between text-sm">
          <span className="font-medium">${project.raised.toLocaleString()} raised</span>
          <span className="text-muted-foreground">${project.goal.toLocaleString()} goal</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{project.daysLeft} days left</span>
        </div>
        <Button 
          onClick={() => router.push(`/project/${project.id}`)}
          variant="secondary"
        >
          View Project
        </Button>
      </CardFooter>
    </Card>
  );
}