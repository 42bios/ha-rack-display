# Rack editor – changelog and notes

## Layout

- **Three fixed columns instead of pop-up panels:** settings on the left, live preview in the middle, library on the right. Nothing has to be opened first – no ⚙ buttons, no "close".
- **Levels with a path bar** `Rack › Device › Module`: the deeper level replaces the higher one; the path bar, "‹" and Esc go back.
- **Rack level:** device list with rack units and Home Assistant link status, passive parts collapsed; below it rack, door & labels, appearance and display as collapsible sections (their open/closed state is remembered).
- **The library follows the level:** "Insert device" on the rack level (first free slot from the top, or from the unit tapped with ＋), modules on the device and overview level.
- **Device level:** "Modules" list with sizes; tapping one opens the module. The overview has the same list.
- **Module level:** display styles, entities with their current value and order, size via width buttons (¼ … full) and height ± or directly in the preview (corner handle, arrow keys, Shift+arrows).

## Editing in the preview

- Visible dotted snap grid (12 columns × rows of the chosen display).
- Modules without data show an animated sketch of how they will look, also in the library.
- Drag device templates from the library into the rack, drop a photo on the header image to upload it.
- Undo notice after moving, resizing, inserting and removing (removing therefore needs no confirmation).

## Productivity

- **Entity suggestions:** matching entities of the device appear as chips (e.g. °C and rpm for "Hardware", binary sensors for "Status"); one tap adds them. Community modules can declare what to suggest.
- **Devices that are not always on:** choose how "off" is detected (tracker, power sensor or switch) and an optional power-on button.
- **Copy to another rack:** device with popup, photos and link; an existing device there is replaced and keeps its position.
- **Export / import** a rack as JSON.
- **Library:** "Recently used" on top, modules that are already in the popup move to the end of their group.
- **Keyboard:** ↑/↓ in lists, Delete removes the module (module level) or device, Esc goes up one level, ⌘/Ctrl+Z / ⇧⌘Z undo/redo, ⌘/Ctrl+S saves.
- Warning before leaving with unsaved changes.
- Narrow windows (< 1100 px): settings and library stack, the preview stays large.

## Languages

- The interface follows the Home Assistant user's language: German or English (all other languages get English). It can be fixed per rack (Display → Language), e.g. for a kiosk user.
- Translations live centrally in `frontend-src/i18n/en.json` (texts plus patterns for texts with numbers); a mutation observer translates everything that is rendered, including tooltips and dialogs. Nothing runs for German.
- Known limits: entity and device names from Home Assistant stay as they are; custom names that exactly match a dictionary entry are translated too.

## Performance

- The editor and the display used to hang on load when Home Assistant set `hass` before the element was defined; early values are now re-applied. The editor is ready about 0.1 s after the Home Assistant frontend.
- Performance marks `rde:start`, `rde:core`, `rde:data`, `rde:render` (browser dev tools → Performance).

## Ideas

- More library modules (e.g. Docker containers, VMs, backup status, certificate expiry) – see [modules/README.md](../modules/README.md).
