from dataclasses import asdict, dataclass, field
from typing import Dict

from .components import Alert, ConfirmDialog, Dialog, SpaComponent, Toast


@dataclass
class SpaEvent:
    type: str = ""
    detail: Dict = field(default_factory=Dict)

    @staticmethod
    def create_from_object(object: SpaComponent) -> "SpaEvent":
        if isinstance(object, Dialog):
            return SpaEvent("nd:dialog", asdict(object))
        if isinstance(object, Toast):
            return SpaEvent("nd:toast", asdict(object))
        if isinstance(object, Alert):
            return SpaEvent("nd:alert", asdict(object))
        if isinstance(object, ConfirmDialog):
            return SpaEvent("nd:confirm", asdict(object))
        return SpaEvent()
