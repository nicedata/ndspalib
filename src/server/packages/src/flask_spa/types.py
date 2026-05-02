"""This module defines the data structures and types used for handling events, notifications, dialogs, and downloads in the Flask SPA middleware.

It includes classes for representing different types of events, their severity levels, dialog types, button actions, zone actions, and the
structure of notifications and dialogs that can be sent to the client.

The Event class is used to encapsulate the details of an event that can be triggered in the SPA, including any associated streams for file downloads or previews.

Author: OpenAI's ChatGPT
Date: 2024-06
"""

from dataclasses import asdict, dataclass, field
from enum import StrEnum
from io import BytesIO
from typing import Any, Dict, List, Literal, Optional


class EventType(StrEnum):
    """EventType defines the different types of events that can be triggered in the Flask SPA application. Each event type corresponds to a specific action or message that can be sent to the client.

    The event types include:
    - NONE: Represents no event or a default state with no specific action.
    - ALERT: Represents an alert message that can be displayed to the user with a specific severity level and an optional redirect URL.
    - TOAST: Represents a toast notification that can be displayed to the user with a specific severity level, title, message, and an optional redirect URL.
    - ONE_BUTTON: Represents a dialog with one button that can be displayed to the user with a specific title, message, and button configuration.
    - TWO_BUTTON: Represents a dialog with two buttons that can be displayed to the user with a specific title, message, and button configuration.
    - THREE_BUTTON: Represents a dialog with three buttons that can be displayed to the user with a specific title, message, and button configuration.
    - CONFIRM: Represents a confirmation dialog that can be displayed to the user with a specific title, message, confirm label, and button configuration.
    - CUSTOM_DIALOG: Represents a custom dialog that can be displayed to the user with specific HTML content and width configuration.
    - DOWNLOAD: Represents a download event that can be triggered to send a file to the client with specific data, mimetype, filename, and mode (preview or download).
    - REDIRECT: Represents a redirect event that can be triggered to redirect the client to a specific URL.
    - ZONE: Represents a zone event that can be triggered to update, show, hide, or remove a specific zone in the client with specific items to be updated or
            displayed in the zone.
    """

    NONE = ""
    ALERT = "nd:dialog:alert"
    TOAST = "nd:dialog:toast"
    ONE_BUTTON = "nd:dialog:one_button"
    TWO_BUTTON = "nd:dialog:two_button"
    THREE_BUTTON = "nd:dialog:three_button"
    CONFIRM = "nd:dialog:confirm"
    CUSTOM_DIALOG = "nd:dialog:custom"
    DOWNLOAD = "nd:download"
    REDIRECT = "nd:redirect"
    ZONE = "nd:zone"
    CONTEXT = "nd:context"
    ENVIRONMENT = "nd:environ"
    TITLE = "nd:title"


type EventSeverity = Literal["danger", "warning", "success", "info", "primary"]


class DialogType(StrEnum):
    """DialogType defines the different types of dialogs that can be displayed to the user in the Flask SPA application. Each dialog type corresponds to a specific configuration of buttons and actions that can be triggered when the dialog is displayed.

    The dialog types include:
    - ALERT: Represents a simple alert dialog that can be displayed to the user with a specific title, message, and an optional redirect URL.
             It typically includes a single button to acknowledge the alert.
    - TOAST: Represents a toast notification that can be displayed to the user with a specific title, message, and an optional redirect URL.
             It typically appears as a temporary notification that disappears after a short duration.
    - ONE_BUTTON: Represents a dialog with one button that can be displayed to the user with a specific title, message, and button configuration.
                  The button can be configured to trigger a specific action when clicked.
    - TWO_BUTTON: Represents a dialog with two buttons that can be displayed to the user with a specific title, message, and button configuration.
                  The buttons can be configured to trigger specific actions when clicked, such as accepting or dismissing the dialog.
    - THREE_BUTTON: Represents a dialog with three buttons that can be displayed to the user with a specific title, message, and button configuration.
                    The buttons can be configured to trigger specific actions when clicked, such as accepting, applying, or dismissing the dialog.
    - CONFIRM: Represents a confirmation dialog that can be displayed to the user with a specific title, message, confirm label, and button configuration.
               It typically includes buttons for confirming or canceling an action, with the confirm button labeled according to the confirm label provided.
    - CUSTOM_DIALOG: Represents a custom dialog that can be displayed to the user with specific HTML content and width configuration.
                     It allows for complete customization of the dialog's appearance and content, and can include any combination of buttons and actions as needed.
    """

    ALERT = "alert"
    TOAST = "toast"
    CONFIRM = "confirm"
    ONE_BUTTON = "one_button"
    TWO_BUTTON = "two_button"
    THREE_BUTTON = "three_button"
    CUSTOM = "custom"


class ButtonAction(StrEnum):
    """ButtonAction defines the different actions that can be associated with buttons in dialogs and confirmations in the Flask SPA application.
    Each button action corresponds to a specific behavior or outcome that can be triggered when the button is clicked by the user.

    The button actions include:
    - NONE: Represents no action or a default state where the button does not trigger any specific behavior when clicked.
    - ACCEPT: Represents an action to accept or confirm the dialog or confirmation, typically used for buttons that indicate agreement or approval of the action being confirmed.
    - APPLY: Represents an action to apply changes or settings, typically used for buttons that indicate the application of changes or settings without necessarily confirming an action.
    - DISMISS: Represents an action to dismiss or cancel the dialog or confirmation, typically used for buttons that indicate disagreement or cancellation of the action being confirmed.
    """

    NONE = ""
    ACCEPT = "accept"
    APPLY = "apply"
    DISMISS = "dismiss"


type ContextAction = Literal["set", "reset", "clear"]


# Type definitions for better readability and type checking
type DownloadMode = Literal["preview", "download"]


@dataclass
class Base:
    """Base is a base class for all data structures used in the Flask SPA application.
    It provides a common method for converting the data structure to a dictionary format, which can be useful
    for serializing the data to JSON when sending it to the client.

    The as_dict method uses the dataclasses.asdict function to convert the dataclass instance into a dictionary,
    which can then be easily serialized to JSON for communication between the server and the client in the Flask SPA application.
    """

    def as_dict(self) -> Dict[Any, Any]:
        """Convert the dataclass instance to a dictionary format using the dataclasses.asdict function."""
        return asdict(self)


@dataclass
class Button(Base):
    """Button represents a button that can be included in dialogs and confirmations in the Flask SPA application. Each button has a specific action, label, and an optional URL that can be triggered when the button is clicked by the user.

    The Button class includes the following attributes:
        - action: A ButtonAction that defines the specific behavior or outcome that can be triggered when the button is clicked by the user. It can be one of the following values: NONE, ACCEPT, APPLY, or DISMISS.
        - label: A string that represents the text label displayed on the button. It provides a description of the button's purpose or action to the user.
        - url: An optional string that represents a URL that can be associated with the button. When the button is clicked, the client can be redirected to this URL or an action can be triggered based on the URL provided.
    """

    action: ButtonAction
    label: str = ""
    url: str = ""


@dataclass
class ZoneField:
    key: str
    value: Any


type ZoneAction = Literal["show", "hide", "remove", "clear", "set"]


@dataclass
class Zone(Base):
    name: str
    action: ZoneAction | None = None
    fields: List[ZoneField] = field(default_factory=list)

    def add_field(self, item: ZoneField):
        self.fields.append(item)

    def add_fields(self, items: List[ZoneField]):
        self.fields.extend(items)


@dataclass
class Title(Base):
    title: str


type EnvironmentAction = Literal["set", "unset", "clear"]


@dataclass
class Urls(Base):
    redirect: Optional[str]
    accept: Optional[str]
    dismiss: Optional[str]
    apply: Optional[str]


@dataclass
class Notification(Base):
    severity: str
    message: str
    redirect_url: str


@dataclass
class Alert(Notification): ...


@dataclass
class Toast(Notification):
    title: str


@dataclass
class Dialog(Base):
    title: str
    message: str
    buttons: List[Button]


@dataclass
class ConfirmDialog(Dialog):
    confirm: str


@dataclass
class CustomDialog(Base):
    html: str
    width_pc: int


@dataclass
class Stream:
    filename: str
    mimetype: str
    data: BytesIO


@dataclass
class Download(Base):
    data: bool
    mimetype: str
    filename: str
    mode: DownloadMode


@dataclass()
class Event:
    type: EventType
    detail: Dict[str, str | Dict[Any, Any]] = field(default_factory=dict)
    stream: Optional[Stream] = None
