"use client";

import { useState, useEffect } from "react";
import { Shield, AlertCircle, Loader, Copy, Check } from "lucide-react";
import Navbar2 from "../../components/Navbar/Navbar2";
import useSBTApi from "../../hooks/userSBT";

// Types
interface TokenCardProps {
  id: string;
}

interface APIResponse {
  result: {
    success: boolean;
    result: string[];
  };
}

// Components
const TokenCard: React.FC<TokenCardProps> = ({ id }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6">
      <div className="flex items-start justify-between">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <Shield className="w-5 h-5 text-indigo-600" />
        </div>
        <button
          onClick={copyToClipboard}
          className="text-gray-400 hover:text-indigo-600 transition-colors"
          title="Copy ID"
          aria-label={copied ? "Copied" : "Copy ID"}
        >
          {copied ? (
            <Check className="w-5 h-5" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </button>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">Token ID</p>
        <p className="font-mono text-sm text-gray-800 break-all">{id}</p>
      </div>
    </div>
  );
};

const Header: React.FC = () => (
  <div className="text-center mb-12">
    <h1 className="text-4xl font-bold text-gray-800 mb-4">
      Certificate Tokens Registry
    </h1>
    <p className="text-gray-600 max-w-2xl mx-auto">
      View all Soulbound Tokens issued by the Organization. Each token represents a unique certification or achievement.
    </p>
  </div>
);

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <Loader className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
    <p className="text-gray-600">Loading Soulbound Tokens...</p>
  </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center justify-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl">
    <AlertCircle className="w-5 h-5" />
    <p>{message}</p>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center py-12 bg-white rounded-xl shadow-md">
    <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
    <p className="text-gray-600">No tokens have been issued yet.</p>
  </div>
);

const BackgroundDecorations: React.FC = () => (
  <div className="fixed -z-10 top-0 left-0 w-full h-full pointer-events-none">
    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2" />
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2" />
  </div>
);

const AllSBTPage: React.FC = () => {
  const { getAllTokenIDs } = useSBTApi();
  const [tokenIDs, setTokenIDs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTokenIDs = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getAllTokenIDs() as unknown as APIResponse;
        if (response.result.success) {
          setTokenIDs(response.result.result);
        } else {
          setError("Failed to fetch SBT IDs.");
        }
      } catch (err) {
        console.error('Error fetching token IDs:', err);
        setError("An error occurred while fetching SBT IDs.");
      } finally {
        setLoading(false);
      }
    };

    fetchTokenIDs();
  }, []);

  const renderContent = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (!tokenIDs.length) return <EmptyState />;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tokenIDs.map((id) => (
          <TokenCard key={id} id={id} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Navbar2 />
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <Header />
          <div className="relative">
            {renderContent()}
          </div>
        </div>
      </main>
      <BackgroundDecorations />
    </div>
  );
};

export default AllSBTPage;