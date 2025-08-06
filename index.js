require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool(); // Usa variables de entorno

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Aviación Venezolana funcionando 🚀' });
});

// Ejemplo: KPIs generales
app.get('/api/kpis', async (req, res) => {
  try {
    const vuelos = await pool.query('SELECT COUNT(*) FROM vuelos');
    const pasajeros = await pool.query('SELECT SUM(pasajeros_origen) FROM vuelos');
    res.json({
      totalVuelos: vuelos.rows[0].count,
      totalPasajeros: pasajeros.rows[0].sum
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ejemplo: Aerolíneas
app.get('/api/aerolineas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM aerolineas');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rutas de aeropuertos
const airportsRouter = require('./routes_airports');
app.use('/api/aeropuertos', airportsRouter);

// Puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
