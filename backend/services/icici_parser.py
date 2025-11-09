import re
from services.base_parser import BaseParser

class ICICIParser(BaseParser):
    name = "ICICI"

    def extract(self, text: str) -> dict:
        out = {}

        # ✅ Card last 4 digits
        m = re.search(
            r"(?:Card Number|Card No|Ending With)[^0-9]*(?:X{4}[- ]*){3}(\d{4})",
            text,
            re.IGNORECASE
        )
        if not m:
            m = re.search(r"(?:Last 4|Ending In)[^0-9]*(\d{4})", text, re.IGNORECASE)
        out["card_last4"] = m.group(1) if m else None

        # ✅ Billing Cycle
        m = re.search(
            r"(?:Statement Period|Billing Cycle)[: ]+(.+?)Payment Due Date",
            text,
            re.IGNORECASE
        )
        out["billing_cycle"] = m.group(1).strip() if m else None

        # ✅ Due Date
        m = re.search(
            r"Payment Due Date[: ]+(.+?)Total Amount Due",
            text,
            re.IGNORECASE
        )
        out["payment_due_date"] = m.group(1).strip() if m else None

        # ✅ Total Amount Due
        m = re.search(
            r"(?:Total Amount Due|Amount Due)[: ]+([₹0-9,\.]+)",
            text,
            re.IGNORECASE
        )
        out["total_amount_due"] = m.group(1) if m else None

        return out
