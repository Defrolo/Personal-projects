document.addEventListener('DOMContentLoaded', () => {
    const userTableBody = document.getElementById('user-table-body');
    const cityChartCanvas = document.getElementById('city-chart');
    const ctx = cityChartCanvas.getContext('2d');

    // Fetch user data from JSONPlaceholder API
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(users => {
            populateUserTable(users);
            const cityCounts = countUsersByCity(users);
            drawCityChart(cityCounts);
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            userTableBody.innerHTML = `<tr><td colspan="5">Error loading data: ${error.message}</td></tr>`;
        });

    // Function to populate the user table
    function populateUserTable(users) {
        userTableBody.innerHTML = ''; // Clear previous data
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.address.city}</td>
            `;
            userTableBody.appendChild(row);
        });
    }

    // Function to count users per city
    function countUsersByCity(users) {
        const counts = {};
        users.forEach(user => {
            const city = user.address.city;
            counts[city] = (counts[city] || 0) + 1;
        });
        // Sort cities by count descending and take top 5
        return Object.entries(counts)
                     .sort(([, countA], [, countB]) => countB - countA)
                     .slice(0, 5);
    }

    // Function to draw the city distribution chart using Canvas
    function drawCityChart(cityCounts) {
        const labels = cityCounts.map(([city]) => city);
        const data = cityCounts.map(([, count]) => count);
        const chartHeight = cityChartCanvas.height - 40; // Leave space for labels
        const chartWidth = cityChartCanvas.width - 50; // Leave space for labels/axis
        const barWidth = chartWidth / (data.length * 1.5); // Adjust spacing
        const maxValue = Math.max(...data, 0);
        const scaleY = chartHeight / maxValue;

        ctx.clearRect(0, 0, cityChartCanvas.width, cityChartCanvas.height); // Clear canvas

        // Draw Y axis labels and lines
        ctx.fillStyle = '#666';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        for (let i = 0; i <= 5; i++) {
            const value = Math.round((maxValue / 5) * i);
            const yPos = chartHeight - (value * scaleY) + 20; // Offset by padding
            ctx.fillText(value, 40, yPos);
            // Draw horizontal grid line
            ctx.beginPath();
            ctx.moveTo(45, yPos);
            ctx.lineTo(chartWidth + 45, yPos);
            ctx.strokeStyle = '#eee';
            ctx.stroke();
        }

        // Draw bars and X axis labels
        ctx.textAlign = 'center';
        data.forEach((value, index) => {
            const barHeight = value * scaleY;
            const x = 50 + index * (barWidth * 1.5); // Start drawing after Y labels, add spacing
            const y = chartHeight - barHeight + 20; // Offset by padding

            // Draw bar
            ctx.fillStyle = `hsl(${index * 60}, 70%, 60%)`; // Vary colors
            ctx.fillRect(x, y, barWidth, barHeight);

            // Draw X label
            ctx.fillStyle = '#333';
            ctx.fillText(labels[index], x + barWidth / 2, chartHeight + 30); // Below bars
        });
    }
});
