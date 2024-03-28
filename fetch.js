document.addEventListener('DOMContentLoaded', function() {
    fetch('https://api.extraetf.com/customer-api/ic/detail/?isin=AT0000A347S9')
        .then(response => response.json())
        .then(apiData => {
            if (apiData.results && apiData.results[0].fund_portfolio_global_bond_sector_breakdown && apiData.results[0].fund_portfolio_global_bond_sector_breakdown.super) {
                const bondSectorBreakdown = apiData.results[0].fund_portfolio_global_bond_sector_breakdown.super;

                const labels = bondSectorBreakdown.map(item => item.type_name);
                const chartData = bondSectorBreakdown.map(item => item.value);
                const backgroundColors = [
                    'rgba(25, 35, 108, 1)',
                    'rgba(25, 35, 108, 0.7)',
                    'rgba(25, 35, 108, 0.5)',
                    'rgba(25, 35, 108, 0.3)'
                ]; // Adjust the colors as needed

                const piechartHolder = document.querySelector('.piechart_holder');
                piechartHolder.innerHTML = ''; // Clear existing content

                bondSectorBreakdown.forEach((item, index) => {
                    const holderDiv = document.createElement('div');
                    holderDiv.className = 'piechart_percentage-holder';

                    const circleDiv = document.createElement('div');
                    circleDiv.className = 'circle pie_color';
                    circleDiv.style.backgroundColor = backgroundColors[index % backgroundColors.length];

                    const percentageDiv = document.createElement('div');
                    percentageDiv.className = 'text-size-medium pie_percentage';
                    percentageDiv.textContent = `${item.value.toFixed(2)}%`;

                    const nameDiv = document.createElement('div');
                    nameDiv.className = 'text-size-medium op_50 pie_name';
                    nameDiv.textContent = item.type_name;

                    holderDiv.appendChild(circleDiv);
                    holderDiv.appendChild(percentageDiv);
                    holderDiv.appendChild(nameDiv);

                    piechartHolder.appendChild(holderDiv);
                });

                const ctx = document.getElementById('myDonutChart').getContext('2d');
                new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: chartData,
                            backgroundColor: backgroundColors,
                            borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '50%',
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                });
            } else {
                console.error('Data does not contain the bond sector breakdown.');
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
});


document.addEventListener('DOMContentLoaded', (event) => {
    fetch('https://api.extraetf.com/customer-api/ic/detail/?isin=AT0000A347S9')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Check if 'results' and 'fund_portfolio_country_breakdown' exist
            if(data.results && data.results[0].fund_portfolio_country_breakdown) {
                const countryBreakdown = data.results[0].fund_portfolio_country_breakdown;
                // Get the bond and stock data from the JSON
                const bonds = countryBreakdown.bond;
                const stocks = countryBreakdown.stock;
                // Find the main container where the currencies will be displayed
                const mainContainer = document.querySelector('.positions_content-first');

                // Function to create, sort, and append currency elements to the main container
                const appendCurrencyElements = (currencies, type) => {
                    // Convert object entries to an array and sort by percentage
                    const sortedCurrencies = Object.entries(currencies)
                        .filter(([currencyCode, percentage]) => typeof percentage === 'number')
                        .sort((a, b) => b[1] - a[1]); // Sort from largest to smallest percentage

                    // Iterate over the sorted array
                    sortedCurrencies.forEach(([currencyCode, percentage]) => {
                        // Create the grid wrapper for each currency
                        const gridWrapper = document.createElement('div');
                        gridWrapper.className = 'positions_content-first-grid';

                        const currencyTagElement = document.createElement('div');
                        currencyTagElement.className = 'currency_tag';
                        currencyTagElement.textContent = currencyCode;

                        const currencyTextElement = document.createElement('div');
                        currencyTextElement.className = 'text-size-regular currency_text';
                        currencyTextElement.textContent = `${currencyCode} - ${type}`;

                        const percentageWrapper = document.createElement('div');
                        percentageWrapper.className = 'percentage_wrapper';

                        const indicatorComponentElement = document.createElement('div');
                        indicatorComponentElement.className = 'indicator_component is-rounded-15';

                        const currencyLineElement = document.createElement('div');
                        currencyLineElement.className = 'indicator_line currency_line';
                        currencyLineElement.style.width = `${percentage}%`;

                        const indicatorBgElement = document.createElement('div');
                        indicatorBgElement.className = 'indicator_bg';

                        const currencyPercentageElement = document.createElement('div');
                        currencyPercentageElement.className = 'text-size-small currency_percentage';
                        currencyPercentageElement.textContent = `${percentage.toFixed(2)}%`;

                        // Append the line and background to the indicator component
                        indicatorComponentElement.appendChild(currencyLineElement);
                        indicatorComponentElement.appendChild(indicatorBgElement);

                        // Append the indicator component and percentage to the percentage wrapper
                        percentageWrapper.appendChild(indicatorComponentElement);
                        percentageWrapper.appendChild(currencyPercentageElement);

                        // Append the elements to the grid wrapper
                        gridWrapper.appendChild(currencyTagElement);
                        gridWrapper.appendChild(currencyTextElement);
                        gridWrapper.appendChild(percentageWrapper);

                        // Append the grid wrapper to the main container
                        mainContainer.appendChild(gridWrapper);
                    });
                };

                // Append bond currencies
                appendCurrencyElements(bonds, 'Bond');
                // Append stock currencies
                appendCurrencyElements(stocks, 'Stock');
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
});

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
        const launchDate = '2019-11-13';
        let dateFrom, dateTo;

        switch (period) {
            case 'month':
                dateFrom = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()).toISOString().split('T')[0];
                dateTo = today.toISOString().split('T')[0];
                break;
            case 'year':
                dateFrom = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 365).toISOString().split('T')[0];
                dateTo = today.toISOString().split('T')[0];
                break;
            case 'alltime':
                dateFrom = launchDate;
                dateTo = today.toISOString().split('T')[0];
                break;
        }

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
    fetch('https://api.extraetf.com/customer-api/ic/detail/?isin=AT0000A347S9')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(apiData => {
            // Check if the data contains the expected fund portfolio holdings
            if (apiData.results && apiData.results[0].fund_portfolio_holdings) {
                const fundHoldings = apiData.results[0].fund_portfolio_holdings;

                // Find the container where the fund holdings will be displayed
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
                    indicatorLine.style.width = `${holding.weight}%`;

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

        // Subtract one month

//TO DO:
    // - 1 day
    // statt durch 100 durch 10 teilen
        date.setMonth(date.getMonth());

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
});

function updateAllTimePerformance() {
    // Define the API URL
    const apiUrl = 'https://api.extraetf.com/customer-api/ic/chart/?isin=AT0000A347S9&data_type=nav&date_from=2019-11-13'; // Assuming '2019-11-13' is the inception date of the fund

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

document.addEventListener('DOMContentLoaded', (event) => {
    updateAllTimePerformance();
});
