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
2. Build-Script ausführen: `./build.sh` (Linux/Mac) oder `build.bat` (Windows)
3. `docker-compose up` ausführen
4. Im Browser `http://localhost:3000` öffnen
5. E-Mail-Konten hinzufügen und Klassifizierung starten

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

## Deployment mit Portainer

1. Stellen Sie sicher, dass alle Dateien im Repository sind
2. Führen Sie vor dem Deployment das Build-Script aus: `./build.sh` oder `build.bat`
3. In Portainer wählen Sie "Stacks" → "Add stack" → "Repository"
4. Geben Sie die URL Ihres Repositories an
5. Deploy the stack

Alternativ kann Portainer das Repository auch direkt clonen und bauen - das neue Dockerfile 
kümmert sich nun automatisch um den Build-Prozess, falls kein dist-Ordner vorhanden ist.

## Lizenz

MIT
