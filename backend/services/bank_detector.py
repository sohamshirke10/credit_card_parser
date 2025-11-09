def detect_bank(text: str) -> str:
    t = text.upper()

    if "HDFC" in t:
        return "HDFC"
    if "ICICI" in t:
        return "ICICI"
    if "AXIS" in t:
        return "AXIS"
    if "AMERICAN EXPRESS" in t or "AMEX" in t:
        return "AMEX"
    if "SBI" in t or "STATE BANK OF INDIA" in t:
        return "SBI"

    return "UNKNOWN"
