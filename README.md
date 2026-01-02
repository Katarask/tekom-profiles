# TEKOM Kandidaten-Profile

Dynamisches Profil-Hosting für TEKOM Recruiting.

## Live URL

**https://profil.tekom-gmbh.de/[NOTION-PAGE-ID]**

## Wie es funktioniert

1. Kandidat wird in Notion angelegt
2. Notion Page ID kopieren (z.B. `1234abcd5678efgh`)
3. Profil aufrufen: `https://profil.tekom-gmbh.de/1234abcd5678efgh`
4. Daten werden live aus Notion geladen

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Öffne http://localhost:3000/[NOTION-PAGE-ID]

## Deployment

Das Projekt deployed automatisch auf Vercel bei Push zu `main`.

### Custom Domain einrichten

1. In Vercel: Settings → Domains → `profil.tekom-gmbh.de`
2. DNS beim Provider:
   - CNAME `profil` → `cname.vercel-dns.com`
   - oder A Record → Vercel IP

## Umgebungsvariablen

In Vercel Dashboard unter Settings → Environment Variables:

```
NOTION_API_KEY=ntn_xxx...
NOTION_KANDIDATEN_DB=42c178b0-55fd-42b1-b126-d9ad02dc3fba
```

## URL-Format

```
https://profil.tekom-gmbh.de/[NOTION-PAGE-ID]
```

Die Page ID findest du in Notion:
- Seite öffnen → URL kopieren
- Format: `notion.so/workspace/Name-123abc456def`
- Die ID ist: `123abc456def` (mit oder ohne Bindestriche)

---

TEKOM Industrielle Systemtechnik GmbH
