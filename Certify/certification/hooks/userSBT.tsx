'use client';

// Types
interface ApiConfig {
  baseURL: string;
  fixedWallet: string;
  contractId: string;
}

interface ApiResponse<T = any> {
  status: 'SUCCESS' | 'FAILURE';
  result?: T;
  error?: string;
}

interface RequestConfig {
  network: string;
  blockchain: string;
  walletAddress: string;
  args?: Record<string, any>;
}

interface SBTDetails {
  name: string;
  organization: string;
  dateOfIssue: string;
  owner: string;
  tokenID: string;
}

// API Configuration
const API_CONFIG: ApiConfig = {
  baseURL: 'https://gateway-api.kalp.studio/v1/contract/kalp',
  fixedWallet: '4694bc679e57ba241ae27ea5d3d72d00f12f1f34',
  contractId: '7ZSLwrP7ga8pKAHD3sVFMBK30HGwEEHl1735894098028'
} as const;

// Utility functions
const createRequestConfig = (args?: Record<string, any>): RequestConfig => ({
  network: 'TESTNET',
  blockchain: 'KALP',
  walletAddress: API_CONFIG.fixedWallet,
  ...(args && { args })
});

async function makeRequest<T>(
  endpoint: string,
  args?: Record<string, any>,
  isQuery: boolean = false
): Promise<ApiResponse<T>> {
  const path = isQuery ? 'query' : 'invoke';
  const url = `${API_CONFIG.baseURL}/${path}/${API_CONFIG.contractId}/${endpoint}`;

  try {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
      throw new Error('API key is not configured');
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(createRequestConfig(args)),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error in ${endpoint}:`, error);
    return {
      status: 'FAILURE',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Main hook
const useSBTApi = () => {
  const initialize = async (description: string) => {
    return makeRequest<{ success: boolean }>(
      'Initialize',
      { description }
    );
  };

  const mintSBT = async (
    recipientAddress: string,
    user_name: string,
    organization: string,
    date_of_issue: string
  ) => {
    return makeRequest<{ tokenId: string }>(
      'MintSBT',
      {
        address: recipientAddress,
        name: user_name,
        organization,
        dateOfIssue: date_of_issue,
      }
    );
  };

  const querySBT = async (owner: string, tokenId: string) => {
    return makeRequest<SBTDetails>(
      'QuerySBT',
      { owner, tokenID: tokenId },
      true
    );
  };

  const getSBTByOwner = async (owner: string) => {
    return makeRequest<SBTDetails[]>(
      'GetSBTByOwner',
      { owner },
      true
    );
  };

  const getAllTokenIDs = async () => {
    return makeRequest<string[]>(
      'GetAllTokenIDs',
      undefined,
      true
    );
  };

  const attemptTransfer = async (from: string, to: string, tokenId: string) => {
    return makeRequest<{ success: boolean; message?: string }>(
      'TransferSBT',
      { from, to, tokenID: tokenId },
      true
    );
  };

  return {
    initialize,
    mintSBT,
    querySBT,
    getSBTByOwner,
    getAllTokenIDs,
    attemptTransfer,
  };
};

export type { ApiResponse, SBTDetails };
export default useSBTApi;