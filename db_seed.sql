-- Aerolíneas de ejemplo
INSERT INTO aerolineas (nombre) VALUES
  ('Conviasa'),
  ('Avior Airlines'),
  ('Laser Airlines'),
  ('Rutaca Airlines'),
  ('Aserca Airlines');

-- Aeropuertos de ejemplo
INSERT INTO aeropuertos (nombre, codigo_iata, ciudad_estado, tipo) VALUES
  ('Aeropuerto Internacional de Maiquetía Simón Bolívar', 'CCS', 'Caracas, Distrito Capital', 'Internacional'),
  ('Aeropuerto Internacional La Chinita', 'MAR', 'Maracaibo, Zulia', 'Internacional'),
  ('Aeropuerto Internacional Arturo Michelena', 'VLN', 'Valencia, Carabobo', 'Internacional'),
  ('Aeropuerto Internacional de Barcelona', 'BLA', 'Barcelona, Anzoátegui', 'Internacional'),
  ('Aeropuerto Internacional Jacinto Lara', 'BRM', 'Barquisimeto, Lara', 'Internacional');

-- Rutas de ejemplo
INSERT INTO rutas (origen_id, destino_id, distancia_km, tipo) VALUES
  (1, 2, 520, 'Nacional'),
  (1, 3, 130, 'Nacional'),
  (2, 3, 390, 'Nacional'),
  (1, 4, 320, 'Nacional'),
  (3, 5, 350, 'Nacional');

-- Vuelos de ejemplo
INSERT INTO vuelos (aerolinea_id, ruta_id, pasajeros_origen, pasajeros_destino, fecha, retraso_minutos) VALUES
  (1, 1, 150, 140, '2025-07-01', 10),
  (2, 2, 120, 115, '2025-07-02', 5),
  (3, 3, 100, 98, '2025-07-03', 0),
  (4, 4, 130, 128, '2025-07-04', 15),
  (5, 5, 110, 109, '2025-07-05', 7);
