// Configuration
const JSON_URL = 'https://jsonplaceholder.typicode.com/posts';
const AUTHORIZED_PASSWORDS = [
    eval(atob('YXRvYignYVdSck1ERXdNQT09Jyk='))
];
const block = [];
// Authentication functions
function handleLogin(event) {
    event.preventDefault();
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');

    if (AUTHORIZED_PASSWORDS.includes(password)) {
        document.getElementById('loginSection').classList.add('d-none');
        document.getElementById('appSection').classList.remove('d-none');
        loginError.classList.add('d-none');
        // Store login state
        sessionStorage.setItem('isLoggedIn', 'true');
    } else if (block.includes(password)) {loginError.textContent = 'YOU HAVE BEEN BLOCKED!';
                                         loginError.classList.remove('d-none');} else {
        loginError.textContent = 'Invalid password';
        loginError.classList.remove('d-none');
    }
    return false;
}

function logout() {
    document.getElementById('loginSection').classList.remove('d-none');
    document.getElementById('appSection').classList.add('d-none');
    document.getElementById('password').value = '';
    // Clear login state
    sessionStorage.removeItem('isLoggedIn');
}

// Check login state on page load
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        document.getElementById('loginSection').classList.add('d-none');
        document.getElementById('appSection').classList.remove('d-none');
    }
});

// Helper function to show/hide loading spinner
function toggleLoading(show) {
    document.getElementById('loadingSpinner').classList.toggle('d-none', !show);
}

// Helper function to show/hide error message
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    if (message) {
        errorElement.textContent = message;
        errorElement.classList.remove('d-none');
    } else {
        errorElement.classList.add('d-none');
    }
}

// Helper function to display results
function displayResults(data) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (Array.isArray(data)) {
        // Handle array of results
        data.forEach(item => {
            const div = document.createElement('div');
            div.className = 'card mb-3';
            div.innerHTML = `
                <div class="card-body">
                    <pre>${JSON.stringify(item, null, 2)}</pre>
                </div>
            `;
            resultsContainer.appendChild(div);
        });
    } else {
        // Handle single object
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <div class="card-body">
                <pre>${JSON.stringify(data, null, 2)}</pre>
            </div>
        `;
        resultsContainer.appendChild(div);
    }
}

// Function to filter data based on search key
function filterData(data, searchKey) {
    if (!searchKey) return data;

    if (Array.isArray(data)) {
        return data.filter(item => {
            return Object.keys(item).some(key => 
                String(item[key]).toLowerCase().includes(searchKey.toLowerCase())
            );
        });
    } else if (typeof data === 'object') {
        const results = {};
        Object.keys(data).forEach(key => {
            if (String(data[key]).toLowerCase().includes(searchKey.toLowerCase())) {
                results[key] = data[key];
            }
        });
        return Object.keys(results).length ? results : null;
    }
    return null;
}

// Main function to fetch and process data
async function fetchData() {
    const searchKey = document.getElementById('searchKey').value;

    // Clear previous results and errors
    showError(null);
    document.getElementById('results').innerHTML = '';
    toggleLoading(true);

    try {
        const response = await fetch(JSON_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const filteredData = data[searchKey];//filterData(data, searchKey);

        if (!filteredData || (Array.isArray(filteredData) && !filteredData.length)) {
            showError('No results found for the given search key');
        } else {
            displayResults(filteredData);
        }
    } catch (error) {
        showError(`Failed to fetch data: ${error.message}`);
    } finally {
        toggleLoading(false);
    }
}

// Add event listener for Enter key on inputs
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (input.id === 'password') {
                    document.getElementById('loginForm').dispatchEvent(new Event('submit'));
                } else {
                    fetchData();
                }
            }
        });
    });
});
