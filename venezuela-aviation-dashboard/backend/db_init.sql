-- SQL de ejemplo para crear tablas básicas
CREATE TABLE IF NOT EXISTS aerolineas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS vuelos (
    id SERIAL PRIMARY KEY,
    aerolinea_id INTEGER REFERENCES aerolineas(id),
    pasajeros INTEGER,
    fecha DATE
);
