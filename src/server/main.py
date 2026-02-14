import datetime
import json
import time
from typing import Dict, List

from flask import Flask, Request, Response, render_template, request

from toast import ToastCategory, Toast
from modal import ModalDialog

PRODUCTION_MODE = False


class NdMiddleware:
    def __init__(self, app: Flask) -> None:
        self._app = app
        self._wsgi_app = app.wsgi_app
        self._request: Request
        self._response: Response
        self._toasts: List[Dict] = []
        self._title: str | None = None

        with app.app_context():
            print("MW", "First call")

        app.wsgi_app = self

        @app.before_request
        def _():
            self._request = request

        @app.after_request
        def _(response: Response):
            return response

    def add_toast(self, toast: Dict) -> None:
        self._toasts.append(toast)

    def title(self, title) -> None:
        self._title = title

    def __call__(self, environ, start_response):

        def custom_start_response(status: str, headers: List, exc_info=None):
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
    return render_template("base.html", context={"production_mode": PRODUCTION_MODE})


@app.route("/index")
def index():
    mw.title("Index")
    return "<h1>ND SPA library tests home</h1>"


# =======================================================================
# SSE Tests (begin)


@app.route("/sse_index")
def sse_index():
    mw.title("SSE home")
    return render_template("tests/sse-test.html")


@app.route("/sse")
@app.route("/sse/<arg>")
def sse(arg="No arg"):
    arg = arg.strip().lower()

    match arg:
        case "toast":
            _toast(Toast(ToastCategory.INFO, "Toast message", "Toast body", ""))
        case "modal":
            modal = ModalDialog("Dialogue modal simple", "Ceci est un message envoyé par le serveur !<br>Vous allez être redirigé vers <b>/index</b>", "fr", "/index", "")
            print(modal)
            _modal(modal)
        case _:
            print(f"SSE: No match ( {arg}).")

    return arg


# SSE Tests (end)
# =======================================================================


@app.route("/toasttest")
def messaging_test():
    mw.title("Toasting")
    return render_template("tests/toasting-test.html")


def _toast(toast: Toast):
    mw.add_toast({"type": "nd:toast", "detail": toast.serialize()})


def _modal(modal: ModalDialog):
    mw.add_toast({"type": "nd:modal", "detail": modal.serialize()})


@app.route("/toast")
def toast_test():
    now = datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S")
    toast = Toast(ToastCategory.DANGER, "Redirection !", "You will be redirected to <b>/index</b> !", "/index")
    _toast(toast)
    return f"Last toast stamp : {now}"


@app.route("/polltest")
def poll_test():
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
    mw.title("Modal dialog")
    return render_template("tests/modal-dialog-test.html")


@app.route("/modal_confirmation_dialog")
def modal_confirmation_dialog():
    mw.title("Modal confirmation dialog")
    return render_template("tests/modal-confirmation-dialog-test.html")


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
