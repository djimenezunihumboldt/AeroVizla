// Script para corregir caracteres especiales en la base de datos
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool();

async function fixCharacterEncoding() {
  console.log('🔧 Corrigiendo caracteres especiales en la base de datos...');
  
  try {
    const client = await pool.connect();
    
    // Corregir nombres de aeropuertos
    const updates = [
      {
        id: 1,
        nombre: 'Aeropuerto Internacional de Maiquetía Simón Bolívar',
        ciudad: 'Caracas, Distrito Capital'
      },
      {
        id: 4,
        nombre: 'Aeropuerto Internacional de Barcelona',
        ciudad: 'Barcelona, Anzoátegui'
      }
    ];
    
    for (const update of updates) {
      await client.query(
        'UPDATE aeropuertos SET nombre = $1, ciudad_estado = $2 WHERE id = $3',
        [update.nombre, update.ciudad, update.id]
      );
      console.log(`✅ Actualizado aeropuerto ID ${update.id}: ${update.nombre}`);
    }
    
    // Verificar los cambios
    const result = await client.query('SELECT id, nombre, ciudad_estado FROM aeropuertos ORDER BY id');
    console.log('\n📋 Aeropuertos actualizados:');
    result.rows.forEach(row => {
      console.log(`  ${row.id}: ${row.nombre} (${row.ciudad_estado})`);
    });
    
    client.release();
    console.log('\n✅ Corrección completada');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

fixCharacterEncoding();
