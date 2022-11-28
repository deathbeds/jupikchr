# `jupickhr`

[![Binder][binder-badge]][binder] [![docs][docs-badge]][docs]

> [pikchr] text-based diagrams for [JupyterLab], etc.

[pikchr]: https://pikchr.org
[jupyterlab]: https://github.com/jupyterlab/jupyterlab
[binder-badge]: https://mybinder.org/badge_logo.svg
[binder]: https://mybinder.org/v2/gh/deathbeds/jupikchr/HEAD?urlpath=lab%2Ftree%2Fexamples%2FPikchr%20in%20Notebooks.ipynb
[docs-badge]: https://readthedocs.org/projects/jupikchr/badge/?version=latest
[docs]: https://jupikchr.readthedocs.io

## features

- supports writing and rendering `pikchr` in:
  - `pikchr` fenced code blocks in `.ipynb` cells and `.md` documents
  - rich display for the `text/x-pikchr` MIME type
  - _Open With... ⯈ Pikchr_ for `.pikchr` documents
  - `jupickhr.widget.Pikchr` for live updating
- generates:
  - portable `img` tags (with fixed up special entities)
- light, dark and autodected themes

## install

> TBD: if you're not reading this on PyPI, it might not work _quite_ yet
> so you may need to follow the [development installation steps][contributing].

[contributing]: https://github.com/deathbeds/jupikchr

```bash
pip install jupikchr
```

or

```bash
mamba install -c conda-forge jupikchr
```

or

```bash
conda install -c conda-forge jupikchr
```
