document.addEventListener("DOMContentLoaded", () => {
    const tempCtx = document.getElementById('tempChart').getContext('2d');
    const humidityCtx = document.getElementById('humidityChart').getContext('2d');
    const rangeSelect = document.getElementById('time-range');

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
                type: 'time',
                time: {
                    unit: 'hour'
                },
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
                    text: 'Temperature History',
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
                    text: 'Humidity History',
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
        const hours = rangeSelect.value;
        try {
            const response = await fetch(`/api/data?hours=${hours}`);
            const data = await response.json();

            // Prepare data for Chart.js time scale (x: timestamp, y: value)
            const tempData = data.timestamps.map((ts, i) => ({
                x: ts,
                y: data.temperatures[i]
            }));

            const humidityData = data.timestamps.map((ts, i) => ({
                x: ts,
                y: data.humidities[i]
            }));

            // Adjust X-axis time unit based on range
            let timeUnit = 'hour';
            if (hours <= 6) timeUnit = 'minute';
            else if (hours <= 24) timeUnit = 'hour';
            else timeUnit = 'day';

            tempChart.options.scales.x.time.unit = timeUnit;
            humidityChart.options.scales.x.time.unit = timeUnit;

            tempChart.data.datasets[0].data = tempData;
            tempChart.update();

            humidityChart.data.datasets[0].data = humidityData;
            humidityChart.update();

            // Update Current Values (Latest reading)
            if (data.temperatures.length > 0) {
                // Determine latest reading (data is ordered oldest to newest in JS arrays)
                const lastTemp = data.temperatures[data.temperatures.length - 1];
                const lastHum = data.humidities[data.humidities.length - 1];
                document.getElementById('current-temp').innerText = `${lastTemp.toFixed(1)}°C`;
                document.getElementById('current-humidity').innerText = `${lastHum.toFixed(1)}%`;
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Event listener for range change
    rangeSelect.addEventListener('change', fetchData);

    // Initial Fetch
    fetchData();

    // Poll every minute
    setInterval(fetchData, 60000);
});
