from dataclasses import dataclass, field
from typing import Dict, Union

from .components import Alert, ConfirmDialog, Dialog, Download, SpaComponent, SpaComponentData, Toast


@dataclass
class SpaEvent:
    type: str = ""
    detail: Dict = field(default_factory=Dict)
    data: Union[SpaComponentData, None] = None


def build_event(component: SpaComponent) -> SpaEvent | None:
    """Transform a component to an event.

    Args:
        component `SpaComponent`
        -- The component for which an event is to be created

    Returns:
        {SpaEvent | None} -- An event
    """
    if not isinstance(component, SpaComponent):
        return None

    if isinstance(component, Download):
        if component.payload is None:
            return None
        return SpaEvent("nd:download", component.as_dict(), data=component.payload)

    if isinstance(component, Dialog):
        return SpaEvent("nd:dialog", component.as_dict())

    if isinstance(component, Toast):
        return SpaEvent("nd:toast", component.as_dict())

    if isinstance(component, Alert):
        return SpaEvent("nd:alert", component.as_dict())

    if isinstance(component, ConfirmDialog):
        return SpaEvent("nd:confirm", component.as_dict())
