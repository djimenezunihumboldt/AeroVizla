// Script para verificar que la aplicación funciona correctamente

console.log('=== VERIFICACIÓN DE APLICACIÓN ===');

// 1. Verificar que los endpoints del backend funcionan
async function verificarBackend() {
    console.log('\n1. Verificando endpoints del backend...');
    
    try {
        // Verificar KPIs
        const kpisResponse = await fetch('http://localhost:3001/api/kpis');
        const kpisData = await kpisResponse.json();
        console.log('✓ KPIs funcionando:', kpisData);
        
        // Verificar aerolíneas
        const airlinesResponse = await fetch('http://localhost:3001/api/aerolineas');
        const airlinesData = await airlinesResponse.json();
        console.log('✓ Aerolíneas funcionando:', airlinesData.length, 'encontradas');
        
        // Verificar aeropuertos
        const airportsResponse = await fetch('http://localhost:3001/api/aeropuertos');
        const airportsData = await airportsResponse.json();
        console.log('✓ Aeropuertos funcionando:', airportsData.length, 'encontrados');
        
        return true;
    } catch (error) {
        console.error('✗ Error en backend:', error);
        return false;
    }
}

// 2. Verificar que los elementos HTML existen
function verificarHTML() {
    console.log('\n2. Verificando elementos HTML...');
    
    const elementos = [
        'kpi-total-flights',
        'kpi-total-passengers',
        'kpi-avg-delay',
        'kpi-total-revenue',
        'airline-filter'
    ];
    
    let todosExisten = true;
    elementos.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            console.log(`✓ Elemento ${id} encontrado`);
        } else {
            console.error(`✗ Elemento ${id} NO encontrado`);
            todosExisten = false;
        }
    });
    
    return todosExisten;
}

// 3. Verificar que Chart.js está disponible
function verificarChartJS() {
    console.log('\n3. Verificando Chart.js...');
    
    if (typeof Chart !== 'undefined') {
        console.log('✓ Chart.js está disponible');
        return true;
    } else {
        console.error('✗ Chart.js NO está disponible');
        return false;
    }
}

// Ejecutar verificaciones
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, iniciando verificaciones...');
    
    const backendOK = await verificarBackend();
    const htmlOK = verificarHTML();
    const chartOK = verificarChartJS();
    
    console.log('\n=== RESUMEN ===');
    console.log('Backend:', backendOK ? '✓ OK' : '✗ ERROR');
    console.log('HTML:', htmlOK ? '✓ OK' : '✗ ERROR');
    console.log('Chart.js:', chartOK ? '✓ OK' : '✗ ERROR');
    
    if (backendOK && htmlOK && chartOK) {
        console.log('\n🎉 ¡Aplicación lista para usar!');
    } else {
        console.log('\n⚠️  Hay problemas que necesitan resolverse');
    }
});
