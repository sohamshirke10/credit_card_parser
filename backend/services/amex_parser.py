import re
from services.base_parser import BaseParser

class AmexParser(BaseParser):
    name = "AMEX"

    def extract(self, text: str) -> dict:
        out = {}

        # ✅ Card last 4
        m = re.search(
            r"(?:Card Number|Account Number|Ending In|Last 4)[^0-9]*(?:X{4}[- ]*)*(\d{4})",
            text,
            re.IGNORECASE
        )
        out["card_last4"] = m.group(1) if m else None

        # ✅ Statement Period
        m = re.search(
            r"(?:Statement Period|Billing Period)[: ]+(.+?)Payment Due Date",
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

        # ✅ Total Due
        m = re.search(
            r"(?:Total Amount Due|New Balance|Amount Due)[: ]+([₹$0-9,\.]+)",
            text,
            re.IGNORECASE
        )
        out["total_amount_due"] = m.group(1) if m else None

        return out
