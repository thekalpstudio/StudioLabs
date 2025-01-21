"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AlertCircle, Loader } from "lucide-react";
import Certificate from "../../../components/Certificate/Certificate";
import useSBTApi, { ApiResponse } from "../../../hooks/userSBT";

// Types
interface Metadata {
  name: string;
  dateOfIssue: string;
  [key: string]: string;
}

interface OwnershipData {
  owner: string;
  tokenID: string;
  metadata: Metadata;
}

// Components
const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center">
    <Loader className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
    <p className="text-gray-600">Loading Certificate...</p>
  </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center justify-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl">
    <AlertCircle className="w-5 h-5" />
    <p>{message}</p>
  </div>
);

const CertificateViewer: React.FC = () => {
  const params = useParams();
  const { getSBTByOwner } = useSBTApi();
  
  const [ownership, setOwnership] = useState<OwnershipData | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const parseMetadata = (response: ApiResponse): Metadata => {
    try {
      return JSON.parse(response.result.result.metadata);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error("Failed to parse certificate metadata");
    }
  };

  const handleCheck = async (owner: string) => {
    if (!owner) {
      setError("Invalid address provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setOwnership(null);

      const response = await getSBTByOwner(owner) as ApiResponse;

      if (response.result.success) {
        const parsedMetadata = parseMetadata(response);

        setOwnership({
          owner: response.result.result.owner,
          tokenID: response.result.result[1],
          metadata: parsedMetadata,
        });
      } else {
        setError("No certificate found for this address.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "An error occurred while loading the certificate.";
      console.error("Certificate loading error:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const address = params.address as string;
    handleCheck(address);
  }, [params.address]);

  const renderContent = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorMessage message={error} />;
    if (!ownership) return null;

    return (
      <Certificate
        name={ownership.metadata.name || "Your Name"}
        date={ownership.metadata.dateOfIssue || "Date"}
        hash={ownership.tokenID || "Recipient Address"}
      />
    );
  };

  return (
    <div>
      <main className="flex gap-12 justify-center min-h-screen bg-gradient-to-br items-center from-gray-50 to-indigo-50">
        {renderContent()}
      </main>
    </div>
  );
};

export default CertificateViewer;