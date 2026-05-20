# Technical

> Under construction ! 

## Request headers

When `ndsplib` does fetch operation it add following header to the `Request` object :

| Req. Header      | Value                                                        | Example                                                      |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| X-Nd-Version     | The `ndspalib` version                                       | `"1.0.15-dev"`                                               |
| X-Nd-Url         | The requested URL                                            | `"http://127.0.0.1:5000/poll"`                               |
| X-Nd-Environment | The execution environment, a list of key-value pairs. See SSE. | `[{"key":"float","value":1243.333},{"key":"key_name","value":"Martin"}]` |

## Response headers

The backend may return headers in the `Response` object :

| Resp. Header     | Value                                                        | Example                                                      |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| X-Nd-Environment | The execution environment, a list of key-value pairs. See SSE. |                                                              |
| X-Nd-event       | A list of server sent events. See SSE.                       | `[{"type": "nd:title", "detail": {"title": "Components"}, "stream": null}]` |

Response headers are parsed and processed by `ndspalib` . This allows the backend to communicate with the frontend. This is how Server Side Event processing is implemented.

This is also why we developed a middleware to extend the functionalities of, in our case, Flask.





