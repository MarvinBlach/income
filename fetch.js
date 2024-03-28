// Set global options for Chart.js
Chart.defaults.color = 'white';

// Initialize the chart with empty data
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: '',
            data: [],
            fill: true,
            borderColor: 'white',
            backgroundColor: createWhiteGradient(ctx),
            tension: 0.1,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'white'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 30 } },
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    title: function(tooltipItems, data) {
                        return tooltipItems[0].label;
                    },
                    label: function(tooltipItem, data) {
                        document.getElementById('today-price').textContent = `${tooltipItem.formattedValue}€`;
                        return null;
                    }
                }
            }
        },
        scales: {
            y: { beginAtZero: true, ticks: { display: false }, grid: { display: false } },
            x: { ticks: { display: false }, grid: { display: false } }
        },
        interaction: { mode: 'nearest', axis: 'x', intersect: false }
    }
});

// Function to create a white gradient
function createWhiteGradient(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.clientHeight);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    return gradient;
}

function updateChart(chart, labels, data) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
    updateIndicatorAndPerformance(data);
}

    function getDateRangeForPeriod(period) {
        const today = new Date();
        const launchDate = new Date(2023, 5, 31); // 31.05.2023
        let dateFrom, dateTo;

        switch (period) {
            case 'month':
                dateFrom = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                dateTo = today;
                break;
            case 'year':
                dateFrom = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
                dateTo = today;
                break;
            case 'alltime':
                dateFrom = launchDate;
                dateTo = today;
                break;
        }

        // Ensure dateFrom is not earlier than 31.05.2023
        if (dateFrom < launchDate) {
            dateFrom = launchDate;
        }

        // Convert dates to ISO strings
        dateFrom = dateFrom.toISOString().split('T')[0];
        dateTo = dateTo.toISOString().split('T')[0];

        // Update date1, date2, and datum elements
        document.getElementById('date1').textContent = formatDate(dateFrom);
        document.getElementById('date2').textContent = formatDate(dateTo);
        document.getElementById('datum').textContent = `Zeitraum: ${formatDate(dateFrom)} bis ${formatDate(dateTo)}`;

        return { dateFrom, dateTo };
    }

function formatDate(dateStr) {
    if (!dateStr) return 'Anfang';
    const [year, month, day] = dateStr.split('-');
    return `${day}.${month}.${year}`;
}

function fetchDataAndUpdateChart(period) {
    const { dateFrom, dateTo } = getDateRangeForPeriod(period);
    let apiUrl = `https://api.extraetf.com/customer-api/ic/chart/?isin=AT0000A347S9&data_type=nav`;
    if (dateFrom && dateTo) {
        apiUrl += `&date_from=${dateFrom}&date_to=${dateTo}`;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(apiData => {
            const labels = apiData.results.nav.map(entry => formatDate(entry.date));
            const data = apiData.results.nav.map(entry => entry.value);

            const minValue = Math.min(...data);
            const maxValue = Math.max(...data);
            const padding = (maxValue - minValue) * 0.2;
            myChart.options.scales.y.min = minValue - padding;
            myChart.options.scales.y.max = maxValue + padding;

            updateChart(myChart, labels, data);
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

document.getElementById('month').addEventListener('click', () => handleButtonClick('month'));
document.getElementById('year').addEventListener('click', () => handleButtonClick('year'));
document.getElementById('alltime').addEventListener('click', () => handleButtonClick('alltime'));

function handleButtonClick(period) {
    fetchDataAndUpdateChart(period);
    ['month', 'year', 'alltime'].forEach(id => {
        const element = document.getElementById(id);
        if (id === period) {
            element.classList.add('is-active');
        } else {
            element.classList.remove('is-active');
        }
    });
}

function updateIndicatorAndPerformance(data) {
    const todayPriceElement = document.getElementById('today-price');
    const performanceElement = document.getElementById('performance');

    const todayPrice = data[data.length - 1];
    const firstPrice = data[0];
    const performance = ((todayPrice - firstPrice) / firstPrice) * 100;

    todayPriceElement.textContent = `${todayPrice.toFixed(2)}€`;
    performanceElement.textContent = `${performance.toFixed(2)}%`;

    updateIndicatorClass(performance);
}

function updateIndicatorClass(performance) {
    const indicatorElement = document.getElementById('indicator');
    indicatorElement.classList.remove('is-neutral', 'is-negative');
    if (Math.abs(performance) < 2) {
        indicatorElement.classList.add('is-neutral');
    } else if (performance < 0) {
        indicatorElement.classList.add('is-negative');
    }
}

// On window load
window.onload = function() {
    handleButtonClick('month');
};

function calculateAndDisplayMinMaxValues(data) {
    const baseValue = 100;
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const maxPercentage = ((maxValue - baseValue) / baseValue) * 100;
    const minPercentage = ((minValue - baseValue) / baseValue) * 100;

    document.getElementById('max').textContent = `${maxPercentage.toFixed(2)}%`;
    document.getElementById('min').textContent = `${minPercentage.toFixed(2)}%`;
}

function updateChart(chart, labels, data) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();

    updateIndicatorAndPerformance(data);
    calculateAndDisplayMinMaxValues(data);
}

document.getElementById('month').addEventListener('click', () => handleButtonClick('month'));
document.getElementById('year').addEventListener('click', () => handleButtonClick('year'));
document.getElementById('alltime').addEventListener('click', () => handleButtonClick('alltime'));


document.addEventListener('DOMContentLoaded', function() {
    // Single API call to fetch data
    fetch('https://api.extraetf.com/customer-api/ic/detail/?isin=AT0000A347S9')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(apiData => {
            if (apiData.results && apiData.results[0]) {
                const data = apiData.results[0];
                // Use fund holdings to update the page
                if (data.fund_portfolio_holdings) {
                    const fundHoldings = data.fund_portfolio_holdings;
                    const container = document.querySelector('.positions_content-grid');
                    container.innerHTML = ''; // Clear existing content

                    fundHoldings.forEach(holding => {
                        // Create elements for each holding
                        const holdingDiv = document.createElement('div');
                        holdingDiv.className = 'text-size-regular pos_name';
                        holdingDiv.textContent = holding.name;

                        const percentageWrapper = document.createElement('div');
                        percentageWrapper.className = 'percentage_wrapper';

                        const indicatorComponent = document.createElement('div');
                        indicatorComponent.className = 'indicator_component is-rounded-15';

                        const indicatorLine = document.createElement('div');
                        indicatorLine.className = 'indicator_line pos_line';
                        indicatorLine.style.width = `${holding.weight * 10}%`;


                        const indicatorBg = document.createElement('div');
                        indicatorBg.className = 'indicator_bg';

                        const percentageText = document.createElement('div');
                        percentageText.className = 'text-size-small pos_percentage';
                        percentageText.textContent = `${holding.weight.toFixed(2)}%`;

                        const countryDiv = document.createElement('div');
                        countryDiv.className = 'text-size-regular pos_country';
                        countryDiv.textContent = holding.country_code || 'N/A';

                        const assetDiv = document.createElement('div');
                        assetDiv.className = 'text-size-regular pos_asset';
                        assetDiv.textContent = holding.type_name_full || 'N/A';

                        // Append elements
                        indicatorComponent.appendChild(indicatorLine);
                        indicatorComponent.appendChild(indicatorBg);
                        percentageWrapper.appendChild(indicatorComponent);
                        percentageWrapper.appendChild(percentageText);

                        container.appendChild(holdingDiv);
                        container.appendChild(percentageWrapper);
                        container.appendChild(countryDiv);
                        container.appendChild(assetDiv);
                    });
                } else {
                    console.error('Data does not contain fund portfolio holdings.');
                }
                
                // These functions should be defined to handle the respective parts of the page.
                updateAllTimePerformance();
                updateDate();
                handleButtonClick('month');
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
});


function updateDate() {
    // Find the element with the attribute 'stand-1'
    const element = document.querySelector('[stand-1]');

    if (element) {
        // Get the current date
        let date = new Date();

        // Subtract one day
        date.setDate(date.getDate() - 1);

        // Format the date in 'dd.mm.yyyy' format
        let formattedDate = ('0' + date.getDate()).slice(-2) + '.' +
                            ('0' + (date.getMonth() + 1)).slice(-2) + '.' +
                            date.getFullYear();

        // Set the text content of the element to the formatted date
        element.textContent = formattedDate;
    } else {
        console.error('No element with attribute "stand-1" found.');
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    updateDate();
    updateAllTimePerformance();
});

function updateAllTimePerformance() {
    // Define the API URL
    const apiUrl = 'https://api.extraetf.com/customer-api/ic/chart/?isin=AT0000A347S9&data_type=nav&date_from=2022-05-31'; // Assuming '2019-11-13' is the inception date of the fund

    // Fetch the data
    fetch(apiUrl)
        .then(response => response.json())
        .then(apiData => {
            if (apiData.results && apiData.results.nav.length > 0) {
                // Extract the NAV (Net Asset Value) data
                const navData = apiData.results.nav;
                // Calculate performance from the first available data point to the last
                const firstPrice = navData[0].value;
                const lastPrice = navData[navData.length - 1].value;
                let performance = ((lastPrice - firstPrice) / firstPrice) * 100;

                // Determine the sign of the performance
                const sign = performance > 0 ? '+' : '';
                // Format the performance with the sign and replace the dot with a comma
                const formattedPerformance = sign + performance.toFixed(2).replace('.', ',') + '%';

                // Update all elements with the 'hs-full' attribute
                const hsFullElements = document.querySelectorAll('[hs-full]');
                hsFullElements.forEach(element => {
                    element.textContent = formattedPerformance;
                });
            } else {
                console.error('Data does not contain NAV results.');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}


