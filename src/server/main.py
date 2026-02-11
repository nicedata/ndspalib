import datetime
import json
import time
from typing import Dict, List

from flask import Flask, Request, Response, make_response, render_template, request


class NdMiddleware:
    def __init__(self, app: Flask) -> None:
        self._app = app
        self._wsgi_app = app.wsgi_app
        self._request: Request
        self._response: Response
        self._test = "Nice Data Systems SPA Middleware"
        self._toasts: List[Dict] = []
        self._title: str = ""
        with app.app_context():
            print("MW", "First call")
        app.wsgi_app = self

        @app.before_request
        def _():
            self._request = request

        @app.after_request
        def _(response: Response):
            return response

    def test(self, message: str) -> None:
        self._test = message

    def add_toast(self, toast: Dict) -> None:
        self._toasts.append(toast)

    def title(self, title) -> None:
        self._title = title

    def __call__(self, environ, start_response):
        print("MW CALL toasts:", len(self._toasts))

        def custom_start_response(status: str, headers: List, exc_info=None):
            print("CW CALL", len(self._toasts))
            headers.append(("X-Custom-Header", self._test))
            if self._toasts:
                headers.append(("x-nd-event", json.dumps(self._toasts)))
                self._toasts.clear()
            if self._title:
                headers.append(("x-nd-title", self._title))
                self._title = ""
            return start_response(status, headers, exc_info)

        return self._wsgi_app(environ, custom_start_response)


app = Flask(__name__)
mw = NdMiddleware(app)


@app.route("/")
def home():
    return render_template("base.html")


@app.route("/index")
def index():
    mw.title("Index")
    return "<h1>Igor Tests</h1>"


@app.route("/msgtest")
def messaging_test():
    _toast("This is page load toast message", datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S"))
    return render_template("tests/messaging-test.html")


def _toast(header: str, body: str, category: str = "primary"):
    toast = render_template("partials/toast.html", context={"category": category, "header": header, "body": body})
    response = make_response()
    response.headers["x-nd-event"] = json.dumps({"type": "nd:toast", "detail": " ".join(toast.split())})
    mw.add_toast({"type": "nd:toast", "detail": " ".join(toast.split())})
    # g.toast.append({"type": "nd:toast", "detail": " ".join(toast.split())})


@app.route("/toast")
def toast_test():
    # toast = render_template("partials/toast.html", context={"category": "primary", "header": "This is a toast message", "body": datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S")})
    # print("A", len(toast))
    # toast = " ".join(toast.split())
    # print("B", len(toast))

    # response = make_response(toast)
    # response.headers["X-Nd-Event"] = json.dumps({"type": "nd:toast", "detail": {}})
    _toast("This is toast message A", datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S"))
    return datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S")  #  _toast("This is a toast message", datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S"), "danger")


@app.route("/polltest")
def poll_test():
    _toast("Polling tests", datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S"))
    mw.title("Polling")
    return render_template("tests/poll-test.html")


@app.route("/linktest")
def link_test():
    mw.title("Links")
    return render_template("tests/link-test.html")


@app.route("/selecttest")
def select_test():
    mw.title("Select")
    return render_template("tests/select-test.html")


@app.route("/selecttestpotions")
def select_test_options():
    time.sleep(2)
    opts = """
    <option>-- Select your level --</option>
    <option value="beginner">Beginner</option>
    <option value="intermediate">Intermediate</option>
    <option value="expert">Expert</option>
    <option value="superuser">Super User</option>
    """
    return opts


@app.route("/dummy")
@app.route("/dummy/<arg>")
def dummy(arg: str = "no arg"):
    return f"Dummy data from server. Supplied argument was '<b>{arg}</b>'."


@app.route("/poll")
def poll():
    return f"<code>{datetime.datetime.now().strftime('%d.%m.%Y %H:%M:%S')}</code>"


@app.route("/pollpoll")
def pollpoll():
    return '<div nd-poll nd-url="/poll" nd-interval="1000" class="mb-3 border p-1 text-danger">New poller !</div>'


@app.route("/modal_dialog")
def modal_dialog():
    return render_template("tests/modal-dialog-test.html")


@app.route("/test")
def test():
    code = f"""
    <button id="test-me" class="btn btn-danger">Test Me</button>
    <script>
        test_btn = document.getElementById('test-me');
        created = "{datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S")}"
        console.log('Fragment:', test_btn, 'Creation stamp:', created);
        test_btn.addEventListener('click', e => {{
            console.log('You tested me', e.srcElement, created);
        }});
    </script>
    """
    return code
