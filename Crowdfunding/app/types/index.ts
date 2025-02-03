export interface Project {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  image: string;
  creator: string;
  deadline: number;
  daysLeft: number;
}

export interface ApiResponse {
  status: string;
  result: {
    success: boolean;
    result: Project[];
  };
}

export interface DonationTier {
  id: string;
  name: string;
  amount: number;
  description: string;
}