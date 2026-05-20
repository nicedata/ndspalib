"""Event Factory - A factory class to create different types of events for the Flask SPA framework.

This module defines the EventFactory class, which provides static methods to create various types of events such as alerts, toasts, dialogs, and downloads.
Each method constructs an Event object with the appropriate type and detail based on the input parameters.

The EventFactory class serves as a centralized place to generate events that can be used throughout the Flask SPA application to trigger specific actions or
display messages to the user.

Example usage:
    event = EventFactory.alert(EventSeverity.INFO, "This is an informational alert.", "/redirect-url")
    # This will create an alert event with the specified severity, message, and redirect URL.

    event = EventFactory.confirm("Confirm Action", "Are you sure you want to proceed?", "Yes", [Button("Yes", "confirm"), Button("No", "cancel")])
    # This will create a confirm dialog event with the specified title, message, confirm label, and buttons.

Author: OpenAI's ChatGPT
Date: 2024-06
"""

from io import BytesIO
from typing import List

from .types import Alert, Button, ContextAction, Title, EnvironmentAction, CustomDialog, Download, DownloadMode, Event, ZoneAction, EventSeverity, EventType, Stream, Toast, Urls, ZoneField, Zone


class EventFactory:
    @staticmethod
    def title(value: str):
        result = Event(EventType.TITLE)
        result.detail = Title(value).as_dict()

        return result

    @staticmethod
    def environment(action: EnvironmentAction, key: str = "", value="") -> Event:
        result = Event(EventType.ENVIRONMENT)
        result.detail = dict(action=action, key=key, value=value)

        return result

    @staticmethod
    def context(context: str, action: ContextAction) -> Event:
        result = Event(EventType.CONTEXT)
        result.detail = dict(context=context, action=action)

        return result

    @staticmethod
    def zone(zone: str, action: ZoneAction, fields: List[ZoneField] = []) -> Event:
        result = Event(EventType.ZONE)
        result.detail = Zone(zone, action, fields).as_dict()

        return result

    @staticmethod
    def redirect(url: str = "") -> Event:
        result = Event(EventType.REDIRECT)
        result.detail = Urls(url, None, None, None).as_dict()

        return result

    @staticmethod
    def alert(severity: EventSeverity, message: str, redirect_url: str = "") -> Event:
        result = Event(EventType.ALERT)
        result.detail = Alert(severity, message, redirect_url).as_dict()

        return result

    @staticmethod
    def toast(severity: EventSeverity, title: str, message: str, redirect_url: str = "") -> Event:
        result = Event(EventType.TOAST)
        result.detail = Toast(severity, message, redirect_url, title).as_dict()

        return result

    @staticmethod
    def confirm(title: str, message: str, confirm_label: str, buttons: List[Button]) -> Event:
        result = Event(EventType.CONFIRM)
        result.detail = {
            "title": title,
            "message": message,
            "confirm": confirm_label,
        }
        [result.detail.update(b.as_dict()) for b in buttons]

        return result

    @staticmethod
    def button_dialog(title: str, message: str, buttons: List[Button]) -> Event:

        result = Event(EventType.NONE)
        # Dialog type
        match len(buttons):
            case 1:
                result = Event(EventType.ONE_BUTTON)
            case 2:
                result = Event(EventType.TWO_BUTTON)
            case 3:
                result = Event(EventType.THREE_BUTTON)

        result.detail = {
            "title": title,
            "message": message,
        }
        [result.detail.update(b.as_dict()) for b in buttons]

        return result

    @staticmethod
    def custom_dialog(html: str, width_pc: int) -> Event:
        result = Event(EventType.CUSTOM_DIALOG)
        result.detail = CustomDialog(html, width_pc).as_dict()

        return result

    @staticmethod
    def download(data: BytesIO, mimetype: str, filename: str, mode: DownloadMode = "download") -> Event:
        result = Event(EventType.DOWNLOAD)
        result.detail = Download(True, mimetype, filename, mode).as_dict()
        result.stream = Stream(filename, mimetype, data)

        return result

    @staticmethod
    def reset_form(form_id: str) -> Event:
        result = Event(EventType.RESET_FORM)
        result.detail = dict(form_id=form_id)

        return result
