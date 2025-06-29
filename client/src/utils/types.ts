export interface Movement {
  id: string;
  type: "transfer" | "deposit" | "withdrawal";
  amount: string;
  description: string;
  date: string;
  created_at: string;
  recipientUsername?: string;
  senderUsername?: string;
}

export interface MovementState {
  status: "idle" | "loading" | "succeeded" | "failed";
  movements: Movement[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  error: string | null;
}

export interface LoanFormData {
  amount: string;
}

export interface TransferFormData {
  amount: number;
  recipientUsername: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  movement: Movement;
}
