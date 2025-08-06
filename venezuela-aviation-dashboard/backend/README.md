# Instrucciones para configurar la base de datos PostgreSQL

## 1. Instalar PostgreSQL
- Descarga e instala PostgreSQL desde https://www.postgresql.org/download/
- Durante la instalación, recuerda la contraseña del usuario `postgres`

## 2. Crear la base de datos
Abre psql (PostgreSQL command line) y ejecuta:
```sql
CREATE DATABASE aviacion_venezuela;
```

## 3. Conectar a la base de datos
```sql
\c aviacion_venezuela
```

## 4. Ejecutar el script de configuración
Desde la línea de comandos, navega a la carpeta backend y ejecuta:
```bash
psql -U postgres -d aviacion_venezuela -f setup_complete.sql
```

O copia y pega el contenido del archivo `setup_complete.sql` en psql.

## 5. Verificar la instalación
```sql
SELECT 'Aerolíneas' as tabla, COUNT(*) as registros FROM aerolineas
UNION ALL
SELECT 'Aeropuertos', COUNT(*) FROM aeropuertos
UNION ALL
SELECT 'Rutas', COUNT(*) FROM rutas
UNION ALL
SELECT 'Vuelos', COUNT(*) FROM vuelos;
```

## 6. Configurar el archivo .env
Edita el archivo `.env` en la carpeta backend con tus datos:
```
PORT=3001
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=tu_contraseña_aquí
PGDATABASE=aviacion_venezuela
PGPORT=5432
```

## 7. Instalar dependencias del backend
```bash
cd backend
npm install
```

## 8. Ejecutar el servidor
```bash
npm start
```

¡Listo! Tu API estará disponible en http://localhost:3001 y tu dashboard podrá obtener datos reales de PostgreSQL.
