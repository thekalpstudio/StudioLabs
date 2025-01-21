"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Wallet, Lock } from "lucide-react";
import Navbar2 from "../../components/Navbar/Navbar2";
import Certificate from "../../components/Certificate/Certificate";
import useSBTApi, { ApiResponse } from "@/hooks/userSBT";
import { sendNotification } from "@/lib/notification";

// Types
interface FormData {
  recipientAddress: string;
  userName: string;
  userEmail: string;
  organization: string;
  dateOfIssue: string;
}

interface MintResult {
  status: "" | "success" | "error";
  message: string;
  hash: string;
}

interface NotificationData {
  name: string;
  transactionHash: string;
  view_link: string;
}

interface NotificationRecipient {
  userId: string;
  email: string;
}

// Components
interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  required = false,
  disabled = false,
}) => (
  <div className="mt-4">
    <label className="block text-sm font-medium mb-2 text-black">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700">
          {icon}
        </div>
      )}
      <input
        type={type}
        className={`w-full ${
          icon ? "pl-10" : "px-4"
        } py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  </div>
);

const WalletDisplay: React.FC<{ wallet: string }> = ({ wallet }) => (
  <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
    <div className="flex items-center mb-2">
      <Lock className="h-5 w-5 text-gray-500 mr-2" />
      <h3 className="font-medium text-gray-700">Wallet Address (Issuer)</h3>
    </div>
    <div className="bg-white p-3 rounded border border-gray-200">
      <code className="text-sm text-gray-600 break-all">{wallet}</code>
    </div>
  </div>
);

const MintButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}> = ({ onClick, disabled, loading }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`mt-8 w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-white font-medium ${
      disabled || loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-indigo-600 hover:bg-indigo-700 transition-colors"
    }`}
  >
    {loading ? (
      <div className="flex items-center">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span>Minting Certificate...</span>
      </div>
    ) : (
      <span>Issue Certification</span>
    )}
  </button>
);

const ResultAlert: React.FC<{ result: MintResult }> = ({ result }) => {
  const ExplorerLink = "https://kalpscan.io/transactions?transactionId=";
  
  if (!result.status) return null;
  
  return (
    <div className="mt-6">
      <p className={result.status === "success" ? "text-green-600" : "text-red-600"}>
        {result.message}
        {result.hash && (
          <>
            <span className="text-black"> Link to verify: </span>
            <Link href={`${ExplorerLink}${result.hash}`} target="_blank">
              <span className="text-blue-600">Click here</span>
            </Link>
          </>
        )}
      </p>
    </div>
  );
};

const MintSbt: React.FC = () => {
  const { mintSBT } = useSBTApi();
  const FIXED_WALLET = process.env.NEXT_PUBLIC_KALP_WALLET;
  const ExplorerLink = "https://kalpscan.io/transactions?transactionId=";

  const [formData, setFormData] = useState<FormData>({
    recipientAddress: "",
    userName: "",
    userEmail: "",
    organization: "Kalp Studio",
    dateOfIssue: "",
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<MintResult>({ status: "", message: "", hash: "" });

  const handleSendNotification = async (transactionHash: string) => {
    try {
      const notificationData: NotificationData = {
        name: formData.userName,
        transactionHash: `${ExplorerLink}${transactionHash}`,
        view_link: `${window.location.origin}/certificate/${formData.recipientAddress}`,
      };

      const recipient: NotificationRecipient = {
        userId: formData.recipientAddress,
        email: formData.userEmail,
      };

      await sendNotification(notificationData, recipient);
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const validateForm = () => {
    const { recipientAddress, userName, organization, dateOfIssue } = formData;
    return !!(recipientAddress && userName && organization && dateOfIssue);
  };

  const handleMint = async () => {
    if (!validateForm()) {
      setResult({
        status: "error",
        message: "All fields are required. Please fill in the form completely.",
        hash: "",
      });
      return;
    }

    setLoading(true);
    setResult({ status: "", message: "", hash: "" });

    try {
      const response = await mintSBT(
        formData.recipientAddress,
        formData.userName,
        formData.organization,
        formData.dateOfIssue
      ) as ApiResponse ;

      if (response.status === "FAILURE") {
        throw new Error("Failed to mint certification.");
      }

      const transactionHash = response?.result?.result?.txHash;
      await handleSendNotification(transactionHash);

      setResult({
        status: "success",
        message: "Certification SBT minted successfully! Your achievement is now permanently recorded on the blockchain.",
        hash: transactionHash,
      });

      // Reset form
      setFormData({
        recipientAddress: "",
        userName: "",
        userEmail: "",
        organization: "Kalp Studio",
        dateOfIssue: "",
      });
    } catch (error) {
      console.error("Mint error:", error);
      setResult({
        status: "error",
        message: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        hash: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar2 />
      <div className="flex gap-8 h-[100vh] bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-4">
        <div className="w-1/3 ml-16">
          <div className="bg-white rounded-2xl shadow-xl py-4 px-8">
            <FormInput
              label="User Name"
              value={formData.userName}
              onChange={(value) => setFormData({ ...formData, userName: value })}
              placeholder="Enter user name"
              required
            />
            
            <FormInput
              label="User Email"
              value={formData.userEmail}
              onChange={(value) => setFormData({ ...formData, userEmail: value })}
              placeholder="Enter user email"
              type="email"
              required
            />
            
            <FormInput
              label="Organization"
              value={formData.organization}
              onChange={() => setFormData({ ...formData, organization: "Kalp Studio" })}
              placeholder="Kalp Studio"
              disabled
              required
            />
            
            <FormInput
              label="Date of Issue"
              value={formData.dateOfIssue}
              onChange={(value) => setFormData({ ...formData, dateOfIssue: value })}
              type="date"
              required placeholder={""}            />
            
            <FormInput
              label="Student's Wallet Address (Recipient)"
              value={formData.recipientAddress}
              onChange={(value) => setFormData({ ...formData, recipientAddress: value })}
              placeholder="Enter recipient's wallet address"
              icon={<Wallet className="h-5 w-5" />}
              required
            />

            <WalletDisplay wallet={FIXED_WALLET || ""} />
            
            <MintButton
              onClick={handleMint}
              disabled={!validateForm()}
              loading={loading}
            />

            <ResultAlert result={result} />
          </div>
        </div>

        <Certificate
          name={formData.userName || "Your Name"}
          date={formData.dateOfIssue || "Date"}
          hash={formData.recipientAddress || "Recipient Address"}
        />
      </div>
    </div>
  );
};

export default MintSbt;