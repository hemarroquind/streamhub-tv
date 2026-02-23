# ◈ StreamHub TV

**TV en vivo de todo el mundo + apps de streaming — optimizado para Fire TV**

![StreamHub TV](https://img.shields.io/badge/StreamHub-TV-FF5A32?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square)
![HLS.js](https://img.shields.io/badge/HLS.js-Streaming-red?style=flat-square)
![Fire TV](https://img.shields.io/badge/Fire_TV-Ready-FF9900?style=flat-square)

---

## 🚀 Inicio Rápido (Local)

### Requisitos
- **Node.js** 18+ ([descargar](https://nodejs.org))
- **npm** (incluido con Node.js)

### Instalación y ejecución

```bash
# 1. Entra al directorio del proyecto
cd streamhub-tv

# 2. Instala dependencias
npm install

# 3. Inicia el servidor de desarrollo
npm run dev
```

Abre **http://localhost:3000** en tu navegador.

### Acceder desde Fire TV en la misma red

1. En tu PC, busca tu IP local:
   - **Windows**: `ipconfig` → busca "IPv4 Address" (ej: `192.168.1.100`)
   - **Mac/Linux**: `ifconfig` o `ip addr` (ej: `192.168.1.100`)

2. En Fire TV, abre **Silk Browser** y navega a:
   ```
   http://192.168.1.100:3000
   ```

3. ¡Listo! StreamHub TV se carga en tu Fire TV.

---

## 📦 Build para Producción

```bash
# Generar archivos optimizados
npm run build

# Los archivos quedan en /dist
# Para probar localmente el build:
npm run preview
```

---

## 🌐 Opciones de Despliegue

### Opción 1: Servidor local permanente (tu PC como servidor)

```bash
# Instala 'serve' globalmente
npm install -g serve

# Sirve el build de producción
cd streamhub-tv
npm run build
serve -s dist -l 3000
```

Para que corra automáticamente al encender tu PC:

**Windows** — Crea un archivo `start-streamhub.bat`:
```bat
@echo off
cd /d C:\ruta\a\streamhub-tv
npx serve -s dist -l 3000
```
Colócalo en `shell:startup` (Win+R → `shell:startup`)

**Mac** — Crea un LaunchAgent (`~/Library/LaunchAgents/com.streamhub.plist`)

**Linux** — Crea un servicio systemd:
```ini
# /etc/systemd/system/streamhub.service
[Unit]
Description=StreamHub TV
After=network.target

[Service]
WorkingDirectory=/ruta/a/streamhub-tv
ExecStart=/usr/bin/npx serve -s dist -l 3000
Restart=always
User=tu-usuario

[Install]
WantedBy=multi-user.target
```
```bash
sudo systemctl enable streamhub
sudo systemctl start streamhub
```

---

### Opción 2: Raspberry Pi (servidor dedicado 24/7)

```bash
# En tu Raspberry Pi
sudo apt update && sudo apt install nodejs npm
git clone <tu-repo> streamhub-tv
cd streamhub-tv
npm install
npm run build

# Instala PM2 para mantenerlo corriendo
npm install -g pm2
pm2 start "npx serve -s dist -l 3000" --name streamhub
pm2 startup
pm2 save
```

En Fire TV: `http://<ip-raspberry>:3000`

---

### Opción 3: Vercel (hosting gratuito en la nube)

```bash
# Instala Vercel CLI
npm install -g vercel

# Despliega
cd streamhub-tv
vercel

# Sigue las instrucciones — obtendrás una URL como:
# https://streamhub-tv.vercel.app
```

En Fire TV: abre la URL de Vercel en Silk Browser.

---

### Opción 4: Netlify (hosting gratuito)

```bash
# Instala Netlify CLI
npm install -g netlify-cli

# Build y despliega
npm run build
netlify deploy --prod --dir=dist
```

---

### Opción 5: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
docker build -t streamhub-tv .
docker run -d -p 3000:80 streamhub-tv
```

---

## 📱 Instalar como App en Fire TV

### Método 1: Bookmark en Silk Browser
1. Abre StreamHub TV en Silk Browser
2. Menú → "Add to Bookmarks"
3. Aparecerá en la pantalla de inicio de Silk

### Método 2: Crear APK con TWA (Trusted Web Activity)
Para crear una app nativa que se instale como APK:

```bash
# Instala Bubblewrap
npm install -g @nicolo-ribaudo/bubblewrap

# Genera el proyecto Android
bubblewrap init --manifest https://tu-url.com/manifest.json

# Compila el APK
bubblewrap build

# Instala en Fire TV via ADB
adb install app-release-signed.apk
```

### Método 3: Sideload con adb
Si prefieres cargar la web app directamente:
```bash
# Habilita ADB en Fire TV:
# Settings → My Fire TV → Developer Options → ADB Debugging: ON

# Desde tu PC:
adb connect <fire-tv-ip>:5555
adb shell am start -a android.intent.action.VIEW -d "http://tu-servidor:3000" com.amazon.cloud9
```

---

## 🔧 Agregar Más Canales

Edita `src/channels.js` y agrega entradas al array `CHANNELS`:

```javascript
{
  id: "mi-canal",           // ID único
  name: "Mi Canal",         // Nombre para mostrar
  country: "MX",            // Código ISO del país
  categories: ["news"],     // Categorías: news, sports, entertainment, music, movies, kids, documentary, general
  languages: ["spa"],       // Códigos ISO de idioma: spa, eng, fra, deu, ita, por
  logo: "https://...",      // URL del logo
  streamUrl: "https://...m3u8"  // URL del stream HLS (.m3u8)
}
```

### Encontrar streams públicos
- **iptv-org**: https://github.com/iptv-org/iptv
- **Free-TV**: https://github.com/Free-TV/IPTV
- Busca streams por país: `https://iptv-org.github.io/iptv/countries/mx.m3u` (cambia `mx` por el código de país)

---

## 🏗️ Estructura del Proyecto

```
streamhub-tv/
├── index.html          # HTML entry point (boot screen)
├── package.json        # Dependencias y scripts
├── vite.config.js      # Configuración de Vite
├── public/
│   └── manifest.json   # PWA manifest
└── src/
    ├── main.jsx        # React entry point
    ├── App.jsx         # Componente principal (Home + Player)
    ├── HLSPlayer.jsx   # Reproductor HLS con hls.js
    ├── channels.js     # Base de datos de canales
    └── styles.css      # Estilos CSS
```

---

## 🎮 Controles

| Acción | Control Remoto Fire TV | Teclado |
|--------|----------------------|---------|
| Navegar | D-pad (flechas) | ← → ↑ ↓ |
| Seleccionar | Botón central | Enter |
| Volver | Back | Escape |
| Buscar | (ir al campo de búsqueda) | Escribir |

---

## 📝 Notas

- Los streams son de **TV pública y abierta** proporcionados por los propios canales
- Algunos streams pueden estar temporalmente no disponibles (dependen del servidor del canal)
- Los deep links a Netflix, Disney+, etc. abren la app correspondiente en Fire TV
- La app funciona como PWA y puede instalarse en el dispositivo
- HLS.js maneja la reproducción en Chrome/Firefox; Safari usa HLS nativo
