from services.hdfc_parser import HDFCParser
from services.icici_parser import ICICIParser
from services.axis_parser import AxisParser
from services.sbi_parser import SBIParser
from services.amex_parser import AmexParser

def get_parser(bank: str):
    parsers = {
        "HDFC": HDFCParser(),
        "ICICI": ICICIParser(),
        "AXIS": AxisParser(),
        "SBI": SBIParser(),
        "AMEX": AmexParser(),
    }
    return parsers.get(bank)
