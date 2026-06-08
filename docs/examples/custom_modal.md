# Creating custom modal dialogs

## Basics

To create a custom modal dialog, we use HTML templates in the following form :

```html
<template id="custom_dialog">
    <param name="mode" value="modal">
    <param name="title" value="Optional title">
    <param name="width_pc" value="30">
    <template>
        <!-- HTML code here ! -->
    </template>
</template>
```

The parameters define :

- `mode` : the dialog mode (must be `modal`) for a custom dialog
- `title` : the dialog title (optional)
- `width_pc` : the dialog width, in percent (optional)

The HTML code to be shown is placed into the `<template.../>` element below the parameters. 

Once defined, the dialog opening can be triggered with a click on :

```html
<button nd-link nd-dialog="custom_dialog" class="...">Open dialog</button>
```

## An application

This is what we want to achieve, without a page reload (SPA) :

1. Show a QR code scanner in a modal dialog
   - Select a camera available on our PC
   - Scan a QR code (a swiss QR bill in our case)
   - Send the data to the server (POST request)
   - Close the modal scan dialog
2. Process the data on the backend
3. Inject the processed data (sent by the backend) into the current page (update individual fields)

### Code example

To start the scanning process, a button is defined :

```html
<button nd-link nd-dialog="my_scan" class="btn btn-primary btn-sm form-control">Scan !</button>
```

A click on the `<button...>` will display a modal dialog defined by this code :

```html
<template id="my_scan">
    <param name="mode" value="modal">
    <param name="width_pc" value="30">
    <template>
        <div class="row">
            <div class="d-inline-flex mb-3">
                <select id="camera" class="form-select me-2">
                    <option value="">Sélectionner une caméra</option>
                </select>
                <button id="scan" class="btn btn-primary" disabled>OK</button>
            </div>
        </div>
        <div id="canvas" class="mb-3"></div>
        <div class="text-center">
            <button id="close" class="btn btn-primary">Fermer</button>
        </div>
        <script>
            new nd.QRScanner('', 'camera', 'scan', 'close', 'canvas', '/scanning');
        </script>
    </template>
</template>
```

The `new nd.QRScanner('', 'camera', 'scan', 'close', 'canvas', '/scanning');` script line executes once the template is injected into the DOM. Our `QRScanner` class is based on the `html5-qrcode` library provided by **Minhaz** (see https://github.com/mebjas/html5-qrcode).

Without going into details now, the dialog that appears looks like this :

<figure markdown="span"><img src="https://docs.nicedata.ch/ndspalib/images/custom_modal_1.png" style="zoom: 67%;"></figure>

Once the QR code has been captured, data is POSTed to the server and the dialog automatically closes.

The server endpoint (`/scanning`) is shown in this Python code snippet :

```python
@app.route("/scanning", methods=["GET", "POST"])
def scanning():
    app.title("Scanning")
    context = {}

    # POST
    if request.method == "POST":
        print("Scanner:", request.form.get("scan_device", None))
        
        # Get the scanned data
        data = request.form.get("scan_result", None)
        if data:
			
            # Transform to a dictionary
            data = json.loads(data)
            # Get the QR Bill data as an array of strings
            text = str(dict(data).get("decodedText", "")).replace("\r", "").split("\n")
            
            # Check if we have a Swiss QR bill
            if text[0] != "SPC":
                app.alert("danger", "Scan result is not a QR bill !")
                app.zone("my_zone", "hide")
                return ""
			
            # Transform into a list of key-value pairs (a list of Field)
            zone_fields = []
            for i, n in enumerate(text):
                field = Field(str(i), n)
                zone_fields.append(field)
            app.alert("success", "A QR bill vas scanned !")
            # Send decoded data back to the frontend
            app.zone("my_zone", "set", zone_fields)
            app.zone("my_zone", "show")
            return ""
   
	# GET
    return render_template("tests/scanning.html", context=context)
```

On the web page, there is a table defined within a **zone** (`my_zone`):

```html
<div nd-zone="my_zone" class="mt-3 mb-3" hidden>
    <div class="row">
        <div class="col-5">
            <table class="table border">
                <tr>
                    <td nd-zone-field="0"></td>
                </tr>
                <tr>
                    <td nd-zone-field="1"></td>
                </tr>
                <tr>
                    <td nd-zone-field="2"></td>
                </tr>
                <tr>
                    <td nd-zone-field="3"></td>
                </tr>
                <tr>
                    <td nd-zone-field="4"></td>
                </tr>
				...... <!-- More rows here, omitted for clarity -->
            </table>
        </div>
    </div>
</div>
```

Each zone field (`nd-zone-field`) will be updated with the data sent back from the server.<br>
Et voilà !

> Updated 06.06.2026 - MM
