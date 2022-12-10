# `jupickhr`

|        docs         |                      install                      |       extend        |                        demo                         |
| :-----------------: | :-----------------------------------------------: | :-----------------: | :-------------------------------------------------: |
| [![rtd-badge]][rtd] | [![pypi-badge]][pypi]<br/>[![conda-badge]][conda] | [![npm-badge]][npm] | [![binder-badge]][binder]<br/>[![lite-badge]][lite] |

> [pikchr] text-based diagrams for [JupyterLab], etc.

[pikchr]: https://pikchr.org
[jupyterlab]: https://github.com/jupyterlab/jupyterlab
[binder-badge]: https://mybinder.org/badge_logo.svg
[binder]:
  https://mybinder.org/v2/gh/deathbeds/jupikchr/HEAD?urlpath=lab%2Ftree%2Fexamples%2FREADME.ipynb
[rtd-badge]: https://readthedocs.org/projects/jupikchr/badge/?version=latest
[rtd]: https://jupikchr.readthedocs.io
[conda-badge]: https://img.shields.io/conda/vn/conda-forge/jupikchr
[conda]: https://anaconda.org/conda-forge/jupikchr
[pypi-badge]: https://img.shields.io/pypi/v/jupikchr
[pypi]: https://pypi.org/project/jupikchr/
[npm]: https://npmjs.com/package/@deathbeds/jupikchr
[npm-badge]: https://img.shields.io/npm/v/@deathbeds/jupikchr
[lite-badge]:
  https://raw.githubusercontent.com/jupyterlite/jupyterlite/main/docs/_static/badge-launch.svg
[lite]: https://jupikchr.rtfd.io/en/stable/_static/lab/index.html?path=README.ipynb

## features

- supports writing and rendering `pikchr` in:
  - `pikchr` fenced code blocks in `.ipynb` cells and `.md` documents
  - rich display for the `text/x-pikchr` MIME type
  - _Open With... ⯈ Pikchr_ for `.pikchr` text documents
  - `jupickhr.widget.Pikchr` for live updating
- generates:
  - portable `img` tags (with fixed up special entities and fonts)
    - these can be drag-and-dropped directly into other tools, like [ipydrawio]
  - inline SVG
- light, dark and autodetected themes

## install

```bash
pip install jupikchr "jupyterlab>=3.4,<4"
```

or

```bash
mamba install -c conda-forge jupikchr "jupyterlab>=3.4,<4"
```

or

```bash
conda install -c conda-forge jupikchr "jupyterlab>=3.4,<4"
```

> If you want to integrate with, or just hack on, `jupikchr` itself, try the
> [development installation steps][contributing].

## how it works

- in the browser
  - `pikchr` source and metadata is found:
    - in Markdown by [jupyterlab-markup]
    - in `text/x-pikchr` rich display outputs
    - in the Jupyter widget
  - a WebWorker is started which loads the `pickchr` C executable, compiled to
    WebAssembly
    - these are vendored directly from [fossil]'s [pikchrshow]
  - the resulting HTML is either displayed directly, or embedded inside a portable `img`
    tag
    - in the case of rich outputs, the `text/html` display type is also stored inside
      the output as a fallback, e.g. for `nbconvert`

[fossil]: https://fossil-scm.org
[pikchrshow]: https://fossil-scm.org/home/pikchrshow
[jupyterlab-markup]: https://github.com/agoose77/jupyterlab-markup
[contributing]: https://github.com/deathbeds/jupikchr/blob/main/CONTRIBUTING.md
[ipydrawio]: https://github.com/deathbeds/ipydrawio
