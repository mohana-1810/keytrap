import secrets


def generate_private_key(p: int) -> int:
    """Generate a private value for an educational DH exchange."""
    if p <= 3:
        raise ValueError("p must be greater than 3")

    return secrets.randbelow(p - 3) + 2


def generate_public_key(g: int, private_key: int, p: int) -> int:
    """Calculate the public value: g^private_key mod p."""
    return pow(g, private_key, p)


def calculate_shared_secret(
    other_public_key: int,
    private_key: int,
    p: int,
) -> int:
    """Calculate the shared secret using the other party's public value."""
    if not 1 < other_public_key < p:
        raise ValueError("Public key must be between 2 and p - 1")

    return pow(other_public_key, private_key, p)



def simulate_exchange(
    p: int = 23,
    g: int = 5,
    alice_private: int = 6,
    bob_private: int = 15,
) -> dict:
    """Run a deterministic educational Diffie-Hellman exchange."""

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
        raise ValueError("p must be a prime number")

    if not 1 < g < p:
        raise ValueError("g must be between 2 and p - 1")

    if not all(2 <= value <= p - 2 for value in (
        alice_private, bob_private
    )):
        raise ValueError("Private values must be between 2 and p - 2")

    alice_public = pow(g, alice_private, p)
    bob_public = pow(g, bob_private, p)

    alice_secret = pow(bob_public, alice_private, p)
    bob_secret = pow(alice_public, bob_private, p)

    return {
        "p": p,
        "g": g,
        "alice_public": alice_public,
        "bob_public": bob_public,
        "alice_shared_secret": alice_secret,
        "bob_shared_secret": bob_secret,
        "secrets_match": alice_secret == bob_secret,
    }