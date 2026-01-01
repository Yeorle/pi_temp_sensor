document.addEventListener("DOMContentLoaded", () => {
    const tempCtx = document.getElementById('tempChart').getContext('2d');
    const humidityCtx = document.getElementById('humidityChart').getContext('2d');

    // Chart Configuration
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                grid: {
                    color: '#334155'
                },
                ticks: {
                    color: '#94a3b8'
                }
            },
            y: {
                grid: {
                    color: '#334155'
                },
                ticks: {
                    color: '#94a3b8'
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    };

    const tempChart = new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature (°C)',
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                data: []
            }]
        },
        options: {
            ...commonOptions,
            plugins: {
                title: {
                    display: true,
                    text: 'Temperature History (24h)',
                    color: '#f8fafc'
                }
            },
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    suggestedMin: 10,
                    suggestedMax: 30
                }
            }
        }
    });

    const humidityChart = new Chart(humidityCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Humidity (%)',
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                data: []
            }]
        },
        options: {
            ...commonOptions,
            plugins: {
                title: {
                    display: true,
                    text: 'Humidity History (24h)',
                    color: '#f8fafc'
                }
            },
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    min: 0,
                    max: 100
                }
            }
        }
    });

    async function fetchData() {
        try {
            const response = await fetch('/api/data');
            const data = await response.json();

            // Update Charts
            // To make the x-axis cleaner, we might want to format timestamp or pick every Nth label
            // For now, we just pass the timestamp string from DB.

            // Format timestamps to be shorter (HH:MM)
            const formattedLabels = data.timestamps.map(ts => {
                const date = new Date(ts);
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            });

            tempChart.data.labels = formattedLabels;
            tempChart.data.datasets[0].data = data.temperatures;
            tempChart.update();

            humidityChart.data.labels = formattedLabels;
            humidityChart.data.datasets[0].data = data.humidities;
            humidityChart.update();

            // Update Current Values (Latest reading)
            if (data.temperatures.length > 0) {
                const lastTemp = data.temperatures[data.temperatures.length - 1];
                const lastHum = data.humidities[data.humidities.length - 1];
                document.getElementById('current-temp').innerText = `${lastTemp.toFixed(1)}°C`;
                document.getElementById('current-humidity').innerText = `${lastHum.toFixed(1)}%`;
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Initial Fetch
    fetchData();

    // Poll every minute
    setInterval(fetchData, 60000);
});
