# Kinderhaus St. Suso – Relaunch

**Vorschau: <https://fabianbuerkle2701-dev.github.io/kinderhaus-st-suso/>**

Statischer Relaunch von <https://kinderhaus.st-suso.de> im Stil eines modernen,
minimalistischen Kindergarten-Auftritts. Reines HTML/CSS/JS – kein Build-Schritt,
kein Framework, keine externen Dienste.

## Starten

```bash
npx --yes http-server kinderhaus-st-suso -p 8751 -c-1
```

Danach <http://localhost:8751> öffnen. Zum Veröffentlichen genügt es, den Ordner
auf einen Webserver zu kopieren.

## Seiten

| Datei | Inhalt |
| --- | --- |
| `index.html` | Startseite inkl. Sektion **„Unsere Betreuer"** (`#betreuer`) |
| `betreuungsangebot.html` | Tradition, Öffnungszeiten, Tagesablauf, Elternbeiträge |
| `paedagogisches-konzept.html` | Bild vom Kind, Rolle der Erzieher/innen, Bildungsverständnis |
| `ueber-uns.html` | Schwerpunkte, Familienzentrum, Team, Geschichte, Stellen (`#stellen`) |
| `raumplanung.html` | Interaktive Grundrisse EG/OG/UG mit Hotspots |
| `kontakt.html` | Kontaktformular, Öffnungszeiten, Anfahrt |
| `impressum.html`, `datenschutz.html` | Rechtstexte |

## Aufbau

```
assets/
  css/style.css     Designsystem (Farb-Tokens, Komponenten, Responsive)
  js/main.js        Navigation, Lightbox, Tabs, Hotspots, Zähler, Formular
  fonts/            Nunito + Quicksand, selbst gehostet (woff2)
  img/              alle Bilder der bisherigen Website
  downloads/        Schließplan-2026.pdf
```

### Design

Die Farbpalette stammt direkt aus dem Logo: Grün `#4a8f35`, Blau `#00669c`,
Gelb `#fbc02d`, Rot `#c0281b` auf warmem Cremeweiß. Alle Werte liegen als
CSS-Variablen in `:root` – eine Anpassung dort wirkt auf allen Seiten.
Schriften: **Quicksand** (Überschriften, rund und freundlich) und **Nunito** (Fließtext).

### Sektion „Unsere Betreuer"

Auf der Startseite unter `#betreuer`:

1. Einleitung mit den beiden Teamfotos
2. Karten für Leitung, Elternbegleitung und die offene Stellvertretung
3. Zusammensetzung des 24-köpfigen Teams
4. Hinweisbox mit Verlinkung auf die Stellenangebote

**Fotos ergänzen:** Die Personenkarten zeigen aktuell Initialen-Monogramme, weil
für die einzelnen Personen keine Porträts vorliegen. Ein Foto wird so eingesetzt
(im Quelltext ist die Stelle bereits kommentiert):

```html
<div class="person__avatar"><img src="assets/img/team-kevin-heuer.jpg" alt="Kevin Heuer"></div>
```

Weitere Personen: einen `<article class="person">`-Block kopieren. Die Varianten
`person--blue`, `person--yellow`, `person--red` wechseln die Akzentfarbe.

### Datenschutz- & Cookie-Hinweis

Beim ersten Besuch erscheint ein Pop-up mit drei gleichwertigen Optionen:
*Alle akzeptieren*, *Nur notwendige* und *Einstellungen* (Kategorien einzeln
wählbar). Vor der Entscheidung wird kein Dienst geladen. Die Auswahl liegt
ausschließlich lokal im Browser (`localStorage`, Schlüssel `khs-consent`) –
es wird keine Nutzerkennung vergeben und nichts an Dritte übertragen.

Wieder öffnen lässt sich das Pop-up über „Cookie-Einstellungen“ im Fußbereich
jeder Seite sowie über den Button im Abschnitt
[Ihre Cookie-Einstellungen](datenschutz.html#einwilligung).

Einen externen Inhalt so einbinden, dass er erst nach Zustimmung lädt:

```html
<div class="consent-placeholder">Karte erst nach Ihrer Zustimmung laden.</div>
<iframe data-consent="extern" data-src="https://…" hidden></iframe>
```

Im JavaScript steht zusätzlich `window.khsConsent` bereit:
`khsConsent.allows("extern")`, `khsConsent.get()`, `khsConsent.open()`.
Weitere Kategorien lassen sich über die Konstante `CATEGORIES` in
`assets/js/main.js` ergänzen; bei inhaltlichen Änderungen an den Kategorien
`CONSENT_VERSION` erhöhen, damit alle Besucher erneut gefragt werden.

## Technische Hinweise

- **Kontaktformular** (`kontakt.html`) öffnet ohne Backend das E-Mail-Programm
  mit vorausgefüllter Nachricht. Für serverseitigen Versand `action`/`method`
  am `<form>` setzen und das Attribut `data-mailto` entfernen.
- **Keine externen Requests.** Schriften und Icons liegen lokal, es gibt keine
  Einbindung von Google Fonts, Google Maps, YouTube oder Matomo. Die Anfahrt
  verlinkt auf OpenStreetMap. Die Kategorien *Statistik* und *Externe Medien*
  im Consent-Dialog sind vorbereitet, aber derzeit ohne Dienst.
- **Barrierefreiheit:** Skip-Link, sichtbare Fokus-Ringe, ARIA für Navigation,
  Tabs und Hotspots, `prefers-reduced-motion` wird respektiert.
- **Bilder:** 35 Dateien aus der alten Website, dedupliziert und umbenannt.
  `elterncafe.jpg` wurde von 1922×2560 auf 1200 px verkleinert.

## Offene Punkte für Sie

- **Verantwortlich für den Inhalt** ist im Impressum weiterhin „Marie Aziakonou"
  eingetragen (Stand der alten Website). Bitte prüfen, ob das noch stimmt.
- **Teamfoto:** Auf der alten Website stand „Ein neues Foto folgt in Kürze".
  Sobald es vorliegt, passt es in die Sektion „Unsere Betreuer".
- **Datenschutzerklärung:** Die Abschnitte zu Borlabs Cookie, Matomo, YouTube,
  Google Fonts und Google Maps sind in dieser Version nicht mehr zutreffend und
  sollten vor dem Livegang gestrichen bzw. geprüft werden.
- **Elternbeiträge** stammen vom Stand 1. Januar 2020.
