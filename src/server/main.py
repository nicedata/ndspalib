import datetime
import random
import time
from pathlib import Path

from flask import render_template, request
from packages.src.flask_spa import FlaskSpa
from packages.src.flask_spa.event_factory import Button
from packages.src.flask_spa.types import ButtonAction, ZoneField, ZoneNew


PROD_MODE = False

app = FlaskSpa(__name__)


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
    return render_template("tests/websession.html")


# =======================================================================
# Websession tests
@app.route("/websession/<string:arg>", methods=["GET", "POST"])
def websession_endpoint(arg=""):
    VALID_USERS = {"user@test.com", "admin@test.com", "superadmin@test.com"}

    if request.method == "POST":
        # Get the email from the POSTed data
        email = request.form.get("email", None)

        if email in VALID_USERS:
            app.alert("success", f"You are logged in ! Your email is <strong>{email}</strong>.")
            app.set_context("authenticated")  # Set the context to 'authenticated'
            app.zone("forms", "remove")  # Remove the sign-up form from the DOM
        else:
            app.alert("danger", "Login failed !")
            app.zone("forms", "clear")  # Clear the sign-up form

    if request.method == "GET":
        if arg == "login":
            # Get the login form.
            # It will be injected into the <div id="forms" ...> element via the nd-target="#forms" attrtibute in the
            # <a ... nd-target="#forms" ...>Login</a> element.
            return render_template("/partials/login_form.html")
        if arg == "logout":
            app.alert("success", "You are logged out !")
            app.clear_context("authenticated")  # Remove 'authenticated' context

    return ""


# =======================================================================
# Context tests
@app.route("/context_test")
@app.route("/context_test/<string:action>/<string:context>")
def context_test(action="", context=""):
    if context:
        if action == "set":
            app.set_context(context)
        if action == "reset":
            app.clear_context(context)
    return ""


# =======================================================================
# Zone tests
@app.route("/zone_test", methods=["GET", "POST"])
@app.route("/zone_test/<string:zone>/<string:action>", methods=["GET", "POST"])
def zone_test(zone="", action="update"):
    my_zone = None

    now = datetime.datetime.now().strftime("%H:%M:%S")
    if zone in ("zone_1", "zone_2"):
        my_zone = ZoneNew(zone)
        options = ['<option value="">-- Select an option --</option>']
        options += [f'<option value="{v * 100}">{zone}_{v}</option>' for v in range(1, 5)]
        my_zone.add_fields([ZoneField("random", random.randint(0, 10000)), ZoneField("stamp", now), ZoneField("selector", "".join(options))])

    elif zone == "zone_3":
        my_zone = ZoneNew(zone)
        my_zone.add_field(ZoneField("form", render_template("partials/login_form.html")))
        print(my_zone)

    if my_zone:
        match action:
            case "update":
                app.zone(my_zone.name, "set", my_zone.fields)
            case "show":
                app.zone(my_zone.name, "show")
            case "hide":
                app.zone(my_zone.name, "hide")
            case "clear":
                app.zone(my_zone.name, "clear")
            case "remove":
                app.zone(my_zone.name, "remove")

    if request.method == "POST":
        print(request.form)

    return f"ZONES {now}"


# =======================================================================
# SSE Tests
@app.route("/echo")
@app.route("/echo/<string:arg>")
def echo(arg="-1"):
    return arg


@app.route("/sse/<string:arg>", methods=["GET", "POST"])
def sse(arg="No arg"):

    if request.method == "POST":
        print(request.form)
        app.alert("success", "You are logged in !")
        app.zone("zone_3", "set")

        return "Ok, boss"

    arg = arg.strip().lower()
    now = datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S")

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
            app.button_dialog("This is a one button dialog", "And this is my <b>message</b>", buttons)
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
        case "download":
            app.alert("primary", f"Sending 2 files ! ({now}).")
            app.download(Path("Travaux-2026.ods"), "Travaux-2026.ods", False)
            app.download(Path("GuideOpenSource.pdf"), "book.pdf", False)
        case "preview":
            app.alert("primary", f"Triggering a PDF preview ({now}).")
            app.download(Path("GuideOpenSource.pdf"), "book.pdf", True)
        case "form":
            return render_template("partials/test_form.html")
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
    return '<div nd-poll nd-url="/poll" nd-interval="1000" class="mb-3 border p-1 text-danger">New poller !</div>'


# =======================================================================
# SSE Links
@app.route("/linktest")
def link_test():
    app.title("Links")
    return render_template("tests/link-test.html")


# =======================================================================
# SSE select
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
