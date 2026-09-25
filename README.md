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
4. Im Browser `http://localhost:3001` öffnen (Frontend) oder `http://localhost:3000` (API)
5. E-Mail-Konten hinzufügen und Klassifizierung starten

## Verwendung

1. Öffnen Sie `http://IHRE_SERVER_IP:3001` im Browser
2. Fügen Sie Ihr E-Mail-Konto hinzu:
   - Geben Sie Ihre E-Mail-Adresse ein
   - IMAP-Host: `imap.mail.me.com` (für iCloud) oder Ihren Provider
   - IMAP-Port: `993` (für SSL)
   - IMAP-Benutzername: Ihre vollständige E-Mail-Adresse
   - IMAP-Passwort: Ihr App-spezifisches Passwort
   - Jev API Key: Ihr OpenRouter API-Key (https://openrouter.ai/keys)
3. Klicken Sie auf "Add Account"
4. Wählen Sie das Konto aus und klicken Sie auf "Process Emails"

## Konfiguration

### Umgebungsvariablen

- `IMAP_HOST`: IMAP-Server (Standard: imap.mail.me.com)
- `IMAP_PORT`: IMAP-Port (Standard: 993)
- `IMAP_USER`: IMAP-Benutzername (wird im Frontend überschrieben)
- `IMAP_PASS`: IMAP-Passwort (wird im Frontend überschrieben)
- `JEV_API_KEY`: OpenRouter API-Key (wird im Frontend überschrieben)
- `JEV_MODEL`: Jev-Modell (Standard: typesafe/jev-1.13)

## OpenRouter API Key erhalten

1. Gehen Sie zu https://openrouter.ai/
2. Erstellen Sie einen kostenlosen Account
3. Gehen Sie zu https://openrouter.ai/keys
4. Erstellen Sie einen neuen API-Key
5. Verwenden Sie diesen Key beim Hinzufügen Ihres E-Mail-Kontos

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

## API Endpoints

- `GET /` - Health check
- `POST /api/users/register` - Register new user
- `GET /api/users` - List all users
- `POST /api/emails/:userId/process` - Process emails for user
- `GET /api/emails/:userId/classifications` - Get classifications for user
- `GET /api/rules` - Get classification rules
- `POST /api/rules` - Create/update rules

## Lizenz

MIT
