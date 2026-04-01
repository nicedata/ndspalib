import datetime
from pathlib import Path
import time

from flask import render_template
from packages.src.flask_spa import FlaskSpa
from packages.src.flask_spa.components import ConfirmDialog, Severity

PRODUCTION_MODE = False

app = FlaskSpa(__name__)


@app.route("/")
def home():
    return render_template("base.html", context={"production_mode": PRODUCTION_MODE})


@app.route("/index")
def index():
    app.title("Index")
    return "<h1>ND SPA library tests home</h1>"


# =======================================================================
# SSE Tests (begin)


@app.route("/sse_index")
def sse_index():
    app.title("SSE home")
    return render_template("tests/sse-test.html")


@app.route("/sse")
@app.route("/sse/<arg>")
def sse(arg="No arg"):
    arg = arg.strip().lower()
    now = datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S")

    match arg:
        case "toast":
            app.toast(Severity.DEFAULT, "Defaut", f"Toast sent from server at {now}", "")
        case "modal":
            app.dialog("Dialogue modal simple", "Ceci est un message envoyé par le serveur !<br>Vous allez être redirigé vers <b>/index</b>", "fr", "/index", "")
        case "alert":
            app.alert(Severity.SUCCESS, "You will be redirected to <strong>/index</strong> !", "/no_index")
        case "confirm":
            component = ConfirmDialog("Dialogue modal simple", "Ceci est un message envoyé par le serveur !<br>Vous allez être redirigé vers <b>/index</b>", "fr", "/index", "")
            app.send(component)
        case "preview":
            app.alert(Severity.DEFAULT, f"Triggering a PDF preview ({now}).")
            app.dowload(Path("GuideOpenSource.pdf"), "book.pdf", True)
        case "download":
            app.toast(Severity.DEFAULT, "Send ODS", "GGGGGGGGGGGG")
            app.alert(Severity.DEFAULT, f"Sending an ODS file ({now}).")
            app.dowload(Path("Travaux-2026.ods"), "Travaux-2026.ods", False)
        case _:
            print(f"SSE: '{arg}' -> no match.")

    return arg


# SSE Tests (end)
# =======================================================================


@app.route("/toasttest")
def messaging_test():
    app.title("Toasting")
    return render_template("tests/toasting-test.html")


@app.route("/toast")
def toast_test():
    now = datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S")
    app.toast(Severity.DANGER, "Redirection !", "You will be redirected to <b>/index</b> !", "/sssindex")
    return f"Last toast stamp : {now}"


@app.route("/polltest")
def poll_test():
    app.title("Polling")
    return render_template("tests/poll-test.html")


@app.route("/linktest")
def link_test():
    app.title("Links")
    return render_template("tests/link-test.html")


@app.route("/selecttest")
def select_test():
    app.title("Select")
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
    app.title("Modal dialog")
    return render_template("tests/modal-dialog-test.html")


@app.route("/modal_confirmation_dialog")
def modal_confirmation_dialog():
    app.title("Modal confirmation dialog")
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
