from dataclasses import dataclass
from enum import StrEnum
from io import BytesIO
from typing import Dict, Union


class Severity(StrEnum):
    """Class representing a severity level"""

    DANGER = "danger"
    WARNING = "warning"
    SUCCESS = "success"
    INFO = "info"
    DEFAULT = "primary"


@dataclass(frozen=True)
class SpaComponentData:
    data: BytesIO
    mimetype: str
    filename: str

    def as_dict(self) -> Dict:
        return {"mimetype": self.mimetype, "filename": self.filename}


class SpaComponent:
    """Base class for SPA components"""

    def __init__(self) -> None:
        self.payload: Union[SpaComponentData, None] = None

    def holds_data(self) -> bool:
        return self.payload is not None

    def as_dict(self) -> Dict:
        result = {}
        for k, v in self.__dict__.items():
            if k in ("event", "payload"):
                continue
            result[k] = v
        return result

    def as_event(self): ...

    def __repr__(self) -> str:
        result = f"<{self.__class__.__name__}: "
        for k, v in self.__dict__.items():
            result += f"{k}='{v}' "
        result = result.strip() + ">"
        return result


class Toast(SpaComponent):
    """Class representing a toast message"""

    def __init__(self, severity: Severity, header: str, body: str, redirect_url: str = "") -> None:
        super().__init__()
        self.severity = severity
        self.header = header
        self.body = body
        self.redirect_url = redirect_url


class Dialog(SpaComponent):
    """Class representing a dialog"""

    def __init__(self, header: str, body: str, lang: str, accept_url: str = "", dismiss_url: str = "") -> None:
        super().__init__()
        self.header: str = header
        self.body: str = body
        self.lang: str = lang
        self.accept_url: str = accept_url
        self.dismiss_url: str = dismiss_url


class ConfirmDialog(SpaComponent):
    """Class representing a confirmation dialog"""

    def __init__(self, header: str, body: str, lang: str, accept_url: str = "", dismiss_url: str = "") -> None:
        super().__init__()
        self.header: str = header
        self.body: str = body
        self.lang: str = lang
        self.accept_url: str = accept_url
        self.dismiss_url: str = dismiss_url


class Alert(SpaComponent):
    """Class representing an alert message"""

    def __init__(self, severity: Severity, message: str, redirect_url: str = "") -> None:
        super().__init__()
        self.category: Severity = severity
        self.message: str = message
        self.redirect_url: str = redirect_url


class Download(SpaComponent):
    """Class representing a download"""

    def __init__(self, file: BytesIO, mimetype: str, filename: str, preview: bool = False) -> None:
        super().__init__()
        self.preview = preview
        self.payload = SpaComponentData(file, mimetype, filename)

    def as_dict(self) -> Dict:
        if self.payload is None:
            return {}
        result = dict(mimetype=self.payload.mimetype, filename=self.payload.filename, preview=self.preview)
        print("AD", result)
        return dict(mimetype=self.payload.mimetype, filename=self.payload.filename, preview=self.preview)
