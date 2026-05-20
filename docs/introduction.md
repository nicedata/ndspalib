# A JavaScript SPA Framework

We develop web applications. To minimize back-and-f:orth communication with the server, we wanted to create single-page applications (SPAs). This approach allows us to work on only a portion of the displayed page.

There are many tools available to achieve this goal (such as HTMX or UnPoly). They deserve our full attention.

However, in our case, they require significant customization to bring our applications into compliance.

We thrive on challenges and are highly curious. That is why we are developing our own framework. The “Nice Data Systems SPA Framework” is therefore being developed according to our ideas and needs.

The products we develop operate in the following environment:

- server: Python (Flask, Django, FastAPI, ...)
- client: Standard browser (JavaScript, CSS, ...)

Our framework consists of two parts:

- a Python Middleware (tailored for Flask): FlaskMiddleware
- a JavaScript library: ndspalib.js

The **middleware** extends Flask’s functionality, and the JavaScript **library** enables collaboration with the middleware, thereby implementing the SPA paradigm.

**Warning** : The current version (1.0._xx-dev_) is not yet ready for production, but allows us to attempt porting (often from HTMX and sometimes from UnPoly).

This development experience has allowed us to gain a deeper understanding of how JavaScript and Python application servers work. This has allowed us to expand our skills, which is always welcome.

As always, working alone can lead to a lack of direction. So we would love to hear your comments, suggestions, and feedback. Please don’t hesitate to share them !

## References

1. Unpoly, Progressive enhancement for HTML https://unpoly.com/
2. HTMX, high power tools for HTML https://htmx.org/
3. Flask, a micro web framework written in Python https://flask.palletsprojects.com/
4. Django, a high-level Python web framework https://www.djangoproject.com/
5. FastAPI, a modern, fast (high-performance) web framework for building APIs with Python 3.6+ based on standard Python type hints https://fastapi.tiangolo.com/
