# Contributing

Thank you for helping! The easiest way to contribute is a **module** – a card for the device popups. See [modules/README.md](modules/README.md); `modules/batteries/` is an example to copy.

- One module per pull request; folder name = module type.
- The GitHub check builds the integration and validates every module (fields, allowed code, scoped CSS). Run `python3 frontend-src/build.py dev` locally first.
- Please include a screenshot of the module in light and dark mode.
- Do not commit the built files in `custom_components/rack_display/frontend/` or `modules.json`; they are rebuilt when the pull request is merged.

By contributing you agree that your contribution is licensed under the [GPLv3](LICENSE).
