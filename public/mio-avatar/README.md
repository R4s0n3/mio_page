# Mio avatar

Open `index.html` directly, or visit `/mio-avatar/index.html` when mio_page is running.
The demo is self-contained and works offline. The start page mounts the same avatar through the open-bot-avatar npm package.

- `mio.json`: importable Open Bot Avatar v1 definition.
- `mio.svg`: static 512px avatar export.
- `renderer.js`: bundled Open Bot Avatar 0.1.1 ES module.
- `LICENSE`: upstream renderer's MIT license. Mio branding retains its existing ownership.

The body uses the central path from `public/SVG/logo.svg`, normalized to a 100-unit
view box. Its head opening is filled to support eyes. The demo shows the central symbol without side brackets.

## Mount in a browser

```js
import { mountAvatar, validateAvatar } from '/mio-avatar/renderer.js';

const response = await fetch('/mio-avatar/mio.json');
const result = validateAvatar(await response.json());
if (!result.ok) throw new Error(result.errors.join('\n'));

const avatar = mountAvatar(document.querySelector('#avatar'), {
  definition: result.value,
  color: '#f5f5f5',
  followPointer: true,
  reducedMotion: 'system',
});
avatar.update({ mood: 'happy' }); // idle | thinking | happy
// On unmount:
// avatar.destroy();
```

The host needs a square size. React integrations should call `destroy()` in the
mount effect's cleanup. The start page uses `src/app/_components/mio-avatar.tsx`.

Source: https://github.com/DominikScholz/open-bot-avatar
