<div align="center">
  <img src="android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png" width="96" alt="Knots Made Easy" />
  <h1>Knots Made Easy</h1>
  <p>See how knots are tied, step by step, with a physically simulated 3D rope.</p>

<a href="https://github.com/naushadS/knots/stargazers"><img src="https://img.shields.io/github/stars/naushadS/knots?logo=github&style=flat-square" alt="Stars"></a>
<a href="https://github.com/naushadS/knots/releases"><img src="https://img.shields.io/github/v/release/naushadS/knots?style=flat-square" alt="Release"></a>
<a href="https://github.com/naushadS/knots/releases"><img src="https://img.shields.io/github/downloads/naushadS/knots/total?style=flat-square" alt="Downloads"></a>
<a href="https://github.com/naushadS/knots/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/naushadS/knots/ci.yml?branch=main&label=CI&style=flat-square" alt="CI"></a>
<a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT License"></a>

  <p>
    <a href="https://knots-made-easy.pages.dev"><strong>Web App</strong></a> ·
    <a href="https://github.com/naushadS/knots/releases/latest"><strong>Android APK</strong></a> ·
    <a href="https://apps.obtainium.imranr.dev/redirect?r=obtainium://add/https://github.com/naushadS/knots"><strong>Get it on Obtainium</strong></a>
  </p>
</div>

## Features

- **Real-time 3D Rope Physics**: Cosserat rod XPBD simulation rendered in WebGL2 with Three.js — no canned animations or pre-baked keyframes.
- **Interactive Step-by-Step Playback**: Scrub, pause, loop, orbit, and pinch-to-zoom around every step of tying a knot.
- **Offline Android App**: Bundled web assets inside a native Android shell so all 9 knots work without an internet connection.
- **Favorites & QR Sharing**: Save your go-to knots and share or import favorites via QR code.
- **Appearance & Performance**: Light, dark, and system themes, plus High Fidelity (24 XPBD substeps) and Battery Saver (12 substeps) modes.
- **In-App Update Checker**: Checks GitHub Releases for newer versions and opens the release APK in your browser (or manage updates automatically via [Obtainium](https://obtainium.imranr.dev/)).

## Knots

<table>
  <tr>
    <td align="center"><a href="https://knots-made-easy.pages.dev/knots/overhand/"><img src="public/og/overhand.jpg" width="260" alt="Overhand knot"><br>Overhand knot</a></td>
    <td align="center"><a href="https://knots-made-easy.pages.dev/knots/slip-knot/"><img src="public/og/slip-knot.jpg" width="260" alt="Slip knot"><br>Slip knot</a></td>
    <td align="center"><a href="https://knots-made-easy.pages.dev/knots/figure-eight/"><img src="public/og/figure-eight.jpg" width="260" alt="Figure-eight knot"><br>Figure-eight knot</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://knots-made-easy.pages.dev/knots/bowline/"><img src="public/og/bowline.jpg" width="260" alt="Bowline"><br>Bowline</a></td>
    <td align="center"><a href="https://knots-made-easy.pages.dev/knots/clove-hitch/"><img src="public/og/clove-hitch.jpg" width="260" alt="Clove hitch"><br>Clove hitch</a></td>
    <td align="center"><a href="https://knots-made-easy.pages.dev/knots/zeppelin/"><img src="public/og/zeppelin.jpg" width="260" alt="Zeppelin bend"><br>Zeppelin bend</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://knots-made-easy.pages.dev/knots/square-knot/"><img src="public/og/square-knot.jpg" width="260" alt="Square knot"><br>Square knot</a></td>
    <td align="center"><a href="https://knots-made-easy.pages.dev/knots/poachers-knot/"><img src="public/og/poachers-knot.jpg" width="260" alt="Poacher's knot"><br>Poacher's knot</a></td>
    <td align="center"><a href="https://knots-made-easy.pages.dev/knots/daisy-chain/"><img src="public/og/daisy-chain.jpg" width="260" alt="Daisy chain"><br>Daisy chain</a></td>
  </tr>
  <tr>
    <td align="center">🪢<br><b>More knots are being tied</b><br>Star the repo to see them first</td>
  </tr>
</table>

## Android App

<table>
  <tr>
    <th colspan="2" align="center">Home &amp; Categories (Light &amp; Dark)</th>
  </tr>
  <tr>
    <td align="center"><img src="docs/screenshots/app_home_light.png" width="250" alt="Home screen (Light)" /></td>
    <td align="center"><img src="docs/screenshots/app_home_dark.png" width="250" alt="Home screen (Dark)" /></td>
  </tr>
  <tr>
    <th colspan="2" align="center">3D Step-by-Step Viewer (Light &amp; Dark)</th>
  </tr>
  <tr>
    <td align="center"><img src="docs/screenshots/app_knot_light.png" width="250" alt="3D Knot viewer (Light)" /></td>
    <td align="center"><img src="docs/screenshots/app_knot_dark.png" width="250" alt="3D Knot viewer (Dark)" /></td>
  </tr>
  <tr>
    <th colspan="2" align="center">Settings &amp; Updates (Light &amp; Dark)</th>
  </tr>
  <tr>
    <td align="center"><img src="docs/screenshots/app_settings_light.png" width="250" alt="Settings screen (Light)" /></td>
    <td align="center"><img src="docs/screenshots/app_settings_dark.png" width="250" alt="Settings screen (Dark)" /></td>
  </tr>
</table>

## The stargazer rope

Every GitHub star ties a knot. Star the repo and your face joins the rope.

[![The stargazer rope](.github/stargazer-rope-0e232252.svg)](https://knots-made-easy.pages.dev/#stargazers)

## Run it

Needs Node 22.22+ and pnpm.

```bash
pnpm install
pnpm dev
```

To build the Android debug APK locally:

```bash
pnpm android:build
```

React, React Router and three.js, no physics library. [AGENTS.md](AGENTS.md) explains how it fits
together and how to add a knot.

## License

[MIT](LICENSE)
