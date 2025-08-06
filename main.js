// Configura aquí la URL base del backend:
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3001'
    : 'https://proyecto-1-del-portafolio-1.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
    // --- DATOS DESDE API ---
    // Variables para almacenar datos del backend
    let airlines = [];
    let airports = [];
    let routes = [];
    let flights = [];
    let reviews = [];
    let apiData = {};

    // --- FUNCIONES PARA CARGAR DATOS DEL API ---
    async function loadApiData() {
        try {
            console.log('Cargando datos del API...');
            
            // Cargar aerolíneas
            const airlinesResponse = await fetch(`${API_BASE}/api/aerolineas`);
            if (airlinesResponse.ok) {
                const airlinesData = await airlinesResponse.json();
                airlines = airlinesData.map(a => ({
                    id: a.id,
                    name: a.nombre,
                    iata: a.iata || 'N/A',
                    icao: a.icao || 'N/A',
                    founded: a.fundada || 'N/A',
                    base: a.base || 'N/A',
                    fleetSize: a.flota || 0,
                    commonAircraft: a.aeronaves || ['N/A']
                }));
                console.log('Aerolíneas cargadas:', airlines.length);
            }

            // Cargar aeropuertos  
            const airportsResponse = await fetch(`${API_BASE}/api/aeropuertos`);
            if (airportsResponse.ok) {
                const airportsData = await airportsResponse.json();
                airports = airportsData.map(a => ({
                    id: a.id,
                    iata: a.iata,
                    name: a.nombre,
                    city: a.ciudad.split(',')[0] || a.ciudad,
                    state: a.ciudad.split(',')[1] || 'Venezuela',
                    type: a.tipo || 'Nacional'
                }));
                console.log('Aeropuertos cargados:', airports.length);
            }

            // Cargar KPIs
            const kpisResponse = await fetch(`${API_BASE}/api/kpis`);
            if (kpisResponse.ok) {
                apiData = await kpisResponse.json();
                console.log('KPIs cargados:', apiData);
            }

            // Generar algunos datos de prueba basados en datos reales
            generateSampleData();
            
        } catch (error) {
            console.error('Error cargando datos del API:', error);
            // Usar datos de respaldo en caso de error
            loadFallbackData();
        }
    }

    function generateSampleData() {
        // Generar rutas basadas en aeropuertos reales
        routes = [];
        if (airports.length > 1) {
            const mainAirport = airports[0]; // Usar el primer aeropuerto como principal
            airports.forEach((airport, index) => {
                if (index > 0) {
                    routes.push({
                        id: routes.length + 1,
                        origin: mainAirport.id,
                        dest: airport.id,
                        name: `${mainAirport.iata}-${airport.iata}`,
                        distance: Math.floor(Math.random() * 800) + 100,
                        type: 'Nacional'
                    });
                    // Agregar ruta de vuelta
                    routes.push({
                        id: routes.length + 1,
                        origin: airport.id,
                        dest: mainAirport.id,
                        name: `${airport.iata}-${mainAirport.iata}`,
                        distance: Math.floor(Math.random() * 800) + 100,
                        type: 'Nacional'
                    });
                }
            });
        }

        // Generar vuelos de muestra
        flights = [];
        if (routes.length > 0 && airlines.length > 0) {
            for (let i = 0; i < 200; i++) {
                const route = routes[Math.floor(Math.random() * routes.length)];
                const airline = airlines[Math.floor(Math.random() * airlines.length)];
                
                const passengers = Math.floor(Math.random() * 150) + 50;
                const delay = Math.random() < 0.3 ? Math.floor(Math.random() * 60) : 0;
                
                flights.push({
                    id: i,
                    airlineId: airline.id,
                    routeId: route.id,
                    originId: route.origin,
                    destId: route.dest,
                    passengers: passengers,
                    delay: delay,
                    onTime: delay === 0 ? 1 : 0,
                    revenue: passengers * (Math.random() * 100 + 50),
                    month: Math.floor(Math.random() * 12),
                    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
                    aircraftType: 'Boeing 737'
                });
            }
        }
        
        // Generar reseñas de muestra
        reviews = [];
        flights.forEach(f => {
            const baseRating = Math.floor(Math.random() * 3) + 2;
            reviews.push({
                airlineId: f.airlineId,
                routeId: f.routeId,
                rating: {
                    seat: Math.max(1, baseRating + Math.floor(Math.random() * 3) - 1),
                    food: Math.max(1, baseRating + Math.floor(Math.random() * 3) - 1),
                    entertainment: Math.max(1, baseRating + Math.floor(Math.random() * 3) - 1),
                    staff: Math.max(1, baseRating + Math.floor(Math.random() * 3) - 1),
                    punctuality: f.delay === 0 ? 5 : (f.delay < 30 ? 3 : 1)
                }
            });
        });
        console.log('Reseñas generadas:', reviews.length);
        
        console.log('Datos generados:', { airlines: airlines.length, airports: airports.length, routes: routes.length, flights: flights.length, reviews: reviews.length });
    }

    function loadFallbackData() {
        // Datos de respaldo si falla la conexión al API
        airlines = [
            { id: 1, name: "Conviasa", iata: "V0", icao: "CNV", founded: 2004, base: "Caracas", fleetSize: 25, commonAircraft: ["Embraer 190", "Airbus A340"] },
            { id: 2, name: "Avior Airlines", iata: "9V", icao: "BRV", founded: 1994, base: "Barcelona", fleetSize: 8, commonAircraft: ["Boeing 737"] }
        ];

        airports = [
            { id: 1, iata: "CCS", name: "Simón Bolívar Intl. Airport", city: "Maiquetía", state: "La Guaira", type: "Internacional" },
            { id: 2, iata: "MAR", name: "La Chinita Intl. Airport", city: "Maracaibo", state: "Zulia", type: "Internacional" }
        ];

        routes = [
            { id: 1, origin: 1, dest: 2, name: 'CCS-MAR', distance: 690, type: 'Nacional' }
        ];

        flights = [];
        generateSampleData();
    }

    // --- ESTADO GLOBAL Y GRÁFICOS ---
    let appState = {
        currentView: 'overview',
        selectedAirline: 'all',
        selectedRouteId: null,
        selectedAirportId: null
    };

    const chartInstances = {};
    let passengerByAirport = {}; // Declarada en un ámbito superior para accesibilidad


    // --- FUNCIONES DE NAVEGACIÓN ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main > section');

    // Muestra la sección correspondiente y actualiza el enlace de navegación activo
    function showView(viewId) {
        appState.currentView = viewId;
        // Destroy existing charts to avoid reuse of canvas
        Object.keys(chartInstances).forEach(key => {
            try { chartInstances[key].destroy(); } catch {}
        });
        Object.keys(chartInstances).forEach(key => delete chartInstances[key]);
        sections.forEach(section => {
            if (section.id === `${viewId}-section`) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });
        navLinks.forEach(link => {
            if (link.hash === `#${viewId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        // Oculta los paneles de detalle al cambiar de vista
        document.getElementById('route-detail-panel').classList.add('hidden');
        document.getElementById('airport-detail-panel').classList.add('hidden');
        appState.selectedRouteId = null;
        appState.selectedAirportId = null;
        // Redibujar gráficos tras actualizar visibilidad
        setTimeout(() => {
            updateAllVisuals();
        }, 0);
    }

    // Agrega listeners a los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = e.target.hash.substring(1);
            showView(viewId);
        });
    });


    // --- FUNCIONES DE AYUDA DE DATOS ---
    function getAirlineName(id) {
        return airlines.find(a => a.id === id)?.name || 'Desconocida';
    }
    function getAirportIata(id) {
        return airports.find(a => a.id === id)?.iata || 'N/A';
    }
    function getAirportName(id) {
        return airports.find(a => a.id === id)?.name || 'Desconocido';
    }
    function getRouteName(id) {
        return routes.find(r => r.id === id)?.name || 'Desconocida';
    }
    // Formatea números con separadores de miles y decimales para Venezuela
    function formatNumber(num) {
        if (num === null || isNaN(num)) return 'N/A';
        return new Intl.NumberFormat('es-VE').format(num);
    }
    // Envuelve etiquetas largas para gráficos
    function wrapLabels(label) {
        const maxLength = 16;
        if (label.length <= maxLength) return label;
        const words = label.split(' ');
        let lines = [];
        let currentLine = '';
        words.forEach(word => {
            if ((currentLine + word).length <= maxLength) {
                currentLine += (currentLine ? ' ' : '') + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        });
        lines.push(currentLine);
        return lines;
    }


    // --- INICIALIZACIÓN DE LA APLICACIÓN ---
    async function initializeDashboard() {
        // Cargar datos del API primero
        await loadApiData();
        
        // Establece la vista inicial basada en el hash de la URL o por defecto a 'overview'
        const initialView = window.location.hash ? window.location.hash.substring(1) : 'overview';
        showView(initialView);
        
        // Rellena el filtro de aerolíneas y agrega su listener
        populateAirlineFilter();
        document.getElementById('airline-filter').addEventListener('change', handleAirlineFilterChange);

        // Actualiza todas las visualizaciones al iniciar
        updateAllVisuals();
    }

    // Manejador de cambio para el filtro de aerolíneas
    function handleAirlineFilterChange(e) {
        appState.selectedAirline = e.target.value;
        updateAllVisuals();
    }

    // Rellena el menú desplegable del filtro de aerolíneas
    function populateAirlineFilter() {
        const select = document.getElementById('airline-filter');
        // Limpiar opciones existentes excepto la primera
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        airlines.forEach(airline => {
            const option = document.createElement('option');
            option.value = airline.id;
            option.textContent = airline.name;
            select.appendChild(option);
        });
        
        console.log('Filtro de aerolíneas poblado con', airlines.length, 'aerolíneas');
    }


    // --- LÓGICA DE ACTUALIZACIÓN DE VISUALIZACIONES ---
    function updateAllVisuals() {
        // Render only visuals for current view
        switch (appState.currentView) {
            case 'overview':
                updateOverviewKPIs();
                renderMonthlyPassengersChart();
                renderSatisfactionChart();
                break;
            case 'airlines':
                renderMarketShareChart();
                renderRatingsRadarChart();
                break;
            case 'punctuality':
                renderPunctualityChart();
                break;
            case 'routes':
                updateRoutesTable();
                if (appState.selectedRouteId !== null) displayRouteDetails(appState.selectedRouteId);
                break;
            case 'fleet':
                updateFleetTable();
                renderAircraftTypeChart();
                break;
            case 'airports':
                renderAirportTrafficChart();
                if (appState.selectedAirportId !== null) displayAirportDetails(appState.selectedAirportId);
                break;
            default:
                break;
        }
    }
    
    // Actualiza las tarjetas de KPIs en la sección de Visión General
    function updateOverviewKPIs() {
        // Usar datos del API si están disponibles
        if (apiData.totalVuelos && apiData.totalPasajeros) {
            document.getElementById('kpi-total-flights').textContent = formatNumber(apiData.totalVuelos);
            document.getElementById('kpi-total-passengers').textContent = formatNumber(apiData.totalPasajeros);
            document.getElementById('kpi-avg-delay').textContent = '12 min'; // Placeholder
            document.getElementById('kpi-total-revenue').textContent = '$' + (apiData.totalPasajeros * 0.15).toFixed(1) + ' M';
        } else {
            // Fallback a datos simulados
            document.getElementById('kpi-total-flights').textContent = formatNumber(flights.length);
            const totalPassengers = flights.reduce((sum, f) => sum + f.passengers, 0);
            document.getElementById('kpi-total-passengers').textContent = formatNumber(totalPassengers);
            const totalDelay = flights.reduce((sum, f) => sum + f.delay, 0);
            document.getElementById('kpi-avg-delay').textContent = `${(totalDelay / flights.length).toFixed(1)} min`;
            const totalRevenue = flights.reduce((sum, f) => sum + f.revenue, 0);
            document.getElementById('kpi-total-revenue').textContent = `$${(totalRevenue / 1_000_000).toFixed(2)} M`;
        }
    }

    // Renderiza el gráfico de pasajeros mensuales
    function renderMonthlyPassengersChart() {
        const ctx = document.getElementById('monthlyPassengersChart').getContext('2d');
        const monthlyData = new Array(12).fill(0);
        flights.forEach(f => {
            monthlyData[f.month] += f.passengers;
        });

        if (chartInstances.monthly) chartInstances.monthly.destroy();
        chartInstances.monthly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [{
                    label: 'Pasajeros por Mes',
                    data: monthlyData,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += formatNumber(context.parsed.y) + ' pasajeros';
                                }
                                return label;
                            }
                        }
                    }
                }
            },
        });
    }
    
    // Renderiza el gráfico de satisfacción general del pasajero
    function renderSatisfactionChart() {
        const ctx = document.getElementById('satisfactionChart').getContext('2d');
        // Determine recommended reviews based on average rating >= 4
        const recommendedCount = reviews.filter(r => {
            const sumRatings = Object.values(r.rating).reduce((sum, v) => sum + v, 0);
            const avg = sumRatings / Object.keys(r.rating).length;
            return avg >= 4;
        }).length;
        const notRecommendedCount = reviews.length - recommendedCount;
        
        if (chartInstances.satisfaction) chartInstances.satisfaction.destroy();
        chartInstances.satisfaction = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Recomendado', 'No Recomendado'],
                datasets: [{
                    data: [recommendedCount, notRecommendedCount],
                    backgroundColor: ['#10B981', '#EF4444'],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += formatNumber(context.parsed) + ' (' + (context.dataset.data[context.dataIndex] / reviews.length * 100).toFixed(1) + '%)';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // Renderiza el gráfico de cuota de mercado por aerolínea
    function renderMarketShareChart() {
        const ctx = document.getElementById('marketShareChart').getContext('2d');
        const passengerByAirline = {};
        airlines.forEach(a => passengerByAirline[a.id] = 0);
        flights.forEach(f => {
            passengerByAirline[f.airlineId] += f.passengers;
        });
        
        const sortedAirlines = airlines.slice().sort((a,b) => passengerByAirline[b.id] - passengerByAirline[a.id]);

        const data = {
            labels: sortedAirlines.map(a => wrapLabels(a.name)),
            datasets: [{
                label: 'Pasajeros',
                data: sortedAirlines.map(a => passengerByAirline[a.id]),
                backgroundColor: '#60A5FA'
            }]
        };

        if (chartInstances.marketShare) chartInstances.marketShare.destroy();
        chartInstances.marketShare = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.x !== null) {
                                    label += formatNumber(context.parsed.x) + ' pasajeros';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: { x: { beginAtZero: true } }
            }
        });
    }

    // Renderiza el gráfico de radar de calificaciones de servicio
    function renderRatingsRadarChart() {
        const ctx = document.getElementById('ratingsRadarChart').getContext('2d');
        
        const getAvgRatings = (airlineId) => {
            const relevantReviews = (airlineId === 'all')
                ? reviews
                : reviews.filter(r => r.airlineId == airlineId);

            if(relevantReviews.length === 0) return { seat: 0, food: 0, entertainment: 0, staff: 0, punctuality: 0 };
            
            const sums = relevantReviews.reduce((acc, r) => {
                acc.seat += r.rating.seat;
                acc.food += r.rating.food;
                acc.entertainment += r.rating.entertainment;
                acc.staff += r.rating.staff;
                acc.punctuality += r.rating.punctuality;
                return acc;
            }, { seat: 0, food: 0, entertainment: 0, staff: 0, punctuality: 0 });

            const count = relevantReviews.length;
            return {
                seat: sums.seat / count,
                food: sums.food / count,
                entertainment: sums.entertainment / count,
                staff: sums.staff / count,
                punctuality: sums.punctuality / count
            };
        };

        const industryAvg = getAvgRatings('all');
        const selectedAvg = getAvgRatings(appState.selectedAirline);

        const data = {
            labels: ['Asiento', 'Comida', 'Entretenimiento', 'Personal', 'Puntualidad'],
            datasets: [
                {
                    label: 'Promedio Industria',
                    data: Object.values(industryAvg),
                    borderColor: 'rgba(209, 213, 219, 1)',
                    backgroundColor: 'rgba(209, 213, 219, 0.2)',
                    pointBackgroundColor: 'rgba(209, 213, 219, 1)'
                },
                 {
                    label: appState.selectedAirline === 'all' ? 'Todas' : getAirlineName(parseInt(appState.selectedAirline)),
                    data: Object.values(selectedAvg),
                    borderColor: 'rgba(59, 130, 246, 1)',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    pointBackgroundColor: 'rgba(59, 130, 246, 1)'
                }
            ]
        };

        if (chartInstances.ratingsRadar) chartInstances.ratingsRadar.destroy();
        chartInstances.ratingsRadar = new Chart(ctx, {
            type: 'radar',
            data: data,
             options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 5,
                        pointLabels: { font: { size: 14 } },
                        ticks: { stepSize: 1 }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.r !== null) {
                                    label += context.parsed.r.toFixed(2);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // Renderiza el gráfico de porcentaje de vuelos a tiempo
    function renderPunctualityChart() {
        const ctx = document.getElementById('punctualityChart').getContext('2d');
        const punctualityData = {};

        airlines.forEach(a => {
            punctualityData[a.id] = { onTimeFlights: 0, totalFlights: 0 };
        });

        flights.forEach(f => {
            punctualityData[f.airlineId].totalFlights++;
            if (f.onTime === 1) {
                punctualityData[f.airlineId].onTimeFlights++;
            }
        });

        const airlinePunctuality = airlines.map(a => {
            const total = punctualityData[a.id].totalFlights;
            const onTime = punctualityData[a.id].onTimeFlights;
            return {
                name: a.name,
                percentage: total > 0 ? (onTime / total) * 100 : 0
            };
        }).sort((a,b) => b.percentage - a.percentage);

        const data = {
            labels: airlinePunctuality.map(a => wrapLabels(a.name)),
            datasets: [{
                label: 'Vuelos a Tiempo (%)',
                data: airlinePunctuality.map(a => a.percentage),
                backgroundColor: '#FBBF24'
            }]
        };

        if (chartInstances.punctuality) chartInstances.punctuality.destroy();
        chartInstances.punctuality = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { callback: function(value) { return value + '%'; } }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.x !== null) {
                                    label += context.parsed.x.toFixed(1) + '%';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Actualiza la tabla de rutas más transitadas
    function updateRoutesTable() {
        const routesTraffic = {};
         flights.forEach(f => {
            if(!routesTraffic[f.routeId]) {
                routesTraffic[f.routeId] = { passengers: 0, flights: 0, delays: 0 };
            }
            routesTraffic[f.routeId].passengers += f.passengers;
            routesTraffic[f.routeId].flights++;
            routesTraffic[f.routeId].delays += f.delay;
        });

        const sortedRoutes = Object.keys(routesTraffic).sort((a,b) => routesTraffic[b].passengers - routesTraffic[a].passengers).slice(0, 10);
        
        const tableBody = document.getElementById('routes-table-body');
        tableBody.innerHTML = '';
        
        sortedRoutes.forEach(routeId => {
            const routeInfo = routes.find(r => r.id == routeId);
            const traffic = routesTraffic[routeId];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${routeInfo.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatNumber(traffic.passengers)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatNumber(traffic.flights)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button data-route-id="${routeId}" class="text-blue-600 hover:text-blue-900 view-route-details">Ver Detalles</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        document.querySelectorAll('.view-route-details').forEach(button => {
            button.addEventListener('click', (e) => {
                const routeId = parseInt(e.target.dataset.routeId);
                appState.selectedRouteId = routeId;
                displayRouteDetails(routeId);
            });
        });
    }

    // Muestra los detalles de una ruta específica en un panel
    function displayRouteDetails(routeId) {
        const route = routes.find(r => r.id === routeId);
        if (!route) return;

        const panel = document.getElementById('route-detail-panel');
        panel.classList.remove('hidden');

        const routeFlights = flights.filter(f => f.routeId === routeId);
        const totalPassengers = routeFlights.reduce((sum, f) => sum + f.passengers, 0);
        const totalFlights = routeFlights.length;
        const totalDelay = routeFlights.reduce((sum, f) => sum + f.delay, 0);
        
        const operatingAirlines = [...new Set(routeFlights.map(f => getAirlineName(f.airlineId)))].join(', ');

        document.getElementById('route-detail-name').textContent = route.name;
        document.getElementById('route-detail-distance').textContent = formatNumber(route.distance);
        document.getElementById('route-detail-type').textContent = route.type;
        document.getElementById('route-detail-airlines').textContent = operatingAirlines || 'N/A';
        document.getElementById('route-detail-avg-passengers').textContent = formatNumber(totalFlights > 0 ? (totalPassengers / totalFlights).toFixed(1) : 0);
        document.getElementById('route-detail-avg-delay').textContent = formatNumber(totalFlights > 0 ? (totalDelay / totalFlights).toFixed(1) : 0);
    }

    // Actualiza la tabla de composición de flota por aerolínea
    function updateFleetTable() {
        const fleetData = {};
        airlines.forEach(a => {
            fleetData[a.id] = { name: a.name, totalAircraft: 0, aircraftTypes: {} };
        });

        flights.forEach(f => {
            if (!fleetData[f.airlineId]) return;
            fleetData[f.airlineId].totalAircraft++;
            if (!fleetData[f.airlineId].aircraftTypes[f.aircraftType]) {
                fleetData[f.airlineId].aircraftTypes[f.aircraftType] = 0;
            }
            fleetData[f.airlineId].aircraftTypes[f.aircraftType]++;
        });

        const tableBody = document.getElementById('fleet-table-body');
        tableBody.innerHTML = '';

        Object.values(fleetData).sort((a,b) => b.totalAircraft - a.totalAircraft).forEach(data => {
            const commonTypes = Object.keys(data.aircraftTypes).sort((a,b) => data.aircraftTypes[b] - data.aircraftTypes[a]).slice(0, 2).join(', ');
            const row = `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${data.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatNumber(data.totalAircraft)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${commonTypes || 'N/A'}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    // Renderiza el gráfico de distribución de aeronaves por tipo
    function renderAircraftTypeChart() {
        const ctx = document.getElementById('aircraftTypeChart').getContext('2d');
        // Determine unique aircraft types from flights data
        const aircraftTypes = [...new Set(flights.map(f => f.aircraftType))];
        const aircraftTypeCounts = {};
        aircraftTypes.forEach(type => aircraftTypeCounts[type] = 0);
        flights.forEach(f => {
            if (aircraftTypeCounts.hasOwnProperty(f.aircraftType)) {
                aircraftTypeCounts[f.aircraftType]++;
            } else {
                aircraftTypeCounts['Otros'] = (aircraftTypeCounts['Otros'] || 0) + 1;
            }
        });

        const sortedTypes = Object.keys(aircraftTypeCounts).sort((a,b) => aircraftTypeCounts[b] - aircraftTypeCounts[a]);

        const data = {
            labels: sortedTypes.map(wrapLabels),
            datasets: [{
                label: 'Número de Aeronaves',
                data: sortedTypes.map(type => aircraftTypeCounts[type]),
                backgroundColor: ['#60A5FA', '#34D399', '#FCD34D', '#EF4444', '#A78BFA', '#F472B6', '#8B5CF6', '#EC4899']
            }]
        };

        if (chartInstances.aircraftType) chartInstances.aircraftType.destroy();
        chartInstances.aircraftType = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right' },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += formatNumber(context.parsed) + ' (' + (context.dataset.data[context.dataIndex] / flights.length * 100).toFixed(1) + '%)';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // Renderiza el gráfico de tráfico de pasajeros por aeropuerto
    function renderAirportTrafficChart() {
         const ctx = document.getElementById('airportTrafficChart').getContext('2d');
         
         // Reinicializa passengerByAirport para asegurar datos frescos
         passengerByAirport = {}; 
         airports.forEach(a => passengerByAirport[a.id] = { total: 0, origin: 0, dest: 0 });
         
         flights.forEach(f => {
            passengerByAirport[f.originId].total += f.passengers;
            passengerByAirport[f.originId].origin += f.passengers;
            passengerByAirport[f.destId].total += f.passengers;
            passengerByAirport[f.destId].dest += f.passengers;
         });
         
         const sortedAirports = airports.slice().sort((a,b) => passengerByAirport[b.id].total - passengerByAirport[a.id].total);

         const data = {
            labels: sortedAirports.map(a => wrapLabels(`${a.iata} (${a.city})`)),
            datasets: [{
                label: 'Pasajeros Totales (Origen + Destino)',
                data: sortedAirports.map(a => passengerByAirport[a.id].total),
                backgroundColor: '#FBBF24'
            }]
        };

        if (chartInstances.airportTraffic) chartInstances.airportTraffic.destroy();
        chartInstances.airportTraffic = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.x !== null) {
                                    label += formatNumber(context.parsed.x) + ' pasajeros';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: { x: { beginAtZero: true } }
            }
        });

        // Agrega un listener para mostrar detalles del aeropuerto al hacer clic
        ctx.canvas.onclick = (evt) => {
            const points = chartInstances.airportTraffic.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
            if (points.length) {
                const firstPoint = points[0];
                const labelIndex = firstPoint.index;
                const airportId = sortedAirports[labelIndex].id;
                appState.selectedAirportId = airportId;
                displayAirportDetails(airportId);
            }
        };
    }

    // Muestra los detalles de un aeropuerto específico en un panel
    function displayAirportDetails(airportId) {
        const airport = airports.find(a => a.id === airportId);
        if (!airport) return;

        const panel = document.getElementById('airport-detail-panel');
        panel.classList.remove('hidden');

        const airportTraffic = passengerByAirport[airportId];

        document.getElementById('airport-detail-name').textContent = airport.name;
        document.getElementById('airport-detail-iata').textContent = airport.iata;
        document.getElementById('airport-detail-city-state').textContent = `${airport.city}, ${airport.state}`;
        document.getElementById('airport-detail-type').textContent = airport.type;
        document.getElementById('airport-detail-total-origin-passengers').textContent = formatNumber(airportTraffic.origin);
        document.getElementById('airport-detail-total-dest-passengers').textContent = formatNumber(airportTraffic.dest);

        const topRoutesList = document.getElementById('airport-detail-top-routes');
        topRoutesList.innerHTML = '';

        const airportRoutes = flights.filter(f => f.originId === airportId || f.destId === airportId);
        const routePassengerCounts = {};
        airportRoutes.forEach(f => {
            const routeKey = f.originId === airportId ? `${f.originId}-${f.destId}` : `${f.destId}-${f.originId}`;
            if (!routePassengerCounts[routeKey]) {
                routePassengerCounts[routeKey] = { passengers: 0, routeName: getRouteName(f.routeId) };
            }
            routePassengerCounts[routeKey].passengers += f.passengers;
        });

        Object.values(routePassengerCounts).sort((a,b) => b.passengers - a.passengers).slice(0, 5).forEach(route => {
            const listItem = document.createElement('li');
            listItem.textContent = `${route.routeName}: ${formatNumber(route.passengers)} pasajeros`;
            topRoutesList.appendChild(listItem);
        });
    }

    // Inicia la aplicación al cargar el DOM
    initializeDashboard();
});
