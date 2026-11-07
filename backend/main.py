from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.crypto.diffie_hellman import simulate_exchange
from backend.crypto.mitm_simulator import simulate_mitm_attack
from backend.api.authentication_routes import router as authentication_router

app = FastAPI(
    title="KeyTrap API",
    description="Educational Diffie-Hellman and MITM attack simulator",
    version="1.0.0",
)

app.include_router(authentication_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/")
def home():
    return {
        "message": "KeyTrap API is running",
        "status": "ok",
    }


class KeyExchangeRequest(BaseModel):
    p: int = Field(gt=3, le=10000)
    g: int = Field(gt=1, le=9999)
    alice_private: int = Field(ge=2)
    bob_private: int = Field(ge=2)


class MitmAttackRequest(BaseModel):
    p: int = Field(gt=3, le=10000)
    g: int = Field(gt=1, le=999999)
    alice_private: int = Field(ge=2)
    bob_private: int = Field(ge=2)
    mallory_for_alice: int = Field(ge=2)
    mallory_for_bob: int = Field(ge=2)


@app.post("/api/exchange/demo")
def run_exchange(request: KeyExchangeRequest):
    try:
        return simulate_exchange(
            p=request.p,
            g=request.g,
            alice_private=request.alice_private,
            bob_private=request.bob_private,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        ) from exc


@app.post("/api/attack/mitm")
def run_mitm_attack(request: MitmAttackRequest):
    try:
        return simulate_mitm_attack(
            p=request.p,
            g=request.g,
            alice_private=request.alice_private,
            bob_private=request.bob_private,
            mallory_for_alice=request.mallory_for_alice,
            mallory_for_bob=request.mallory_for_bob,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        ) from exc