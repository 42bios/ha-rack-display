# Contributing

Thank you for helping! The easiest way to contribute is a **module** – a card for the device popups. See [modules/README.md](modules/README.md); `modules/batteries/` is an example to copy.

- One module per pull request; folder name = module type.
- The GitHub check builds the integration and validates every module (fields, allowed code, scoped CSS). Run `python3 frontend-src/build.py dev` locally first.
- Please include a screenshot of the module in light and dark mode.
- Do not commit the built files in `custom_components/rack_display/frontend/` or `modules.json`; they are rebuilt when the pull request is merged.

By contributing you agree that your contribution is licensed under the [GPLv3](LICENSE).

## Translations

The interface texts live in `frontend-src/i18n/<language>.json` as `"key": "text"`; values are inserted for `{0}`, `{1}`, …. English (`en.json`) is the source language and must contain every key. In the code a text is `TR("key")` or `TR("key", value)`; the build fails if a key is missing in `en.json`.

To add a language, copy `en.json` to e.g. `fr.json` and translate the texts; keys you leave out fall back to English. The language follows the Home Assistant user and can be fixed per rack in the editor (Display → Language).

The texts of the Home Assistant config flow live in `custom_components/rack_display/translations/`.

## Development

The frontend source lives in `frontend-src/` and is built into `custom_components/rack_display/frontend/` with `python3 frontend-src/build.py`. The backend tests run with `pip install -r requirements_test.txt` and `python -m pytest` (Linux or macOS).

`frontend-src/deploy.sh` builds the integration and copies it to a Home Assistant host via SSH; the connection details are read from `frontend-src/deploy.env` (not part of the repository).

## Releases

- Set the version in `custom_components/rack_display/manifest.json`, then create and push a matching semantic tag, for example `v0.2.0`.
- The `Release` workflow checks that the tag matches the manifest version and that the committed frontend build matches the source, then publishes a GitHub release with notes grouped via `.github/release.yml`.
