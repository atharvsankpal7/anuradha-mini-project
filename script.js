let loggedIn = false;

// Function to show login section
function showLoginSection() {
    document.getElementById('login-section').style.display = 'block';
}

// Function to perform login
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === 'admin' && password === 'password') {
        loggedIn = true;
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('update-section').style.display = 'block';
    } else {
        alert('Invalid credentials');
    }
}

// Function to update values
function updateValues() {
    if (loggedIn) {
        const date = new Date().toLocaleDateString();  // Current date in YYYY-MM-DD format

        // Check if the row for the current date already exists
        const rows = document.querySelectorAll("#past-data-table tbody tr");
        let rowToUpdate = null;
        rows.forEach(row => {
            const rowDate = row.cells[0].innerText;
            if (rowDate === date) {
                rowToUpdate = row;
            }
        });

        const phBefore = document.getElementById('editable-ph-before').innerText;
        const phAfter = document.getElementById('editable-ph-after').innerText;
        const bodBefore = document.getElementById('editable-bod-before').innerText;
        const bodAfter = document.getElementById('editable-bod-after').innerText;
        const codBefore = document.getElementById('editable-cod-before').innerText;
        const codAfter = document.getElementById('editable-cod-after').innerText;
        const tssBefore = document.getElementById('editable-tss-before').innerText;
        const tssAfter = document.getElementById('editable-tss-after').innerText;
        const nitrogenBefore = document.getElementById('editable-nitrogen-before').innerText;
        const nitrogenAfter = document.getElementById('editable-nitrogen-after').innerText;
        const phosphorusBefore = document.getElementById('editable-phosphorus-before').innerText;
        const phosphorusAfter = document.getElementById('editable-phosphorus-after').innerText;

        if (rowToUpdate) {
            // Update the existing row for the current date
            rowToUpdate.cells[1].innerText = phBefore;
            rowToUpdate.cells[2].innerText = bodBefore;
            rowToUpdate.cells[3].innerText = codBefore;
            rowToUpdate.cells[4].innerText = tssBefore;
            rowToUpdate.cells[5].innerText = nitrogenBefore;
            rowToUpdate.cells[6].innerText = phosphorusBefore;
        } else {
            // Add new row if it doesn't exist
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${date}</td>
                <td>${phBefore}</td>
                <td>${bodBefore}</td>
                <td>${codBefore}</td>
                <td>${tssBefore}</td>
                <td>${nitrogenBefore}</td>
                <td>${phosphorusBefore}</td>
            `;
            document.querySelector('#past-data-table tbody').prepend(newRow);
        }

        // Update Parameters Table with new values
        document.getElementById('ph-before').innerText = phBefore;
        document.getElementById('ph-after').innerText = phAfter;
        document.getElementById('bod-before').innerText = bodBefore;
        document.getElementById('bod-after').innerText = bodAfter;
        document.getElementById('cod-before').innerText = codBefore;
        document.getElementById('cod-after').innerText = codAfter;
        document.getElementById('tss-before').innerText = tssBefore;
        document.getElementById('tss-after').innerText = tssAfter;
        document.getElementById('nitrogen-before').innerText = nitrogenBefore;
        document.getElementById('nitrogen-after').innerText = nitrogenAfter;
        document.getElementById('phosphorus-before').innerText = phosphorusBefore;
        document.getElementById('phosphorus-after').innerText = phosphorusAfter;

        // Update the graph with new data
        updateGraph();
    }
}

// Function to update graph with new values
function updateGraph() {
    const ctx = document.getElementById('wastewaterChart').getContext('2d');
    const wastewaterChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['pH', 'BOD (mg/L)', 'COD (mg/L)', 'TSS (mg/L)', 'Nitrogen (mg/L)', 'Phosphorus (mg/L)'],
            datasets: [{
                label: 'Before Treatment',
                data: [
                    parseFloat(document.getElementById('editable-ph-before').innerText),
                    parseFloat(document.getElementById('editable-bod-before').innerText),
                    parseFloat(document.getElementById('editable-cod-before').innerText),
                    parseFloat(document.getElementById('editable-tss-before').innerText),
                    parseFloat(document.getElementById('editable-nitrogen-before').innerText),
                    parseFloat(document.getElementById('editable-phosphorus-before').innerText),
                ],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'After Treatment',
                data: [
                    parseFloat(document.getElementById('editable-ph-after').innerText),
                    parseFloat(document.getElementById('editable-bod-after').innerText),
                    parseFloat(document.getElementById('editable-cod-after').innerText),
                    parseFloat(document.getElementById('editable-tss-after').innerText),
                    parseFloat(document.getElementById('editable-nitrogen-after').innerText),
                    parseFloat(document.getElementById('editable-phosphorus-after').innerText),
                ],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize the graph with the current data
updateGraph();