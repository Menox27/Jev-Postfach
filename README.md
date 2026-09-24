# Smart Email Labeling System

Ein fortschrittliches System zur automatischen Klassifizierung von E-Mails mit KI-basierter Entscheidungsfindung.

## Funktionen

- **Multi-Account Unterstützung**: Verwalten Sie mehrere iCloud/IMAP-Konten gleichzeitig
- **KI-Klassifizierung**: Nutzt das TypeSafe Jev-Modell über OpenRouter für präzise Klassifizierung
- **Automatische Einsortierung**: Verschiebt E-Mails automatisch in entsprechende Ordner
- **Web-Oberfläche**: Moderne Benutzeroberfläche zum Verwalten von Konten und Klassifizierungen
- **Docker-Containerisierung**: Einfache Bereitstellung mit Docker Compose

## Technologie-Stack

- **Backend**: Node.js mit TypeScript
- **Frontend**: React
- **Datenbank**: SQLite
- **KI-Modell**: TypeSafe Jev über OpenRouter
- **IMAP-Client**: imapflow

## Schnellstart

1. Repository klonen
2. `docker-compose up` ausführen
3. Im Browser `http://localhost:3000` öffnen
4. E-Mail-Konten hinzufügen und Klassifizierung starten

## Konfiguration

### Umgebungsvariablen

- `IMAP_HOST`: IMAP-Server (Standard: imap.mail.me.com)
- `IMAP_PORT`: IMAP-Port (Standard: 993)
- `IMAP_USER`: IMAP-Benutzername
- `IMAP_PASS`: IMAP-Passwort
- `JEV_API_KEY`: OpenRouter API-Key
- `JEV_MODEL`: Jev-Modell (Standard: typesafe/jev-1.13)

## Entwicklung

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Lizenz

MIT
