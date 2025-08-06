-- Tabla de aeropuertos
CREATE TABLE IF NOT EXISTS aeropuertos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo_iata VARCHAR(5) NOT NULL UNIQUE,
    ciudad_estado VARCHAR(100),
    tipo VARCHAR(50)
);

-- Tabla de rutas
CREATE TABLE IF NOT EXISTS rutas (
    id SERIAL PRIMARY KEY,
    origen_id INTEGER REFERENCES aeropuertos(id),
    destino_id INTEGER REFERENCES aeropuertos(id),
    distancia_km INTEGER,
    tipo VARCHAR(50)
);

-- Tabla de vuelos (actualizada para incluir rutas y pasajeros origen/destino)
CREATE TABLE IF NOT EXISTS vuelos (
    id SERIAL PRIMARY KEY,
    aerolinea_id INTEGER REFERENCES aerolineas(id),
    ruta_id INTEGER REFERENCES rutas(id),
    pasajeros_origen INTEGER,
    pasajeros_destino INTEGER,
    fecha DATE,
    retraso_minutos INTEGER
);
