import re
from services.base_parser import BaseParser

class SBIParser(BaseParser):
    name = "SBI"

    def extract(self, text: str) -> dict:
        out = {}

        # ✅ Card last 4 digits
        m = re.search(
            r"Card Number[: ]+\s*(?:X{4}[- ]?){3}(\d{4})",
            text,
            re.IGNORECASE
        )
        if not m:
            m = re.search(r"(?:CARD NUMBER|CARD NO)[^0-9]*(\d{4})", text, re.IGNORECASE)
        out["card_last4"] = m.group(1) if m else None

        # ✅ Billing cycle (stop before "Payment Due Date")
        m = re.search(
            r"Statement Period[: ]+(.+?)Payment Due Date",
            text,
            re.IGNORECASE
        )
        out["billing_cycle"] = m.group(1).strip() if m else None

        # ✅ Payment due date (stop before "Total Amount Due")
        m = re.search(
            r"Payment Due Date[: ]+(.+?)Total Amount Due",
            text,
            re.IGNORECASE
        )
        out["payment_due_date"] = m.group(1).strip() if m else None

        # ✅ Total amount due
        m = re.search(
            r"Total Amount Due[: ]+([₹0-9,\.]+)",
            text,
            re.IGNORECASE
        )
        out["total_amount_due"] = m.group(1) if m else None

        return out
