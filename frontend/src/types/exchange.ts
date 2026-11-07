
export interface KeyExchangeResult {
  p: number;
  g: number;
  alice_public: number;
  bob_public: number;
  alice_shared_secret: number;
  bob_shared_secret: number;
  secrets_match: boolean;
}

export interface AuthenticatedExchangeResult {
  scenario: string;
  alice_public: number;
  bob_public: number;
  alice_signature_valid: boolean;
  bob_signature_valid: boolean;
  alice_signing_public_key: string;
  bob_signing_public_key: string;
  shared_secrets_match: boolean;
  mallory_substituted_value: number;
  substitution_rejected: boolean;
  attack_blocked: boolean;
  security_note: string;
}