from dataclasses import asdict, dataclass
from enum import StrEnum
import json


class ToastCategory(StrEnum):
    DANGER = "danger"
    WARNING = "warning"
    SUCCESS = "success"
    INFO = "info"
    DEFAULT = "primary"


@dataclass
class Toast:
    category: ToastCategory = ToastCategory.DEFAULT
    header: str = "Header not defined"
    body: str = "Body not defined"
    redirect_url: str = ""

    def serialize(self) -> str:
        return json.dumps(asdict(self))
