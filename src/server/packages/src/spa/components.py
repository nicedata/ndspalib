from dataclasses import dataclass
from enum import StrEnum


class SpaComponent: ...


class Severity(StrEnum):
    DANGER = "danger"
    WARNING = "warning"
    SUCCESS = "success"
    INFO = "info"
    DEFAULT = "primary"


@dataclass
class Dialog(SpaComponent):
    header: str = "Header not defined"
    body: str = "Body not defined"
    lang: str = "en"
    accept_url: str = ""
    dismiss_url: str = ""


@dataclass
class ConfirmDialog(SpaComponent):
    header: str = "Header not defined"
    body: str = "Body not defined"
    lang: str = "en"
    accept_url: str = ""
    dismiss_url: str = ""


@dataclass
class Toast(SpaComponent):
    category: Severity = Severity.DEFAULT
    header: str = "Header not defined"
    body: str = "Body not defined"
    redirect_url: str = ""


@dataclass
class Alert(SpaComponent):
    category: Severity = Severity.DEFAULT
    message: str = "Message not defined"
    redirect_url: str = ""
