
import { apiRequest } from "./api";
import type { KeyExchangeResult } from "../types/exchange";

export interface KeyExchangeInput {
  p: number;
  g: number;
  alice_private: number;
  bob_private: number;
}

export async function runKeyExchange(
  input: KeyExchangeInput
): Promise<KeyExchangeResult> {
  return apiRequest<KeyExchangeResult>("/api/exchange/demo", {
    method: "POST",
    body: JSON.stringify(input),
  });
}