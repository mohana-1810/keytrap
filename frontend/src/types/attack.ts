
export interface MitmAttackResult {
  attack: string;
  p: number;
  g: number;
  alice_public: number;
  bob_public: number;
  mallory_public_for_alice: number;
  mallory_public_for_bob: number;
  alice_secret_matches_mallory: boolean;
  bob_secret_matches_mallory: boolean;
  alice_and_bob_share_same_secret: boolean;
  attack_successful: boolean;
}