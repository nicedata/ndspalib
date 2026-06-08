const { Util } = require("./util.js");
const { DIALOG_CONTAINER, NOTIFICATION_CONTAINER } = require("../constants.js");

const ND_STYLES = `
    :root {
        --nd-border-radius: 5px;
        --nd-border-color: lightgray solid 1px;
    }

    [nd-notification-container] {
        position: absolute;
        left: 50%;
        top: 0;
        width: 100%;
        height: 0;
        transform: translate(-50%, 0%);
        margin-top: 0px;
        z-index: 9000;
    }

    .nd-modal {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: var(--nd-border-radius);
        border-color: var(--nd-border-color);
        z-index: 8000;
        cursor: not-allowed;
        display: none;
    }

    .nd-modal-content {
        position: relative;
        left: 50%;
        width: 50%;
        transform: translate(-50%, 0%);

        height: fit-content;
        margin-top: 10px;
        padding: 15px;

        background-color: white;
        border: var(--nd-border-color);
        border-radius: var(--nd-border-radius);
        cursor: auto;
    }

    .nd-notification {
        position: relative;
        margin-bottom: 5px;
        left: 50%;
        width: 60%;
        transform: translate(-50%, 0%);

        margin-top: 5px;

        border: transparent solid 1px;
        border-radius: var(--nd-border-radius);
        padding-right: 10px;
        background-color: white;
        z-index: 10000;
        display: none;
    }

    .nd-close {
        position: relative;
        left: 100%;
        top: -30;
        font-size: x-large;
        display: inline-block;
        line-height: 1;
        cursor: pointer;
    }

    .nd-content {
        margin-top: 10px;
        margin-bottom: 10px;
        margin-right: 10px;
    }

    .nd-header {
        padding-bottom: 3px;
        margin-bottom: 5px;
        border-bottom: var(--nd-border-color);
    }

    .nd-footer {
        padding-top: 10px;
        border-top: var(--nd-border-color);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .nd-toast {
        position: relative;
        margin-bottom: 5px;
        left: 50%;
        width: 30%;
        transform: translate(-50%, 0%);

        margin-top: 5px;

        border: var(--nd-border-color);
        border-radius: var(--nd-border-radius);
        padding-right: 10px;
        background-color: white;
        z-index: 10000;
        display: none;
    }

    .nd-toast-header {
        display: inline-block;
    }

    .nd-toast-content {
        margin-left: 20px;
        padding-top: 10px;
        border-top: var(--nd-border-color);
`
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .join(" ");

const containers = `<div ${NOTIFICATION_CONTAINER}></div><div ${DIALOG_CONTAINER}></div>`;

const scripts = ['<script src="https://unpkg.com/html5-qrcode"></script>'];

exports.DocumentSetup = class DocumentSetup {
    static apply = () => {
        const html = `<style id="nd-style">${ND_STYLES}</style>`;
        let fragment = Util.create_fragment(html);
        document.querySelector("head").lastElementChild.after(fragment);
        scripts.forEach((script) => {
            let fragment = Util.create_fragment(script);
            document.querySelector("head").lastElementChild.before(fragment);
        });

        fragment = Util.create_fragment(containers);
        document.querySelector("body").firstElementChild.before(fragment);
    };
};
