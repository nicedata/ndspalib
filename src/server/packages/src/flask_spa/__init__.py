from io import BytesIO
import mimetypes
from os import PathLike
from pathlib import Path

from flask import Flask

from .components import SpaComponent, Severity, Alert, Toast, Dialog, ConfirmDialog, Download
from .events import build_event
from .middleware import FlaskMiddleware


class FlaskSpa(Flask):
    """The `SpaFlask` class inherits the `Flask` class.
    It integrates the `SpaMiddleware` and extends the `Flask` functionality.

    The purpose is to simplify web single page applications.

    The `FlaskMiddleware` is designed to interact with our client-side `ndspalib.js` JS library.

    Fuctionality extensions :

    - title(title:str) : allows to set a web document title
    - send(component) : sends a `component` to the browser


    Args:
        Flask (Flask): the `Flask` base class
    """

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
        # Call the base class initializer
        super().__init__(import_name, static_url_path, static_folder, static_host, host_matching, subdomain_matching, template_folder, instance_path, instance_relative_config, root_path)

        # Add our Flask middleware
        self._middleware = FlaskMiddleware(self)

    def title(self, title: str):
        self._middleware.set_title(title)

    def send(self, component: SpaComponent) -> None:
        """Send a component to the client.

        Args:
            component (SpaComponent): The component to send.
        """
        event = build_event(component)

        if event is None:
            print("ERROR in build_event()", component)
            return

        if event.data:  # Process components holding possibly big data amounts (images, pdf, etc...)
            # Initiate a data stream
            self._middleware.set_stream(event.data)
            del event.data  # Remove the data attribute

        # Process components with no big data amounts
        self._middleware.add_event(event)

    def alert(self, severity: Severity, message: str, redirect_url: str = "") -> None:
        component = Alert(severity, message, redirect_url)
        self.send(component)

    def toast(self, severity: Severity, header: str, body: str, redirect_url: str = "") -> None:
        component = Toast(severity, header, body, redirect_url)
        self.send(component)

    def dialog(self, header: str, body: str, lang: str, accept_url: str = "", dismiss_url: str = "") -> None:
        component = Dialog(header, body, lang, accept_url, dismiss_url)
        self.send(component)

    def confirm(self, header: str, body: str, lang: str, accept_url: str = "", dismiss_url: str = "") -> None:
        component = ConfirmDialog(header, body, lang, accept_url, dismiss_url)
        self.send(component)

    def dowload(self, path: Path, filename: str, preview=False) -> None:
        # Guess mimetype
        mimetype, _ = mimetypes.guess_type(path, strict=False) or ("", None)
        print("MT", mimetype, _)
        with open(path, "rb") as fh:
            file = BytesIO(fh.read())
            component = Download(file, mimetype or "", filename, preview)
            self.send(component)
