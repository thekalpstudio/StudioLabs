import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;
const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID!;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
  },
});

export interface PlaceBetParams {
  betId: string;
  player: string;
  betType: 'number';
  betNumber: number;
  betAmount: number;
}

export interface SpinWheelParams {
  betId: string;
  playerSeed: number;
}

export interface GetBetParams {
  betId: string;
}

export const placeBet = async (params: PlaceBetParams) => {
  const response = await api.post(`/invoke/${CONTRACT_ID}/PlaceBet`, {
    network: 'TESTNET',
    blockchain: 'KALP',
    walletAddress: params.player,
    args: params,
  });
  return response.data;
};

export const spinWheel = async (params: SpinWheelParams) => {
  const response = await api.post(`/invoke/${CONTRACT_ID}/SpinWheel`, {
    network: 'TESTNET',
    blockchain: 'KALP',
    walletAddress: 'f7ab37ac45651c19cd73fba93b1b1a2b5fe18e3e',
    args: params,
  });
  return response.data;
};

export const getBet = async (params: GetBetParams) => {
  const response = await api.post(`/query/${CONTRACT_ID}/GetBet`, {
    network: 'TESTNET',
    blockchain: 'KALP',
    walletAddress: 'f7ab37ac45651c19cd73fba93b1b1a2b5fe18e3e',
    args: params,
  });
  return response.data;
};