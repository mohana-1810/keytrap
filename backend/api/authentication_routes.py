from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.crypto.diffie_hellman import (
    calculate_shared_secret,
    generate_public_key,
)
from backend.crypto.digital_signatures import (
    generate_signing_keypair,
    sign_message,
    verify_signature,
    public_key_to_hex,
)

router = APIRouter(
    prefix="/api/authentication",
    tags=["Authentication"],
)


class AuthenticatedExchangeRequest(BaseModel):
    p: int = Field(gt=3, le=10000)
    g: int = Field(gt=1, le=9999)
    alice_private: int = Field(ge=2)
    bob_private: int = Field(ge=2)


def signed_exchange_message(
    participant: str,
    public_value: int,
    p: int,
    g: int,
) -> bytes:
    """Bind the participant identity and DH parameters to a public value."""
    return (
        f"KeyTrap-v1|participant={participant}|p={p}|g={g}"
        f"|public={public_value}"
    ).encode("utf-8")


@router.post("/demo")
def authenticated_exchange(request: AuthenticatedExchangeRequest):
    p = request.p
    g = request.g
    alice_private = request.alice_private
    bob_private = request.bob_private

    # Validate the demonstration parameters.
    def is_prime(n: int) -> bool:
        if n < 2:
            return False
        if n == 2:
            return True
        if n % 2 == 0:
            return False

        divisor = 3
        while divisor * divisor <= n:
            if n % divisor == 0:
                return False
            divisor += 2
        return True

    if not is_prime(p):
        raise HTTPException(
            status_code=422,
            detail="p must be a prime number.",
        )

    if not 1 < g < p:
        raise HTTPException(
            status_code=422,
            detail="g must be between 2 and p - 1.",
        )

    if not all(
        2 <= value <= p - 2
        for value in (alice_private, bob_private)
    ):
        raise HTTPException(
            status_code=422,
            detail="Private values must be between 2 and p - 2.",
        )

    # Calculate public DH values from the user's inputs.
    alice_public = generate_public_key(g, alice_private, p)
    bob_public = generate_public_key(g, bob_private, p)

    # Generate signing keys for this educational demonstration.
    alice_signing_private, alice_signing_public = (
        generate_signing_keypair()
    )
    bob_signing_private, bob_signing_public = (
        generate_signing_keypair()
    )

    # Each participant signs their own exchange message.
    alice_message = signed_exchange_message(
        "Alice", alice_public, p, g
    )
    bob_message = signed_exchange_message(
        "Bob", bob_public, p, g
    )

    alice_signature = sign_message(
        alice_signing_private, alice_message
    )
    bob_signature = sign_message(
        bob_signing_private, bob_message
    )

    # Verify using the public signing keys trusted by this demo.
    alice_signature_valid = verify_signature(
        alice_signing_public, alice_message, alice_signature
    )
    bob_signature_valid = verify_signature(
        bob_signing_public, bob_message, bob_signature
    )

    secrets_match = False

    if alice_signature_valid and bob_signature_valid:
        alice_secret = calculate_shared_secret(
            bob_public, alice_private, p
        )
        bob_secret = calculate_shared_secret(
            alice_public, bob_private, p
        )
        secrets_match = alice_secret == bob_secret

    # Mallory changes Alice's public value without her signing key.
    # The replacement is guaranteed to differ from Alice's value.
    mallory_substituted_value = (
        (alice_public - 2 + 1) % (p - 2)
    ) + 2

    substituted_message = signed_exchange_message(
        "Alice", mallory_substituted_value, p, g
    )

    substitution_rejected = not verify_signature(
        alice_signing_public,
        substituted_message,
        alice_signature,
    )

    return {
        "scenario": "Authenticated Diffie-Hellman",
        "p": p,
        "g": g,
        "alice_public": alice_public,
        "bob_public": bob_public,
        "alice_signature_valid": alice_signature_valid,
        "bob_signature_valid": bob_signature_valid,
        "alice_signing_public_key": public_key_to_hex(
            alice_signing_public
        ),
        "bob_signing_public_key": public_key_to_hex(
            bob_signing_public
        ),
        "shared_secrets_match": secrets_match,
        "mallory_substituted_value": mallory_substituted_value,
        "substitution_rejected": substitution_rejected,
        "attack_blocked": (
            secrets_match
            and alice_signature_valid
            and bob_signature_valid
            and substitution_rejected
        ),
        "security_note": (
            "Educational demonstration only. The signing public keys "
            "are trusted internally for this simulation. Real systems "
            "must authenticate identities and signing public keys."
        ),
    }