// Configura aquí la URL base del backend:
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3001'
    : 'https://proyecto-1-del-portafolio-1.onrender.com';

// Función para obtener KPIs desde el backend y mostrarlos en el dashboard
async function cargarKPIs() {
    try {
        const res = await fetch(`${API_BASE}/api/kpis`);
        const data = await res.json();
        document.getElementById('kpi-total-flights').textContent = data.totalVuelos || 0;
        document.getElementById('kpi-total-passengers').textContent = Number(data.totalPasajeros || 0).toLocaleString();
        document.getElementById('kpi-avg-delay').textContent = '12 min';
        document.getElementById('kpi-total-revenue').textContent = '$' + Math.round((data.totalPasajeros || 0) * 0.15) + ' M';
    } catch (err) {
        console.error('Error cargando KPIs:', err);
        document.getElementById('kpi-total-flights').textContent = '0';
        document.getElementById('kpi-total-passengers').textContent = '0';
        document.getElementById('kpi-avg-delay').textContent = '0 min';
        document.getElementById('kpi-total-revenue').textContent = '$0 M';
    }
}

// Función para obtener aerolíneas y llenar el filtro
async function cargarAerolíneas() {
    try {
        const res = await fetch(`${API_BASE}/api/aerolineas`);
        const aerolineas = await res.json();
        const select = document.getElementById('airline-filter');
        select.innerHTML = '<option value="all">Todas las Aerolíneas</option>';
        aerolineas.forEach(aero => {
            const opt = document.createElement('option');
            opt.value = aero.id;
            opt.textContent = aero.nombre;
            select.appendChild(opt);
        });
    } catch (err) {
        console.error('Error cargando aerolíneas:', err);
    }
}

// Ejecutar al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    cargarKPIs();
    cargarAerolíneas();
});
