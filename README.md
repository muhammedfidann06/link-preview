# 🖼️ Link Preview

**🇬🇧 English** | [🇩🇪 Deutsch](#-deutsch)

See how a link will look when you share it in a chat, on social media or in search results, and find out which meta tags the page is missing.

**Live:** https://muhammedfidann06.github.io/link-preview/

## Features

- Three previews: chat message, social post and search result
- Checks 7 important tags (`<title>`, description, Open Graph, Twitter card)
- Generates the missing meta tags so you can copy them into your `<head>`
- Works on any public URL, no sign up needed

## How it works

The page is fetched through the [Microlink API](https://microlink.io). Besides the normal metadata (title, image, logo), the request also asks for the raw `content` of specific `<meta>` tags using CSS selectors. That way the tag check shows what is actually in the HTML, not what was guessed from the page content.

```js
params.set("data.ogImage.selector", 'meta[property="og:image"]');
params.set("data.ogImage.attr", "content");
```

## Why this is useful

When a link has no `og:image` or `og:title`, apps show a plain URL or pick a random picture. I made this to check my own projects, like [Lumira](https://lumira-tr.com), before sharing them.

## Limitations

- The free Microlink plan allows about 50 requests per day.
- Real apps cache previews, so changes on your site may take a while to show up there.

---

## 🇩🇪 Deutsch

Zeigt, wie ein Link aussieht, wenn man ihn in einem Chat, in sozialen Netzwerken oder in Suchergebnissen teilt, und welche Meta-Tags der Seite fehlen.

**Live:** https://muhammedfidann06.github.io/link-preview/

### Funktionen

- Drei Vorschauen: Chatnachricht, Social-Media-Post und Suchergebnis
- Prüft 7 wichtige Tags (`<title>`, Description, Open Graph, Twitter Card)
- Erzeugt die fehlenden Meta-Tags zum Kopieren in den `<head>`
- Funktioniert mit jeder öffentlichen URL, ohne Anmeldung

### Funktionsweise

Die Seite wird über die [Microlink API](https://microlink.io) abgerufen. Zusätzlich zu den normalen Metadaten fragt die Anfrage den `content` bestimmter `<meta>`-Tags per CSS-Selektor ab. So zeigt die Prüfung, was wirklich im HTML steht, und nicht, was aus dem Seiteninhalt erraten wurde.

### Einschränkungen

- Der kostenlose Microlink-Plan erlaubt etwa 50 Anfragen pro Tag.
- Echte Apps speichern Vorschauen zwischen, Änderungen erscheinen dort also erst nach einiger Zeit.
