FROM node:18-alpine

WORKDIR /app

# Package-Dateien kopieren
COPY package*.json ./

# Reines npm install für Alpine Linux ausführen
RUN npm install

# Quellcode kopieren
COPY . .

# Ausführungsrechte für node_modules Binaries explizit erzwingen
RUN chmod -R +x node_modules/.bin

# TypeScript Build ausführen
RUN npm run build

# Dev-Dependencies aufräumen
RUN npm prune --production

EXPOSE 3000

CMD ["npm", "start"]