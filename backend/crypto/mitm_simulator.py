def simulate_mitm_attack(
    p: int,
    g: int,
    alice_private: int,
    bob_private: int,
    mallory_for_alice: int,
    mallory_for_bob: int,
) -> dict:
    """Run a deterministic, educational Diffie-Hellman MITM experiment."""

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

    private_values = [
        alice_private,
        bob_private,
        mallory_for_alice,
        mallory_for_bob,
    ]

    if any(not 2 <= value <= p - 2 for value in private_values):
        raise ValueError("Private values must be between 2 and p - 2")

    # Alice and Bob generate their public values.
    alice_public = pow(g, alice_private, p)
    bob_public = pow(g, bob_private, p)

    # Mallory creates a different public value for each connection.
    mallory_public_for_alice = pow(g, mallory_for_alice, p)
    mallory_public_for_bob = pow(g, mallory_for_bob, p)

    # Alice believes Mallory's value belongs to Bob.
    alice_secret = pow(
        mallory_public_for_alice, alice_private, p
    )

    # Mallory calculates the same secret with Alice.
    mallory_secret_for_alice = pow(
        alice_public, mallory_for_alice, p
    )

    # Bob believes Mallory's value belongs to Alice.
    bob_secret = pow(
        mallory_public_for_bob, bob_private, p
    )

    # Mallory calculates the same secret with Bob.
    mallory_secret_for_bob = pow(
        bob_public, mallory_for_bob, p
    )

    alice_matches_mallory = (
        alice_secret == mallory_secret_for_alice
    )
    bob_matches_mallory = (
        bob_secret == mallory_secret_for_bob
    )
    alice_matches_bob = alice_secret == bob_secret

    return {
        "attack": "Man-in-the-Middle",
        "p": p,
        "g": g,
        "alice_public": alice_public,
        "bob_public": bob_public,
        "mallory_public_for_alice": mallory_public_for_alice,
        "mallory_public_for_bob": mallory_public_for_bob,
        "alice_secret_matches_mallory": alice_matches_mallory,
        "bob_secret_matches_mallory": bob_matches_mallory,
        "alice_and_bob_share_same_secret": alice_matches_bob,
        "attack_successful": (
            alice_matches_mallory
            and bob_matches_mallory
            and not alice_matches_bob
        ),
    }