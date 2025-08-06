// Script de prueba para verificar la conexión a PostgreSQL
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

async function testDatabase() {
  console.log('🔍 Probando conexión a PostgreSQL...');
  console.log('Configuración:');
  console.log('- Host:', process.env.PGHOST);
  console.log('- Database:', process.env.PGDATABASE);
  console.log('- User:', process.env.PGUSER);
  console.log('- Port:', process.env.PGPORT);
  console.log('');

  try {
    const client = await pool.connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    // Verificar tablas
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    const tablesResult = await client.query(tablesQuery);
    console.log('📋 Tablas encontradas:', tablesResult.rows.length);
    tablesResult.rows.forEach(row => {
      console.log('  - ' + row.table_name);
    });
    
    // Verificar datos
    const queries = [
      { name: 'Aerolíneas', query: 'SELECT COUNT(*) FROM aerolineas' },
      { name: 'Aeropuertos', query: 'SELECT COUNT(*) FROM aeropuertos' },
      { name: 'Rutas', query: 'SELECT COUNT(*) FROM rutas' },
      { name: 'Vuelos', query: 'SELECT COUNT(*) FROM vuelos' }
    ];
    
    console.log('\n📊 Conteo de registros:');
    for (const { name, query } of queries) {
      try {
        const result = await client.query(query);
        console.log(`  ${name}: ${result.rows[0].count}`);
      } catch (error) {
        console.log(`  ${name}: ERROR - ${error.message}`);
      }
    }
    
    // Probar una consulta más compleja
    console.log('\n🔍 Prueba de consulta compleja:');
    const complexQuery = `
      SELECT 
        a.nombre as aerolinea,
        ae.codigo_iata as origen,
        ad.codigo_iata as destino,
        v.pasajeros_origen,
        v.fecha
      FROM vuelos v
      JOIN aerolineas a ON v.aerolinea_id = a.id
      JOIN rutas r ON v.ruta_id = r.id
      JOIN aeropuertos ae ON r.origen_id = ae.id
      JOIN aeropuertos ad ON r.destino_id = ad.id
      ORDER BY v.fecha
      LIMIT 5;
    `;
    
    const complexResult = await client.query(complexQuery);
    console.log('Vuelos encontrados:', complexResult.rows.length);
    complexResult.rows.forEach(row => {
      console.log(`  ${row.aerolinea}: ${row.origen} → ${row.destino} (${row.pasajeros_origen} pasajeros) - ${row.fecha}`);
    });
    
    client.release();
    console.log('\n🎉 Todas las pruebas completadas exitosamente');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Detalles del error:');
    console.error('- Code:', error.code);
    console.error('- Detail:', error.detail);
    console.error('- Hint:', error.hint);
  } finally {
    await pool.end();
  }
}

testDatabase();
