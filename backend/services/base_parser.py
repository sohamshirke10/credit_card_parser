from abc import ABC, abstractmethod
from services.utils import collapse_ws

class BaseParser(ABC):
    name = "BASE"

    @abstractmethod
    def extract(self, text: str) -> dict:
        pass

    def parse(self, text: str):
        fields = self.extract(text)
        return {
            "bank": self.name,
            "fields": fields
        }
