import datetime
import random
import time
from pathlib import Path

from flask import Response, render_template, request
import lorem
from packages.src.flask_spa import FlaskSpa
from packages.src.flask_spa.event_factory import Button
from packages.src.flask_spa.types import ButtonAction, Field

PROD_MODE = False

app = FlaskSpa(__name__)


# =======================================================================
# Main endpoints
@app.route("/")
def home():
    return render_template("base.html", context={"production_mode": PROD_MODE, "version": FlaskSpa.version()})


@app.route("/index")
def index():
    app.title("Index")
    return render_template("index.html")


@app.route("/components")
def components():
    app.title("Components")
    return render_template("tests/components.html")


@app.route("/sandbox")
def sandbox():
    app.title("Sandbox")
    return render_template("tests/sandbox.html")


@app.route("/reset")
def reset():
    app.title("Reset")
    return render_template("tests/reset.html")


@app.route("/zones")
def zones():
    app.title("Zones")
    return render_template("tests/zones.html")


@app.route("/contexts")
def contexts():
    app.title("Contexts")
    return render_template("tests/contexts.html")


@app.route("/websession", methods=["GET", "POST"])
def websession():
    app.title("SPA Web Session")
    app.clear_context()
    return render_template("tests/websession.html")


@app.route("/transfers", methods=["GET", "POST"])
def downloads():
    app.title("Data Xfer")
    return render_template("tests/transfers.html")


@app.route("/transfers/download", methods=["GET", "POST"])
def downloads_download():
    now = datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S")
    app.alert("primary", f"Sending 2 files ! ({now}).")
    app.download(Path("Travaux-2026.ods"), "Travaux-2026.ods", False)
    app.download(Path("GuideOpenSource.pdf"), "book.pdf", False)
    return ""


@app.route("/transfers/preview", methods=["GET", "POST"])
def downloads_preview():
    now = datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S")
    app.alert("primary", f"Triggering a PDF preview ({now}).")
    app.download(Path("GuideOpenSource.pdf"), "book.pdf", True)
    return ""


@app.route("/forms", methods=["GET", "POST"])
def forms():
    app.title("Forms")
    return render_template("tests/forms.html")


@app.route("/scanning", methods=["GET", "POST"])
def scanning():
    app.title("Scanning")
    context = {}

    # POST
    if request.method == "POST":
        print("Scanner:", request.form.get("scan_device", ""))
        data = request.form.get("scan_result", "").strip().replace("\r", "").split("\n")
        if data[0] != "SPC":
            app.alert("danger", "Scan result is not a QR bill !")
            app.zone("my_zone", "hide")
            return ""

        fields = []
        for i, n in enumerate(data):
            field = Field(str(i), n)
            fields.append(field)

        app.alert("success", "A QR bill vas scanned !")
        app.update("my_zone", fields)
        app.zone("my_zone", "show")

        return ""

    # GET
    return render_template("tests/scanning.html", context=context)


# =======================================================================
# ICC tests
@app.route("/icc")
def icc():
    app.title("ICC")
    app.clear_context()
    return render_template("tests/icc.html")


@app.route("/icc/<string:brand>")
def icc_models(brand=""):
    result = []

    match brand:
        case "volkswagen":
            result.append('<option value="polo">Polo</option>')
            result.append('<option value="passat">Passat</option>')
            result.append('<option value="golf">Golf</option>')
        case "mercedes":
            result.append('<option value="class_a">Classe A</option>')
            result.append('<option value="gle">GLE</option>')
            result.append('<option value="eqc">EQC</option>')

    return "".join(result)


@app.route("/icc/test")
def icc_test() -> Response:
    app.set_context("test")
    return Response("")


@app.route("/environment")
def environment():
    app.title("Environment")
    x = app.get_env("key_name").str()
    print("X", x, type(x))

    x = app.get_env("integer").int()
    print("X", x, type(x))

    x = app.get_env("float").float()
    print("X", x, type(x))

    x = app.get_env("float").int()
    print("X", x, type(x))

    x = app.get_env("bool").bool()
    print("X", x, type(x))

    x = app.get_env("bool").str()
    print("X", x, type(x))

    return render_template("tests/environment.html")


# =======================================================================
# Environment test
@app.route("/environment/set")
def set_env():
    app.set_env("key_name", "Testor was here !")
    app.set_env("integer", 1)
    app.set_env("float", 1243.333)
    app.set_env("bool", 0)
    return ""


@app.route("/environment/unset")
def unset_env():
    app.unset_env("key_name")
    return ""


# =======================================================================
# Websession tests
@app.route("/websession/dummy/<string:arg>", methods=["GET", "POST"])
def websession_dummy_endpoint(arg=""):
    return ""


@app.route("/websession/<string:arg>", methods=["GET", "POST"])
def websession_endpoint(arg=""):
    VALID_USERS = {"user@test.com", "admin@test.com", "superadmin@test.com"}

    if request.method == "POST":
        # Get the email and the form id from the POSTed data
        email = request.form.get("email", None)
        form_id = request.form.get("nd-form_id", "")

        if email in VALID_USERS:
            # Trigger a success alert and set the context to 'authenticated'
            app.alert("success", f"You are logged in ! Your email is <strong>{email}</strong>.")
            app.set_context("authenticated")
        else:
            # Trigger an alert and reset the form
            app.alert("danger", "Login failed !")
            app.reset_form(form_id)

    if request.method == "GET":
        if arg == "login":
            # Provide the login form.
            # It will be injected into the <div id="forms" .../> element via the nd-target="#forms" attrtibute in the
            # <a ... nd-target="#forms" ...>Login</a> element.
            return render_template("/partials/login_form.html")
        if arg == "logout":
            app.alert("success", "You are logged out !")
            app.clear_context()  # Remove 'authenticated' context

    return ""


# =======================================================================
# Context tests
@app.route("/context_test")
@app.route("/context_test/<string:action>")
@app.route("/context_test/<string:action>/<string:context>")
def context_test(action="", context=""):
    if action == "clear":
        app.clear_context()
        return ""

    if context:
        if action == "set":
            app.set_context(context)
        return ""
    return ""


# =======================================================================
# Zone tests
@app.route("/zone_test", methods=["GET", "POST"])
@app.route("/zone_test/<string:zone>/<string:action>", methods=["GET", "POST"])
def zone_test(zone="", action="update"):

    now = datetime.datetime.now().strftime("%H:%M:%S")
    if action == "update":
        if zone in ("zone_1", "zone_2"):
            options = ['<option value="">-- Select an option --</option>']
            options += [f'<option value="{v * 100}">{zone}_{v}</option>' for v in range(1, 5)]
            fields = [Field("random", random.randint(0, 10000)), Field("stamp", now), Field("selector", "".join(options))]
            app.update(zone, fields)
        if zone in ("zone_3"):
            app.zone(zone, "set", render_template("partials/login_form.html"))
        return ""

    match action:
        case "show":
            app.zone(zone, "show")
        case "hide":
            app.zone(zone, "hide")
        case "clear":
            app.zone(zone, "clear")
        case "remove":
            app.zone(zone, "remove")

    if request.method == "POST":
        print(request.form)

    return ""


@app.route("/form/<string:arg>", methods=["GET", "POST"])
def posted(arg: str):
    if request.method == "POST":
        app.alert("primary", f"POST with arg={arg}")

    if request.method == "GET":
        app.alert("primary", f"GET with arg={arg}")

    return ""


# =======================================================================
# SSE Tests
# @app.route("/echo")
@app.route("/echo/<string:arg>")
def echo(arg="-1"):
    print(request.url)
    return f"Server echoes : <code>{arg}</code>"


@app.route("/lorem/<string:arg>")
def lorem_ipsum(arg="-1"):
    return f"<b>Help for option {arg}</b>: {lorem.sentence()}"


@app.route("/manylorem")
def many_lorem() -> Response:
    result = []
    for _ in range(3):
        result.append(f"<p>{lorem.paragraph()}</p>")
    return Response("".join(result))


@app.route("/lorem_reset")
def lorem_reset() -> Response:
    app.clear_context()
    return Response("")


@app.route("/sse/<string:arg>", methods=["GET", "POST"])
def sse(arg="No arg"):
    now = datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S")

    if request.method == "POST":
        form_id = request.form.get("nd-form_id", "")
        form_operation = request.form.get("nd-form_operation", "")
        match form_operation:
            case "accept":
                app.alert("success", f"A form was posted, id={form_id}, operation: {form_operation}")
                ...
            case "apply":
                app.toast("info", "Form operation", f"A form was posted, id={form_id}, operation: {form_operation}")
                ...

        return f"A form was posted, id={form_id}, operation: {form_operation}, stamp: {now}"

    arg = arg.strip().lower()

    match arg:
        case "toast":
            app.toast("primary", "This is the toast header", f"Toast sent from server at {now}", "/no_index")
        case "alert":
            app.alert("danger", "You will be redirected to <strong>/index</strong> !", "/no_index")
        case "one_button":
            buttons = [Button(ButtonAction.ACCEPT, "Got it !", "/_accept")]
            app.button_dialog("This is a one button dialog", "And this is my <b>message</b>", buttons)
        case "two_button":
            buttons = [
                Button(ButtonAction.ACCEPT, "Oh oui", "/_accept"),
                Button(ButtonAction.DISMISS, "Non merci", "/_dismiss"),
            ]
            app.button_dialog("This is a two button dialog", "And this is my <b>message</b>", buttons)
        case "three_button":
            buttons = [
                Button(ButtonAction.ACCEPT, "Oh oui", "/_accept"),
                Button(ButtonAction.APPLY, "Appliquer", "/apply"),
                Button(ButtonAction.DISMISS, "Non merci", "/_dismiss"),
            ]
            app.button_dialog("This is a one button dialog", "And this is my <b>message</b>", buttons)
        case "confirm":
            buttons = [
                Button(ButtonAction.ACCEPT, "Oui !", "/_accept"),
                Button(ButtonAction.DISMISS, "Oh non", "/_dismiss"),
            ]
            app.confirm(
                "Confirmation sécurisée",
                "Ceci est un message envoyé par le serveur !<br>Vous allez être redirigé vers <b>/index</b>",
                "Autoriser",
                buttons,
            )
        case "form":
            return render_template("partials/test_form.html")
        case "form_1":
            return render_template("partials/test_form_1.html")
        case _:
            print(f"SSE: '{arg}' -> no match.")
    print(f"SSE returns: '{arg}'.")
    return f"<code>{now} : {arg}</code>"


# =======================================================================
# SSE Polling
@app.route("/polltest")
def poll_test():
    app.title("Polling")
    return render_template("tests/poll-test.html")


@app.route("/poll")
def poll():
    return f"<code>{datetime.datetime.now().strftime('%d.%m.%Y %H:%M:%S')}</code>"


@app.route("/poll/raw")
def poll_raw():
    return f"{datetime.datetime.now().strftime('%d.%m.%Y %H:%M:%S')}"


@app.route("/pollpoll")
def pollpoll():
    return '<div nd-poll nd-url="/poll" nd-interval="1000" class="Xmb-3 Xborder Xp-1 text-danger">New poller !</div>'


# =======================================================================
# SSE Links
@app.route("/links")
def links():
    app.title("Links")
    return render_template("tests/links.html")


# =======================================================================
# SSE select
@app.route("/selects")
def selects():
    app.title("Selects")
    return render_template("tests/selects.html")


@app.route("/select-options")
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
