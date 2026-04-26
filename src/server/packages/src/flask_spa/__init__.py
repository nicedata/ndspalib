"""
Flask-Spa is a middleware for Flask applications that provides a seamless integration with Single Page Applications (SPAs).

It allows developers to easily send events from the server to the client, enabling features such as dynamic page updates, alerts, confirmations,
and file downloads without requiring a full page reload.

The middleware works by intercepting requests and responses, allowing developers to add custom events to the response that can be processed by the client-side SPA.

The main features of Flask-Spa include:
- Dynamic zone updates: Update specific parts of the page without a full reload.
- Alerts and toasts: Send notifications to the client with customizable severity and messages.
- Confirmation dialogs: Prompt the user with confirmation dialogs that can trigger specific actions based on user input.
- File downloads: Send files to the client for download or preview.

The FlaskSpa class extends the Flask class and provides methods for sending various types of events to the client.

The middleware is designed to be easy to use and integrate into existing Flask applications, making it a powerful tool for enhancing the user experience of SPAs.
"""

import mimetypes
from io import BytesIO
from os import PathLike
from pathlib import Path
from typing import List

from flask import Flask


from .event_factory import Button, EventFactory
from .middleware import FlaskMiddleware
from .types import Event, EventSeverity, ZoneField, ZoneAction

__version__ = "0.1.7"


class FlaskSpa(Flask):
    def __init__(
        self,
        import_name: str,
        static_url_path: str | None = None,
        static_folder: str | PathLike[str] | None = "static",
        static_host: str | None = None,
        host_matching: bool = False,
        subdomain_matching: bool = False,
        template_folder: str | PathLike[str] | None = "templates",
        instance_path: str | None = None,
        instance_relative_config: bool = False,
        root_path: str | None = None,
    ):
        # Initialize the Flask app with the provided parameters
        super().__init__(import_name, static_url_path, static_folder, static_host, host_matching, subdomain_matching, template_folder, instance_path, instance_relative_config, root_path)

        # Initialize the FlaskMiddleware and set it as an attribute of the FlaskSpa instance
        self._middleware = FlaskMiddleware(self)

    @staticmethod
    def version() -> str:
        """Return the current version of Flask-Spa.

        This method can be used to check the version of the library being used.
        It returns a string representation of the version number.
        """
        return __version__

    def _send(self, event: Event) -> None:
        """Send an event to the client.

        This method is responsible for sending an event to the client by adding it to the middleware's event list.
        The event is processed by the middleware and sent to the client as part of the response.

        Args:
            event (Event): The event to be sent to the client. This is an instance of the Event class, which contains information about the type of event and its details.
        """
        self._middleware.add_event(event)

    def title(self, title: str):
        """Set the title of the page.

        This method allows you to set the title of the page that will be displayed in the browser's title bar or tab.
        It sends an event to the client with the new title, which can be processed by the client-side SPA to update the page title dynamically.

        Args:
            title (str): The new title to be set for the page.\n
                        This is a string that represents the desired title that will be displayed in the browser.
                        It can be any string value, such as "Home", "Dashboard", or "My App".
                        The method will send this title to the client, allowing the SPA to update the page title accordingly.
        """
        self._middleware.set_title(title)

    def set_context(self, context: str) -> None:
        self._send(EventFactory.context(context, "set"))

    def clear_context(self, context: str) -> None:
        self._send(EventFactory.context(context, "reset"))

    def zone(self, zone: str, action: ZoneAction, fields: List[ZoneField] = []) -> None:
        self._send(EventFactory.zone_new(zone, action, fields))

    def set_zone_new(self, zone: str, content: str) -> None:
        self.zone(zone, "set", [ZoneField("", content)])

    def redirect_to(self, url: str = "") -> None:
        """Redirect the client to a specified URL.

        This method sends a redirect event to the client, instructing it to navigate to the specified URL.
        The URL can be an absolute or relative path, and it will be processed by the client-side SPA to perform the redirection.

        Args:
            url (str): The URL to which the client should be redirected.\n
                This is a string that represents the destination URL for the redirection. It can be an absolute URL (e.g., "https://www.example.com") or a relative URL (e.g., "/dashboard").
                If the URL is empty, it will redirect to the root of the application. The method will send this URL to the client as part of a redirect event, allowing the SPA to handle the redirection accordingly.

        """
        self._send(EventFactory.redirect(url))

    def alert(self, severity: EventSeverity, message: str, redirect_url: str = "") -> None:
        """Send an alert event to the client.

        This method sends an alert event to the client with the specified severity, message, and optional redirect URL.
        The severity parameter indicates the level of importance of the alert (e.g., success, danger, warning), while the message parameter contains the content of the alert to be displayed to the user.  The redirect_url parameter can be used to specify a URL to which the client should be redirected after acknowledging the alert. The method uses the EventFactory to create an alert event and then sends it to the client using the _send method.

        Args:
            severity (EventSeverity): The severity level of the alert.\n
                This parameter indicates the importance of the alert and can be one of the following values: "default", "success", "danger", "warning", "info".
                The severity level can be used by the client-side SPA to style the alert appropriately (e.g., different colors for different severity levels).

            message (str): The content of the alert message to be displayed to the user.\n
                This is a string that contains the message that will be shown in the alert.
                It can include any text, HTML, or formatting that you want to display to the user.
                The method will send this message to the client as part of the alert event, allowing the SPA to render the alert with the specified content.

            redirect_url (str, optional): An optional URL to which the client should be redirected after acknowledging the alert.\n
                This parameter is a string that represents the URL to which the client should navigate after the user acknowledges the
                alert (e.g., by clicking an "OK" button).
                If this parameter is provided, the client-side SPA can handle the redirection after the alert is acknowledged.
                If it is not provided, the client will simply display the alert without any redirection.
                The method will include this URL in the alert event sent to the client, allowing the SPA to manage the redirection if necessary.
        """
        self._send(EventFactory.alert(severity, message, redirect_url))

    def toast(self, severity: EventSeverity, title: str, message: str, redirect_url: str = "") -> None:
        """Send a toast notification event to the client.

        This method sends a toast notification event to the client with the specified severity, title, message, and optional redirect URL.
        The severity parameter indicates the level of importance of the toast (e.g., success, danger, warning), while the title and message parameters contain the content of the toast to be displayed to the user. The redirect_url parameter can be used to specify a URL to which the client should be redirected after acknowledging the toast.

        Args:
            severity (EventSeverity): The severity level of the toast.\n
                This parameter indicates the importance of the toast and can be one of the following values: "default", "success", "danger", "warning", "info".
                The severity level can be used by the client-side SPA to style the toast appropriately (e.g., different colors for different severity levels).

            title (str): The title of the toast message to be displayed to the user.\n
                This is a string that contains the title that will be shown in the toast.
                It can include any text or formatting that you want to display to the user.
                The method will send this title to the client as part of the toast event, allowing the SPA to render the toast with the specified title.

            message (str): The content of the toast message to be displayed to the user.\n
                This is a string that contains the message that will be shown in the toast.
                It can include any text, HTML, or formatting that you want to display to the user.
                The method will send this message to the client as part of the toast event, allowingthe SPA to renderthe toast withthe specified content.

            redirect_url (str, optional): An optional URL to whichthe client shouldbe redirected after acknowledgingthe toast.\n
                This parameter is a string that representsthe URLto whichthe client should navigate afterthe user acknowledgesthe
                toast (e.g., by clicking an "OK" button).
                If this parameter is provided, the client-side SPA can handlethe redirection afterthe toast is acknowledged.
                If it is not provided, themethod will simply displaythe.toast without any redirection.
                The method will include this URL inthe.toast event senttothe client, allowingthe SPA to manage the redirection if necessary.
        """
        self._send(EventFactory.toast(severity, title, message, redirect_url))

    def confirm(self, header: str, message: str, confirm_label: str, buttons: List[Button]) -> None:
        """Send a confirmation dialog event to the client.

        This method sends a confirmation dialog event to the client with the specified header, message, confirm button label, and a list of buttons.
        The header parameter contains the title of the confirmation dialog, while the message parameter contains the content of the dialog to be displayed to the user. The confirm_label parameter specifies the label for the confirmation button, and the buttons parameter is a list of Button objects that represent additional buttons to be included in the dialog. The method uses the EventFactory to create a confirmation dialog event and then sends it to the client using the _send method.

        Args:
            header (str): The title of the confirmation dialog.\n
                This is a string that contains the title that will be shown at the top of the confirmation dialog.
                It can include any text or formatting that you want to display to the user.
                The method will send this header to the client as part of the confirmation dialog event, allowing the SPA to render the dialog with the specified title.

            message (str): The content of the confirmation dialog to be displayed to the user.\n
                This is a string that contains the message that will be shown in the body of the confirmation dialog.
                It can include any text, HTML, or formatting that you want to display to the user.
                The method will send this message to the client as part of the confirmation dialog event, allowing the SPA to render the dialog with the specified content.

            confirm_label (str): The label for the confirmation button.\n
                This is a string that represents the text that will be displayed on the confirmation button (e.g., "Yes", "OK", "Confirm").
                The method will include this label in the confirmation dialog event sent to the client, allowing the SPA to render the button with the specified label.

            buttons (List[Button]): A list of additional Button objects to be included in the confirmation dialog.\n
                This parameter is a list of Button objects that represent additional buttons to be included in the confirmation dialog (e.g., "Cancel", "Apply", "Dismiss").
                Each Button object contains information about the action, label, and URL for the button.
                The method will include this list of buttons in the confirmation dialog event sent to the client, allowing the SPA to render the dialog with the specified buttons and handle their actions accordingly.
        """
        self._send(EventFactory.confirm(header, message, confirm_label, buttons))

    def button_dialog(self, title: str, message: str, buttons: List[Button]) -> None:
        """Send a button dialog event to the client.

        This method sends a button dialog event to the client with the specified title, message, and a list of buttons.
        The title parameter contains the title of the dialog, while the message parameter contains the content of the dialog to be displayed to the user. The buttons parameter is a list of Button objects that represent the buttons to be included in the dialog. The method uses the EventFactory to create a button dialog event and then sends it to the client using the _send method.

        Args:
            title (str): The title of the button dialog.\n
                This is a string that contains the title that will be shown at the top of the button dialog.
                It can include any text or formatting that you want to display to the user.
                The method will send this title to the client as part of the button dialog event, allowing the SPA to render the dialog with the specified title.

            message (str): The content of the button dialog to be displayed to the user.\n
                This is a string that contains the message that will be shown in the body of the button dialog.
                It can include any text, HTML, or formatting that you want to display to the user.
                The method will send this message to the client as part of the button dialog event, allowing the SPA to render the dialog with the specified content.

            buttons (List[Button]): A list of Button objects to be included in the button dialog.\n
                This parameter is a list of Button objects that represent the buttons to be included in the button dialog (e.g., "OK", "Cancel", "Apply").
                Each Button object contains information about the action, label, and URL for the button.
                The method will include this list of buttons in the button dialog event sent to the client, allowing the SPA to render the dialog with the specified buttons and handle their actions accordingly.
        """
        self._send(EventFactory.button_dialog(title, message, buttons))

    def download(self, path: Path, filename: str, preview=False) -> None:
        """Send a file download event to the client.

        This method sends a file download event to the client, allowing the user to download a file or preview it in the browser.
        The method takes the file path, the desired filename for the download, and an optional preview flag.
        The file is read into a BytesIO object, and the appropriate MIME type is determined based on the file extension.
        The method then creates a download event using the EventFactory and sends it to the client using the _send method.

        Args:
            path (Path): The file path of the file to be downloaded.\n
                This parameter is a Path object that represents the location of the file on the server that you want to make available for download.
                The method will read this file and prepare it for sending to the client as part of a download event.

            filename (str): The desired filename for the downloaded file.\n
                This is a string that represents the name that will be suggested to the user when they download the file.
                It can be different from the original filename on the server, allowing you to provide a more user-friendly name for the download.

            preview (bool, optional): A flag indicating whether the file should be previewed in the browser instead of downloaded.\n
                If this flag is set to True, the client-side SPA can handle the event by displaying a preview of the file (e.g., opening a PDF in a new tab) instead of prompting for download.
                If it is set to False (the default), the client will prompt the user to download the file. The method will include this information in the download event sent to the client, allowing the SPA to manage how the file is handled based on the preview flag.
        """
        mimetype, _ = mimetypes.guess_type(path, strict=False)

        # Read the file content into a BytesIO object
        with open(path, "rb") as fh:
            file = BytesIO(fh.read())

        # Create a download event with the file content, mimetype, filename, and preview flag
        event = EventFactory.download(file, mimetype or "", filename, "preview" if preview else "download")

        # Send the event to the client
        self._send(event)
