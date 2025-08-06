# Dashboard de Aviación Venezolana

**Autor:** Daniel Jimenez  
**Universidad Alejandro de Humboldt – Ingeniería Informática**

---

## Descripción del Proyecto
Este proyecto es un **Dashboard interactivo** que visualiza datos reales de la aviación en Venezuela. Incluye métricas clave (KPIs), análisis de aerolíneas, puntualidad, rutas, flota y tráfico de aeropuertos, con **frontend** en HTML/CSS/JavaScript (Chart.js y Tailwind) y **backend** en Node.js/Express conectado a PostgreSQL.

## Estructura del Repositorio

```
venezuela-aviation-dashboard/
├── backend/                  # API y scripts de base de datos
│   ├── index.js              # Servidor Express principal
│   ├── routes_airports.js    # Endpoints de aeropuertos
│   ├── setup_complete.sql    # Script de creación y seed de tablas PostgreSQL
│   ├── .env                  # Variables de entorno (DB_URL, PORT)
│   ├── package.json          # Dependencias y scripts del backend
│   └── ...                   # Otros archivos (pruebas, utilidades)
│
├── css/                      # Estilos personalizados
│   └── style.css             # Tailwind + ajustes propios
│
├── js/                       # Lógica del frontend
│   ├── main.js               # Carga datos, render y navegación de vistas
│   ├── api.js                # (opcional) llamadas a KPIs y aerolíneas
│   ├── api-airports.js       # (opcional) llamado y gráfica de tráfico aeroportuario
│   └── verificacion.js       # Scripts de verificación (si aplica)
│
├── index.html                # Estructura HTML de la SPA
├── README.md                 # Documentación general (este archivo)
└── favicon, assets, etc.
```

## Tecnologías Principales
- **Backend:** Node.js, Express.js, pg (PostgreSQL driver)
- **Base de Datos:** PostgreSQL 14+
- **Frontend:** HTML5, CSS3 (Tailwind CSS), JavaScript ES6+, Chart.js
- **Herramientas:** dotenv, CORS, npm

## Funcionamiento General
1. **Base de Datos:**  
   - `backend/setup_complete.sql` crea tablas (`aerolineas`, `aeropuertos`, `rutas`, `vuelos`) y las llena con datos de ejemplo.
   - Conecta a PostgreSQL mediante variables en `.env`.
2. **API REST (Express):**  
   - `GET /api/kpis` → Retorna recuento de vuelos y suma de pasajeros.
   - `GET /api/aerolineas` → Lista de aerolíneas.
   - `GET /api/aeropuertos` → Lista de aeropuertos.
   - `GET /api/aeropuertos/trafico` → Tráfico origen/destino por aeropuerto (subconsultas SQL).
3. **Frontend SPA:**  
   - **main.js** administra estado (`appState`), carga datos vía `fetch`, genera datos de muestra y crea gráficos con Chart.js.
   - Navegación entre vistas (Visión General, Aerolíneas, Puntualidad, Rutas, Flota, Aeropuertos) con enlaces hash y `showView()`.
   - Cada sección renderiza su gráfico o tabla según datos reales del backend.
   - Se destruyen instancias de Chart.js antes de re-dibujar para evitar errores de canvas.

## Instalación y Ejecución

1. **Clonar repositorio**
   ```bash
   git clone <repo-url>
   cd venezuela-aviation-dashboard
   ```

2. **Base de Datos**
   - Crear base de datos `aviacion_venezuela` en PostgreSQL.
   - Ejecutar:
     ```bash
     psql -U <usuario> -d aviacion_venezuela -f backend/setup_complete.sql
     ```
   - Configurar cadena de conexión en `backend/.env`:
     ```ini
     DATABASE_URL=postgres://user:pass@localhost:5432/aviacion_venezuela
     PORT=3001
     ```

3. **Backend**
   ```bash
   cd backend
   npm install
   npm start      # Inicia servidor en http://localhost:3001
   ```

4. **Frontend**
   ```bash
   cd ..
   # Usar Python HTTP server o cualquier servidor estático
   python -m http.server 3000
   ```
   Abrir http://localhost:3000 en el navegador.

## Buenas Prácticas
- En producción instalar Tailwind CSS vía CLI o PostCSS, no CDN.
- Separar responsabilidades: mover llamadas API a módulos aparte si se expande.
- Proteger variables sensibles en `.env` y no commitear credenciales.
- Añadir validación y manejo de errores más robusto (frontend y backend).

---

**Daniel Jimenez**  
**Universidad Alejandro de Humboldt – Ingeniería Informática**
