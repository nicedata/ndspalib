from enum import StrEnum


class EventType(StrEnum):
    NONE = ""
    TOAST = "nd:toast"
    DIALOG = "nd:dialog"
    CONFIRM = "nd:confirm"
    ALERT = "nd:alert"
    DOWNLOAD = "nd:download"
