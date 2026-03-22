import datetime
import time

from flask import render_template
from packages.src.spa.spa_flask import SpaFlask
from packages.src.spa.components import Severity

PRODUCTION_MODE = False


app = SpaFlask(__name__)


@app.route("/")
def home():
    return render_template("base.html", context={"production_mode": PRODUCTION_MODE})


@app.route("/index")
def index():
    app.set_title("Index")
    return "<h1>ND SPA library tests home</h1>"


# =======================================================================
# SSE Tests (begin)


@app.route("/sse_index")
def sse_index():
    app.set_title("SSE home")
    return render_template("tests/sse-test.html")


@app.route("/sse")
@app.route("/sse/<arg>")
def sse(arg="No arg"):
    arg = arg.strip().lower()
    now = datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S")

    match arg:
        case "toast":
            app.toast(Severity.DEFAULT, "Default", f"Toast sent from server at {now}", "")
        case "modal":
            app.dialog("Dialogue modal simple", "Ceci est un message envoyé par le serveur !<br>Vous allez être redirigé vers <b>/index</b>", "fr", "/index", "")
        case "alert":
            app.alert(Severity.SUCCESS, "You will be redirected to <strong>/index</strong> !", "/no_index")
        case "confirm":
            app.confirm("Dialogue modal simple", "Ceci est un message envoyé par le serveur !<br>Vous allez être redirigé vers <b>/index</b>", "fr", "/index", "")
        case _:
            print(f"SSE: No match (arg war '{arg}').")

    return arg


# SSE Tests (end)
# =======================================================================


@app.route("/toasttest")
def messaging_test():
    app.set_title("Toasting")
    return render_template("tests/toasting-test.html")


@app.route("/toast")
def toast_test():
    now = datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S")
    app.toast(Severity.DANGER, "Redirection !", "You will be redirected to <b>/index</b> !", "/sssindex")
    return f"Last toast stamp : {now}"


@app.route("/polltest")
def poll_test():
    app.set_title("Polling")
    return render_template("tests/poll-test.html")


@app.route("/linktest")
def link_test():
    app.set_title("Links")
    return render_template("tests/link-test.html")


@app.route("/selecttest")
def select_test():
    app.set_title("Select")
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
    app.set_title("Modal dialog")
    return render_template("tests/modal-dialog-test.html")


@app.route("/modal_confirmation_dialog")
def modal_confirmation_dialog():
    app.set_title("Modal confirmation dialog")
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
