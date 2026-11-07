import { apiRequest } from "./api";
import type { MitmAttackResult } from "../types/attack";

export interface MitmAttackInput {
  p: number;
  g: number;
  alice_private: number;
  bob_private: number;
  mallory_for_alice: number;
  mallory_for_bob: number;
}

export async function runMitmAttack(
  input: MitmAttackInput
): Promise<MitmAttackResult> {
  return apiRequest<MitmAttackResult>("/api/attack/mitm", {
    method: "POST",
    body: JSON.stringify(input),
  });
}