import re
from services.base_parser import BaseParser

class HDFCParser(BaseParser):
    name = "HDFC"

    def extract(self, text: str) -> dict:
        out = {}

        # ✅ Card last 4
        m = re.search(
            r"(?:Card Number|Card No)[^0-9]*(?:X{4}[- ]*){3}(\d{4})",
            text,
            re.IGNORECASE
        )
        if not m:
            m = re.search(r"(?:ENDING WITH|LAST 4)[^0-9]*(\d{4})", text, re.IGNORECASE)
        out["card_last4"] = m.group(1) if m else None

        # ✅ Billing cycle — stop at "Payment Due Date"
        m = re.search(
            r"(?:Billing Period|Statement Period)[: ]+(.+?)Payment Due Date",
            text,
            re.IGNORECASE
        )
        out["billing_cycle"] = m.group(1).strip() if m else None

        # ✅ Payment Due Date — stop at "Total Amount Due"
        m = re.search(
            r"Payment Due Date[: ]+(.+?)Total Amount Due",
            text,
            re.IGNORECASE
        )
        out["payment_due_date"] = m.group(1).strip() if m else None

        # ✅ Total Amount Due
        m = re.search(
            r"Total Amount Due[: ]+([₹0-9,\.]+)",
            text,
            re.IGNORECASE
        )
        out["total_amount_due"] = m.group(1) if m else None

        return out
