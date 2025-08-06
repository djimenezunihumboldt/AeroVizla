// Configura aquí la URL base del backend:
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3001'
    : 'https://proyecto-1-del-portafolio-1.onrender.com';

// Función para cargar tráfico de pasajeros por aeropuerto y graficar
async function cargarTraficoAeropuertos() {
    try {
        const res = await fetch(`${API_BASE}/api/aeropuertos/trafico`);
        const data = await res.json();
        
        if (!Array.isArray(data) || data.length === 0) {
            console.warn('No se encontraron datos de aeropuertos');
            return;
        }
        
        // Ordenar por total de pasajeros (origen + destino)
        const top = data.sort((a, b) => (Number(b.total_origen) + Number(b.total_destino)) - (Number(a.total_origen) + Number(a.total_destino))).slice(0, 10);
        const labels = top.map(a => a.codigo_iata + ' - ' + a.nombre);
        const pasajeros = top.map(a => Number(a.total_origen || 0) + Number(a.total_destino || 0));
        
        const ctx = document.getElementById('airportTrafficChart');
        if (!ctx) {
            console.warn('Elemento airportTrafficChart no encontrado');
            return;
        }
        
        new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Pasajeros Totales',
                    data: pasajeros,
                    backgroundColor: '#2563eb',
                    borderColor: '#1d4ed8',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Tráfico de Pasajeros por Aeropuerto'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    } catch (err) {
        console.error('Error cargando tráfico de aeropuertos:', err);
        const ctx = document.getElementById('airportTrafficChart');
        if (ctx) {
            ctx.getContext('2d').fillText('Error cargando datos', 10, 50);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('airportTrafficChart')) {
        cargarTraficoAeropuertos();
    }
});
