exports.QRScanner = class QRScanner {
    constructor(scan_device_id = "", camera_selector = "camera", btn_ok = "scan", btn_close = "close", div_reader = "reader", post_to = "") {
        this.scanner = new Html5Qrcode(div_reader);
        this.close = document.getElementById(btn_close);
        this.camera = document.getElementById(camera_selector);
        this.scan = document.getElementById(btn_ok);
        this.post_to = post_to;

        // Add event handlers
        nd.tracker.add_listener(this.close, "click", this.close_handler);
        nd.tracker.add_listener(this.camera, "change", this.select_change_handler);
        nd.tracker.add_listener(this.scan, "click", this.scan_handler);

        // Populate the camera selector
        Html5Qrcode.getCameras()
            .then((devices) => {
                devices.forEach((device) => {
                    const option = document.createElement("option");
                    option.value = device.id;
                    option.text = device.label;
                    this.camera.add(option);
                    if (option.value == scan_device_id) {
                        option.selected = true;
                        this.scan.disabled = false;
                    }
                });
            })
            .catch((err) => {
                console.log("Error: ", err);
            });
    }

    close_handler = (event) => {
        if (this.scanner.stateManagerProxy.isScanning()) {
            this.scanner
                .stop()
                .then((ignore) => {})
                .catch((err) => {});
        }
        document.dispatchEvent(new CustomEvent("nd:close:custom"));
    };

    select_change_handler = (event) => {
        if (this.scanner.stateManagerProxy.isScanning()) {
            this.scanner
                .stop()
                .then((ignore) => {})
                .catch((err) => {});
        }
        this.scan.disabled = this.camera.value == "";
    };

    scan_handler = (event) => {
        this.do_scan(this.camera.value);
    };

    do_scan = (camera_device_id) => {
        if (!camera_device_id || camera_device_id === "") return;

        this.scanner
            .start(
                camera_device_id,
                { fps: 10, qrbox: 250 },
                async (decodedText, decodedResult) => {
                    this.scanner.stop().then((ignore) => {
                        const formdata = new FormData();
                        formdata.append("scan_device", camera_device_id);
                        formdata.append("scan_result", decodedText);
                        nd.fetcher.post_form_data(formdata, this.post_to).then((data) => {
                            this.close.click();
                        });
                    });
                },
                (errorMessage) => {
                    // NOP
                },
            )
            .catch((err) => {
                // Start failed, handle it.
            });
    };
};
