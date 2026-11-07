from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.ed25519 import (
    Ed25519PrivateKey,
    Ed25519PublicKey,
)


def generate_signing_keypair() -> tuple[Ed25519PrivateKey, Ed25519PublicKey]:
    """Generate a signing keypair for one participant."""
    private_key = Ed25519PrivateKey.generate()
    public_key = private_key.public_key()
    return private_key, public_key


def sign_message(private_key: Ed25519PrivateKey, message: bytes) -> bytes:
    """Sign a message using the participant's private signing key."""
    return private_key.sign(message)


def verify_signature(
    public_key: Ed25519PublicKey,
    message: bytes,
    signature: bytes,
) -> bool:
    """Return False if the signature is invalid or the message was altered."""
    try:
        public_key.verify(signature, message)
        return True
    except InvalidSignature:
        return False


def public_key_to_hex(public_key: Ed25519PublicKey) -> str:
    """Serialize a public key for display or transmission."""
    raw_key = public_key.public_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PublicFormat.Raw,
    )
    return raw_key.hex()