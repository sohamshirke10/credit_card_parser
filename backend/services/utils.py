import re

def collapse_ws(s: str) -> str:
    return re.sub(r"\s+", " ", s or "").strip()
