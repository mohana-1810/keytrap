import { apiRequest } from "./api";
import type { AuthenticatedExchangeResult } from "../types/exchange";

export interface AuthenticatedExchangeInput {
  p: number;
  g: number;
  alice_private: number;
  bob_private: number;
}

export async function runAuthenticatedExchange(
  input: AuthenticatedExchangeInput
): Promise<AuthenticatedExchangeResult> {
  return apiRequest<AuthenticatedExchangeResult>(
    "/api/authentication/demo",
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );
}