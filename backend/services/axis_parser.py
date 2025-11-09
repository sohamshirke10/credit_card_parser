import re
from services.base_parser import BaseParser

class AxisParser(BaseParser):
    name = "AXIS"

    def extract(self, text: str) -> dict:
        out = {}

        # ✅ Card last 4
        m = re.search(
            r"(?:Card Number|Card No|Last 4|Ending With)[^0-9]*(?:X{4}[- ]*){3}(\d{4})",
            text,
            re.IGNORECASE
        )
        out["card_last4"] = m.group(1) if m else None

        # ✅ Billing Period
        m = re.search(
            r"(?:Statement Period|Billing Period|Bill Cycle)[: ]+(.+?)Payment Due Date",
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
            r"(?:Total Amount Due|Amount Due|Total Due)[: ]+([₹0-9,\.]+)",
            text,
            re.IGNORECASE
        )
        out["total_amount_due"] = m.group(1) if m else None

        return out
