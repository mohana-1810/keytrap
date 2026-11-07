# KeyTrap
### Diffie–Hellman Key Exchange and MITM Attack Simulation

KeyTrap is an interactive web application that demonstrates the working of Diffie–Hellman key exchange, Man-in-the-Middle (MITM) attacks, and authenticated key exchange using Ed25519 digital signatures. The project provides a visual and practical way to understand how shared secrets are established, how unauthenticated key exchange can be attacked, and how digital signatures help detect unauthorized modifications.

## Project Objectives
- Demonstrate the Diffie–Hellman key exchange process.
- Simulate a Man-in-the-Middle attack through public-value substitution.
- Demonstrate authenticated exchange using Ed25519 digital signatures.
- Visualize cryptographic calculations and verification results.
- Compare normal, attacked, and authenticated key exchanges.

## Features

### 1. Normal Diffie–Hellman Exchange
- Generates public values using modular exponentiation.
- Calculates shared secrets independently for Alice and Bob.
- Verifies whether both participants derive the same secret.
- Displays a step-by-step formula breakdown.

### 2. Man-in-the-Middle Attack Simulation
- Introduces Mallory as an attacker between Alice and Bob.
- Demonstrates interception and substitution of public values.
- Shows how Alice and Bob establish separate shared secrets with Mallory.
- Displays the attack outcome and mathematical breakdown.

### 3. Authenticated Key Exchange
- Uses Ed25519 digital signatures.
- Demonstrates signature generation and verification.
- Tests whether a substituted exchange message is rejected.
- Displays authentication and attack-detection results.

### 4. Additional Features
- Interactive input fields for cryptographic parameters.
- Input validation and error handling.
- Comparison page for all three exchange scenarios.
- Educational explanations and formula breakdowns.

## Technologies Used

| Component | Technology |
|---|---|
| Programming Language | Python |
| Backend Framework | FastAPI |
| Backend Server | Uvicorn |
| Frontend | React |
| Frontend Language | TypeScript |
| Build Tool | Vite |
| Styling | HTML, CSS |
| Cryptographic Library | Python Cryptography |
| Digital Signature Algorithm | Ed25519 |
| API Communication | REST APIs and JSON |

## Project Structure

```text
keytrap/
│
├── backend/
│   ├── crypto/
│   ├── main.py
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── ...
│
├── requirements.txt
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites

- Python 3.10 or later
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/mohana-1810/keytrap.git
cd keytrap
```

### 2. Set Up the Backend

Install the Python dependencies:

```bash
python -m pip install -r requirements.txt
```

Start the backend server from the project root:

```bash
python -m uvicorn backend.main:app --reload
```

Backend API:

```text
http://127.0.0.1:8000
```

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Set Up the Frontend

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local development URL displayed by Vite, usually:

```text
http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/exchange/demo` | Normal Diffie–Hellman exchange |
| POST | `/api/attack/mitm` | MITM attack simulation |
| POST | `/api/authentication/demo` | Authenticated exchange demonstration |

## Cryptographic Concepts

**Diffie–Hellman Key Exchange:** Allows two participants to independently derive a shared secret using public parameters and private exponents.

**Man-in-the-Middle Attack:** Exploits the lack of authentication in basic Diffie–Hellman by replacing exchanged public values.

**Ed25519 Digital Signatures:** Provide message-signature verification to detect modifications to signed exchange messages.

## Limitations

- Small Diffie–Hellman parameters are used for educational demonstrations and are not secure for real-world applications.
- Signing keys are generated internally for demonstration purposes.
- The application does not implement a complete certificate authority or public-key infrastructure.
- It does not provide a production-grade encrypted messaging system.

**Note:** KeyTrap is an educational project and should not be used to secure real-world communications.

## Future Scope

- Integrate secure, standardized cryptographic parameters.
- Introduce certificate-based identity verification.
- Implement actual encrypted message exchange.
- Add more cryptographic attack and defense demonstrations.
- Improve interactive visualizations and learning features.

## Project Information

**Project Name:** KeyTrap  
**Domain:** Cryptography and Network Security  
**Project Type:** Project-Based Learning (PBL)  
**Academic Year:** 2026–2027

## References

1. Diffie, W. and Hellman, M. E., *New Directions in Cryptography*, 1976. https://doi.org/10.1109/TIT.1976.1055638
2. RFC 8032 – Edwards-Curve Digital Signature Algorithm (EdDSA). https://www.rfc-editor.org/rfc/rfc8032
3. Python Cryptography Documentation. https://cryptography.io/
4. FastAPI Documentation. https://fastapi.tiangolo.com/
5. React Documentation. https://react.dev/
---

**KeyTrap — Understanding Secure Key Exchange Through Interactive Demonstrations.**
