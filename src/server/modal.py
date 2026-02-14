# const dialog = new nd.components.ModalDialog('Opération délicate', 'Voulez-vous <b>vraiment</b> supprimer ces informations ?', 'fr', '/accept', '/dimiss');
# constructor(title = DEFAULTS.title, message = DEFAULTS.message, lang = DEFAULTS.lang, accept_url = "", dismiss_url = "") {

from dataclasses import asdict, dataclass
import json


@dataclass
class ModalDialog:
    header: str = "Header not defined"
    body: str = "Body not defined"
    lang: str = "en"
    accept_url: str = ""
    dismiss_url: str = ""

    def serialize(self) -> str:
        return json.dumps(asdict(self))
