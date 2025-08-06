// Endpoint para obtener tráfico de pasajeros por aeropuerto
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool();

// Obtener todos los aeropuertos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, nombre, codigo_iata as iata, ciudad_estado as ciudad, tipo
      FROM aeropuertos
      ORDER BY nombre
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tráfico total de pasajeros por aeropuerto (origen y destino)
router.get('/trafico', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        a.id,
        a.nombre,
        a.codigo_iata,
        a.ciudad_estado,
        a.tipo,
        (
          SELECT COALESCE(SUM(v.pasajeros_origen), 0)
          FROM vuelos v
          JOIN rutas r ON v.ruta_id = r.id
          WHERE r.origen_id = a.id
        ) AS total_origen,
        (
          SELECT COALESCE(SUM(v.pasajeros_destino), 0)
          FROM vuelos v
          JOIN rutas r ON v.ruta_id = r.id
          WHERE r.destino_id = a.id
        ) AS total_destino
      FROM aeropuertos a
      ORDER BY (total_origen + total_destino) DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
