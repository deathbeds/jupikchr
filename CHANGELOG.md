# history

## 0.2.1

> TBD

## 0.2.0

- removed dependency on `jupyterlab 3`
  - **note**: this doesn't mean it will "just work" with JupyterLab 4
- add basic syntax highlighting with `@deathbeds/codemirror-pikchr`
- vendor `pikchr.wasm` from fossil 2.20
- widget
  - rename `dark` to `dark_mode`
  - add `css_class`
- document
  - add toolbar with buttons for `fit` and `tag`
- mime
  - fallback `text/html` outputs get populated after rendering in the browser
  - metadata
    - rename `dark` to `darkMode`
    - add `cssClass`

## 0.1.0

- initial release
