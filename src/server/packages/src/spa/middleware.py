import json
from dataclasses import asdict, is_dataclass
from typing import List

from flask import Flask, Request, Response, request

from .components import SpaComponent
from .events import SpaEvent


class FlaskMiddleware:
    def __init__(self, app: Flask) -> None:
        self._app = app
        self._wsgi_app = app.wsgi_app
        self._request: Request
        self._response: Response
        self._title: str | None = None
        self._events: List[SpaEvent] = []

        with app.app_context():
            print("MW", "First call")

        app.wsgi_app = self

        @app.before_request
        def _():
            self._request = request

        @app.after_request
        def _(response: Response):
            return response

    def __call__(self, environ, start_response):

        def custom_start_response(status: str, headers: List, exc_info=None):
            if self._events:
                payload = [asdict(_) for _ in self._events]
                headers.append(("x-nd-event", json.dumps(payload)))
                self._events.clear()

            if self._title:
                headers.append(("x-nd-title", self._title))
                self._title = ""

            return start_response(status, headers, exc_info)

        return self._wsgi_app(environ, custom_start_response)

    def as_json(self, obj) -> str:
        result = json.dumps(None)
        if is_dataclass(obj) and not isinstance(obj, type):
            result = json.dumps(asdict(obj))
        return result

    def title(self, title) -> None:
        self._title = title

    def send(self, obj: SpaComponent) -> None:
        self._events.append(SpaEvent.create_from_object(obj))

    def add_event(self, event: SpaEvent):
        self._events.append(event)
