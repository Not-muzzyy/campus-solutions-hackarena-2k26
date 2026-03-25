"""
Firebase Push Notifications — Optional
App works perfectly without this configured.
"""
import os
from typing import List, Optional

_initialized = False

def init_firebase():
    global _initialized
    if _initialized:
        return True
    path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "")
    if path and os.path.exists(path):
        try:
            import firebase_admin
            from firebase_admin import credentials
            cred = credentials.Certificate(path)
            firebase_admin.initialize_app(cred)
            _initialized = True
            print("✓ Firebase initialized")
            return True
        except Exception as e:
            print(f"⚠ Firebase not initialized: {e}")
    else:
        print("⚠ Firebase skipped — service account not found (notifications disabled)")
    return False


async def send_notification(token: str, title: str, body: str, data: dict = None) -> bool:
    if not init_firebase():
        return False
    try:
        from firebase_admin import messaging
        msg = messaging.Message(
            notification=messaging.Notification(title=title, body=body),
            data=data or {},
            token=token,
        )
        messaging.send(msg)
        return True
    except Exception:
        return False


async def send_to_multiple(tokens: List[str], title: str, body: str, data: dict = None) -> dict:
    if not init_firebase() or not tokens:
        return {"success": 0, "failure": len(tokens)}
    try:
        from firebase_admin import messaging
        msg = messaging.MulticastMessage(
            notification=messaging.Notification(title=title, body=body),
            data=data or {},
            tokens=tokens,
        )
        r = messaging.send_each_for_multicast(msg)
        return {"success": r.success_count, "failure": r.failure_count}
    except Exception:
        return {"success": 0, "failure": len(tokens)}


# Helper shortcuts
async def notify_leave_update(token: str, status: str, ref: str):
    await send_notification(token, "Leave Update", f"Your leave {ref} was {status}.")

async def notify_low_attendance(token: str, subject: str, pct: float):
    await send_notification(token, "Attendance Warning", f"{subject}: {pct:.0f}% — below 75%")

async def notify_announcement(tokens: List[str], title: str, dept: str):
    await send_to_multiple(tokens, f"New Notice — {dept}", title)

async def notify_placement_posted(tokens: List[str], company: str, role: str):
    await send_to_multiple(tokens, f"New Opportunity — {company}", role)
