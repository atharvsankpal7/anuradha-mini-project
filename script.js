// Initialize default admin credentials in localStorage if not exists
if (!localStorage.getItem('adminCredentials')) {
    localStorage.setItem('adminCredentials', JSON.stringify({
        username: 'admin',
        password: 'admin123'
    }));
}

// Initialize parameters history with demo data if not exists
if (!localStorage.getItem('parametersHistory')) {
    const demoData = [];
    const today = new Date();
    
    // Generate 7 days of realistic demo data
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        demoData.push({
            date: date.toISOString().split('T')[0],
            influent: {
                ph: (Math.random() * (8.5 - 6.5) + 6.5).toFixed(1),      // pH range: 6.5-8.5
                bod: Math.floor(Math.random() * (350 - 250) + 250),      // BOD range: 250-350 mg/L
                cod: Math.floor(Math.random() * (700 - 500) + 500),      // COD range: 500-700 mg/L
                tss: Math.floor(Math.random() * (200 - 100) + 100),      // TSS range: 100-200 mg/L
                turbidity: Math.floor(Math.random() * (120 - 80) + 80)   // Turbidity range: 80-120 NTU
            },
            effluent: {
                ph: (Math.random() * (8.0 - 7.0) + 7.0).toFixed(1),      // pH range: 7.0-8.0
                bod: Math.floor(Math.random() * (30 - 10) + 10),         // BOD range: 10-30 mg/L
                cod: Math.floor(Math.random() * (100 - 50) + 50),        // COD range: 50-100 mg/L
                tss: Math.floor(Math.random() * (30 - 5) + 5),           // TSS range: 5-30 mg/L
                turbidity: Math.floor(Math.random() * (30 - 10) + 10)    // Turbidity range: 10-30 NTU
            }
        });
    }
    
    localStorage.setItem('parametersHistory', JSON.stringify(demoData));
}

// Bootstrap Modal instances
let loginModal;
let adminModal;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap modals
    loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    adminModal = new bootstrap.Modal(document.getElementById('adminModal'));
    
    // Initialize event listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('parameterForm').addEventListener('submit', handleParameterUpdate);
    document.getElementById('passwordForm').addEventListener('submit', handlePasswordChange);
    
    // Load and display initial data
    loadHistoricalData();
    updateGraph();
});

function showLoginModal() {
    loginModal.show();
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const credentials = JSON.parse(localStorage.getItem('adminCredentials'));
    
    if (username === credentials.username && password === credentials.password) {
        loginModal.hide();
        adminModal.show();
        document.getElementById('loginForm').reset();
    } else {
        alert('Invalid credentials');
    }
}

function handleParameterUpdate(e) {
    e.preventDefault();
    
    const newParameters = {
        date: new Date().toISOString().split('T')[0],
        influent: {
            ph: document.getElementById('ph-influent').value,
            bod: document.getElementById('bod-influent').value,
            cod: document.getElementById('cod-influent').value,
            tss: document.getElementById('tss-influent').value,
            turbidity: document.getElementById('turbidity-influent').value
        },
        effluent: {
            ph: document.getElementById('ph-effluent').value,
            bod: document.getElementById('bod-effluent').value,
            cod: document.getElementById('cod-effluent').value,
            tss: document.getElementById('tss-effluent').value,
            turbidity: document.getElementById('turbidity-effluent').value
        }
    };
    
    // Update current parameters display
    updateCurrentParameters(newParameters);
    
    // Add to history
    const history = JSON.parse(localStorage.getItem('parametersHistory'));
    history.unshift(newParameters);
    
    // Keep only last 7 days
    while (history.length > 7) {
        history.pop();
    }
    
    localStorage.setItem('parametersHistory', JSON.stringify(history));
    
    // Refresh displays
    loadHistoricalData();
    updateGraph();
    
    adminModal.hide();
    document.getElementById('parameterForm').reset();
}

function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const credentials = JSON.parse(localStorage.getItem('adminCredentials'));
    
    if (currentPassword !== credentials.password) {
        alert('Current password is incorrect');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
    }
    
    credentials.password = newPassword;
    localStorage.setItem('adminCredentials', JSON.stringify(credentials));
    
    alert('Password updated successfully');
    adminModal.hide();
    document.getElementById('passwordForm').reset();
}

function updateCurrentParameters(parameters) {
    document.getElementById('ph-before').textContent = parameters.influent.ph;
    document.getElementById('bod-before').textContent = parameters.influent.bod;
    document.getElementById('cod-before').textContent = parameters.influent.cod;
    document.getElementById('tss-before').textContent = parameters.influent.tss;
    document.getElementById('turbidity-before').textContent = parameters.influent.turbidity;
    
    document.getElementById('ph-after').textContent = parameters.effluent.ph;
    document.getElementById('bod-after').textContent = parameters.effluent.bod;
    document.getElementById('cod-after').textContent = parameters.effluent.cod;
    document.getElementById('tss-after').textContent = parameters.effluent.tss;
    document.getElementById('turbidity-after').textContent = parameters.effluent.turbidity;
}

function loadHistoricalData() {
    const history = JSON.parse(localStorage.getItem('parametersHistory'));
    const tbody = document.querySelector('#past-data-table tbody');
    tbody.innerHTML = '';
    
    history.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.effluent.ph}</td>
            <td>${record.effluent.bod}</td>
            <td>${record.effluent.cod}</td>
            <td>${record.effluent.tss}</td>
            <td>${record.effluent.turbidity}</td>
        `;
        tbody.appendChild(row);
    });
    
    // Update current parameters with the most recent data
    if (history.length > 0) {
        updateCurrentParameters(history[0]);
    }
}

function updateGraph() {
    const history = JSON.parse(localStorage.getItem('parametersHistory'));
    const ctx = document.getElementById('wastewaterChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.wastewaterChart instanceof Chart) {
        window.wastewaterChart.destroy();
    }
    
    const labels = history.map(record => record.date).reverse();
    const datasets = [
        {
            label: 'pH (Influent)',
            data: history.map(record => record.influent.ph).reverse(),
            borderColor: 'rgba(255, 99, 132, 1)',
            fill: false
        },
        {
            label: 'pH (Effluent)',
            data: history.map(record => record.effluent.ph).reverse(),
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: false
        },
        {
            label: 'BOD (Influent)',
            data: history.map(record => record.influent.bod).reverse(),
            borderColor: 'rgba(255, 206, 86, 1)',
            fill: false
        },
        {
            label: 'BOD (Effluent)',
            data: history.map(record => record.effluent.bod).reverse(),
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false
        }
    ];
    
    window.wastewaterChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
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