"""
Free Translation using deep-translator
No API key required — uses Google Translate under the hood for free
Supports: English, Hindi, Kannada, Telugu
"""
from deep_translator import GoogleTranslator

LANG_MAP = {"hi": "hi", "kn": "kn", "te": "te", "en": "en"}


async def translate_text(text: str, target_lang: str) -> str:
    if target_lang == "en" or target_lang not in LANG_MAP:
        return text
    try:
        result = GoogleTranslator(source="en", target=LANG_MAP[target_lang]).translate(text)
        return result or text
    except Exception as e:
        print(f"Translation error: {e}")
        return text  # Return original if translation fails
