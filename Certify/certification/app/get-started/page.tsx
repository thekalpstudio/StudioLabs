"use client"

import React from "react";
import { Shield, Award, ExternalLink, FileCheck, LucideIcon } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar2";

// Types
interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  options: string[];
  path: string;
}

interface FeatureConfig {
  title: string;
  description: string;
  icon: LucideIcon;
  options: string[];
  path: string;
}

// Components
const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  options,
  path,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transform hover:scale-105 transition-transform duration-300">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center">
          <Icon className="w-10 h-10 text-indigo-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600">{description}</p>
        
        <div className="space-y-4 w-full">
          {options.map((option, index) => (
            <div 
              key={`${title}-option-${index}`}
              className="flex items-center space-x-3 text-gray-700"
            >
              <FileCheck className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              <span>{option}</span>
            </div>
          ))}
        </div>

        <a 
          href={path}
          className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2 group"
        >
          <span>Get Started</span>
          <ExternalLink className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
};

const Header: React.FC = () => (
  <div className="text-center mb-12">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">
      Choose Your Path
    </h1>
    <p className="text-gray-600 max-w-2xl mx-auto">
      Select whether you want to verify an existing certificate or issue a new one using our secure blockchain technology.
    </p>
  </div>
);

const GetStarted: React.FC = () => {
  // Configuration objects
  const features: FeatureConfig[] = [
    {
      title: "Verify Certificate",
      description: "Enter to verify the authenticity and validity of the certificate",
      icon: Shield,
      options: [
        "Verify the certificate authenticity",
        "Look up the certificate details",
      ],
      path: "/ownership-check",
    },
    {
      title: "Issue Certificate",
      description: "Enter to issue a certificate to a candidate",
      icon: Award,
      options: [
        "Issue a Certificate",
        "Preview the certificate",
      ],
      path: "/mint-sbt",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <div className="container mx-auto px-6 py-12">
          <Header />
          
          <div className="flex flex-col lg:flex-row justify-center items-center gap-8 mb-16">
            {features.map((feature, index) => (
              <FeatureCard
                key={`feature-${index}`}
                {...feature}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default GetStarted;