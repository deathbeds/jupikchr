# contributing

> PRs welcome! Help is needed on both the Python and TypeScript side to bring `pickhr`
> diagrams to more of the Jupyter ecosystem! See the [roadmap] for known tasks.

[roadmap]: https://github.com/deathbeds/jupikchr/blob/main/ROADMAP.md

## setup

> Get [Mambaforge](https://github.com/conda-forge/miniforge/releases)

```bash
mamba env update --file .binder/environment.yml
source activate jupikchr
```

## doit

List all available tasks:

```bash
doit list
```

```{hint}
optionally pass `--deps` to see which files would trigger running
```

Get up to a working state with:

```bash
doit binder
```

Get ready for a release:

```bash
doit
```

```{hint}
`doit` by itself just runs _every_ task
```
