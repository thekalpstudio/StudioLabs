"use client";

import { useState } from "react";
import { AlertCircle, Loader } from "lucide-react";
import Navbar2 from "../../components/Navbar/Navbar2";
import Certificate from "../../components/Certificate/Certificate";
import useSBTApi, { ApiResponse } from "../../hooks/userSBT";

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

interface FormProps {
  owner: string;
  onOwnerChange: (value: string) => void;
  onVerify: () => void;
  isLoading: boolean;
}

// Components
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center justify-center space-x-2 text-red-600 mt-4 text-center">
    <AlertCircle className="w-4 h-4" />
    <p>{message}</p>
  </div>
);

const VerificationForm: React.FC<FormProps> = ({
  owner,
  onOwnerChange,
  onVerify,
  isLoading
}) => (
  <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
    <div>
      <label 
        htmlFor="ownerAddress"
        className="block text-sm font-medium my-2 text-gray-700"
      >
        Owner Wallet Address
      </label>
      <div className="flex space-x-2">
        <input
          id="ownerAddress"
          type="text"
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter owner's address"
          value={owner}
          onChange={(e) => onOwnerChange(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          onClick={onVerify}
          disabled={isLoading || !owner.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            'Verify'
          )}
        </button>
      </div>
    </div>
  </form>
);

const OwnershipChecker: React.FC = () => {
  const { getSBTByOwner } = useSBTApi();
  
  const [owner, setOwner] = useState<string>("");
  const [ownership, setOwnership] = useState<OwnershipData | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const parseMetadata = (response: ApiResponse): Metadata => {
    try {
      return JSON.parse(response.result.result.metadata);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error("Failed to parse certificate metadata");
    }
  };

  const handleCheck = async () => {
    if (!owner.trim()) return;

    setError("");
    setOwnership(null);
    setIsLoading(true);

    try {
      const response = await getSBTByOwner(owner) as ApiResponse;
     
      if (response.result.success) {
        const parsedMetadata = parseMetadata(response);

        setOwnership({
          owner: response.result.result.owner,
          tokenID: response.result.result[1],
          metadata: parsedMetadata,
        });
      } else {
        setError("No certificate found for this owner.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "An error occurred while verifying the certificate.";
      console.error("Verification error:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar2 />
      <main className="flex gap-12 justify-center min-h-screen items-center bg-gradient-to-b from-indigo-50 to-white">
        <div className="w-full max-w-md bg-white ml-8 py-4 px-6 rounded-xl shadow-lg">
          <VerificationForm
            owner={owner}
            onOwnerChange={setOwner}
            onVerify={handleCheck}
            isLoading={isLoading}
          />
          
          {error && <ErrorMessage message={error} />}
        </div>

        {ownership && (
          <Certificate
            name={ownership.metadata.name}
            date={ownership.metadata.dateOfIssue}
            hash={ownership.tokenID}
          />
        )}
      </main>
    </div>
  );
};

export default OwnershipChecker;