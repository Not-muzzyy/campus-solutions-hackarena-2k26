"""AES Encryption for Grievances — no API key needed"""
import os
import secrets
import base64
from cryptography.fernet import Fernet


def get_key() -> bytes:
    raw = os.getenv("GRIEVANCE_ENCRYPTION_KEY", "campusiq_grievance_key_2026_secure!!")
    # Pad or truncate to 32 bytes then base64 encode for Fernet
    padded = raw.encode().ljust(32)[:32]
    return base64.urlsafe_b64encode(padded)


_fernet = None

def get_fernet() -> Fernet:
    global _fernet
    if _fernet is None:
        _fernet = Fernet(get_key())
    return _fernet


def encrypt_text(text: str) -> str:
    return get_fernet().encrypt(text.encode()).decode()


def decrypt_text(encrypted: str) -> str:
    return get_fernet().decrypt(encrypted.encode()).decode()


def generate_anonymous_ref() -> str:
    return "#GR-" + secrets.token_hex(4).upper()
