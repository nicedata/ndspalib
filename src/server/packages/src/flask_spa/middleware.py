import json
from dataclasses import asdict, dataclass, is_dataclass
from io import BytesIO
from typing import Any, List, Optional, Tuple, Union

from flask import Flask, Request, Response, request, send_file

from .components import SpaComponentData
from .events import SpaEvent


@dataclass
class Stream:
    data: Union[BytesIO, None]
    mimetype: str
    filename: str


class FlaskMiddleware:
    def __init__(self, app: Flask, allow_origin="*", allow_methods="GET,POST,PUT,DELETE") -> None:
        self._app = app
        self._allow_origin = allow_origin
        self._allow_methods = allow_methods
        self._wsgi_app = app.wsgi_app
        self._request: Request
        self._response: Response
        self._title: str | None = None
        self._events: List[SpaEvent] = []
        self._stream: Optional[SpaComponentData] = None

        with app.app_context():
            print("MW", "First call")

        # Apply middleware
        app.wsgi_app = self

        @app.before_request
        def _():
            self._request = request

        @app.after_request
        def _(response: Response):
            print("AR", self._stream)
            if self._stream and self._stream.data:
                print(self._stream)
                response = send_file(self._stream.data, download_name=self._stream.filename, mimetype=self._stream.mimetype)  # , as_attachment=True)
                print("Response", response)
            return response

    def __call__(self, environ, start_response):

        def custom_start_response(status: str, headers: List[Tuple[str, Any]], exc_info=None):
            if self._events:
                payload = [asdict(_) for _ in self._events]
                headers.append(("x-nd-event", json.dumps(payload)))
                self._events.clear()

            if self._title:
                headers.append(("x-nd-title", self._title))
                self._title = ""

            if self._stream:
                self._stream = None

            return start_response(status, headers, exc_info)

        return self._wsgi_app(environ, custom_start_response)

    def as_json(self, obj) -> str:
        result = json.dumps(None)
        if is_dataclass(obj) and not isinstance(obj, type):
            result = json.dumps(asdict(obj))
        return result

    def set_title(self, title) -> None:
        self._title = title

    def add_event(self, event: SpaEvent):
        self._events.append(event)

    def set_stream(self, stream: SpaComponentData) -> None:
        self._stream = stream
