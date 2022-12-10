""" jupyter widget for pikchr"""


import ipywidgets as W
import traitlets as T

from ._version import __js__

module_name = __js__["name"]
module_version = "^{version}".format(**__js__)


class PikchrBase(W.Widget):
    """Module metadata for pikchr"""

    _model_module = T.Unicode(module_name).tag(sync=True)
    _model_module_version = T.Unicode(module_version).tag(sync=True)
    _view_module = T.Unicode(module_name).tag(sync=True)
    _view_module_version = T.Unicode(module_version).tag(sync=True)


@W.register
class Pikchr(PikchrBase, W.DOMWidget):
    """a pikchr"""

    _model_name = T.Unicode("PikchrModel").tag(sync=True)
    _view_name = T.Unicode("PikchrView").tag(sync=True)

    source = T.Unicode("", help="a pikchr string").tag(sync=True)
    value = T.Unicode("", help="an svg string").tag(sync=True)
    tag = T.Unicode("img", help="the HTML tag to generate").tag(sync=True)
    dark_mode = T.Bool(None, help="invert colors for dark themes", allow_none=True).tag(
        sync=True
    )
    css_class = T.Unicode(alow_none=True, help="add a class to the svg tag").tag(
        sync=True
    )
