from os import PathLike

from flask import Flask

from .components import SpaComponent, Toast, Severity, Dialog, Alert, ConfirmDialog
from .events import SpaEvent
from .middleware import FlaskMiddleware


class SpaFlask(Flask):
    """The `SpaFlask` class inherits the `Flask` class. It integrates the `SpaMiddleware` and adds functionality to th base class.

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
        # Add the Flask middleware
        self._middleware = FlaskMiddleware(self)

    def set_title(self, title: str):
        self._middleware.title(title)

    def create_component(self, obj: SpaComponent) -> None:
        self._middleware._events.append(SpaEvent.create_from_object(obj))

    def toast(self, severity: Severity, header: str, message: str, redirect_url="") -> None:
        component = Toast(severity, header, message, redirect_url)
        event = SpaEvent.create_from_object(component)
        self._middleware.add_event(event)

    def alert(self, severity: Severity, message: str, redirect_url: str = "") -> None:
        component = Alert(severity, message, redirect_url)
        event = SpaEvent.create_from_object(component)
        self._middleware.add_event(event)

    def dialog(self, header: str, message: str, lang: str, accept_url: str, dismiss_url: str) -> None:
        component = Dialog(header, message, lang, accept_url, dismiss_url)
        event = SpaEvent.create_from_object(component)
        self._middleware.add_event(event)

    def confirm(self, header: str, message: str, lang: str, accept_url: str, dismiss_url: str) -> None:
        component = ConfirmDialog(header, message, lang, accept_url, dismiss_url)
        event = SpaEvent.create_from_object(component)
        self._middleware.add_event(event)
