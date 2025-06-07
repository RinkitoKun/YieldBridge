// Dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if wallet exists before initializing dashboard
    checkWalletAndInitialize();
    setupEventListeners();
});

async function checkWalletAndInitialize() {
    const storedWallet = localStorage.getItem('yieldbridge_wallet');
    
    if (!storedWallet) {
        console.log('No wallet found, redirecting to setup');
        window.location.href = 'wallet-setup.html';
        return;
    }
    
    try {
        // Show connecting status
        updateConnectionStatus(false, 'Connecting...');
        
        // Wait for XRPL client to be available
        let attempts = 0;
        const maxAttempts = 10;
        
        while (!window.xrplClient && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }
        
        if (window.xrplClient) {
            console.log('XRPL client found, checking connection...');
            
            // Wait for connection
            let connectionAttempts = 0;
            while (!window.xrplClient.isConnected && connectionAttempts < 20) {
                await new Promise(resolve => setTimeout(resolve, 500));
                connectionAttempts++;
            }
            
            if (window.xrplClient.isConnected && window.xrplClient.wallet) {
                console.log('XRPL client connected with wallet');
                updateConnectionStatus(true);
            } else {
                console.log('XRPL client not fully connected, using simulation mode');
                updateConnectionStatus(false, 'Simulation Mode');
            }
        } else {
            console.log('XRPL client not available, using simulation mode');
            updateConnectionStatus(false, 'Simulation Mode');
        }
        
        // Initialize dashboard regardless
        await initializeDashboard();
        
    } catch (error) {
        console.error('Error during dashboard initialization:', error);
        updateConnectionStatus(false, 'Connection Error');
        await initializeDashboard(); // Still show dashboard in simulation mode
    }
}

function updateConnectionStatus(connected, message = '') {
    const statusElement = document.getElementById('connectionStatus');
    const addressElement = document.getElementById('walletAddress');
    
    if (statusElement) {
        statusElement.className = connected ? 'fas fa-circle connected' : 'fas fa-circle disconnected';
    }
    
    if (addressElement) {
        if (connected && window.xrplClient && window.xrplClient.wallet) {
            addressElement.textContent = formatAddress(window.xrplClient.wallet.address);
        } else if (message) {
            addressElement.textContent = message;
        } else {
            // Show wallet address from localStorage even in simulation mode
            const storedWallet = localStorage.getItem('yieldbridge_wallet');
            if (storedWallet) {
                try {
                    const walletData = JSON.parse(storedWallet);
                    addressElement.textContent = formatAddress(walletData.address);
                } catch (error) {
                    addressElement.textContent = connected ? 'Connected' : 'Disconnected';
                }
            } else {
                addressElement.textContent = connected ? 'Connected' : 'Disconnected';
            }
        }
    }
}

async function initializeDashboard() {
    await updateDashboardData();
    updateActiveNavigation();
    startPeriodicUpdates();
}

function setupEventListeners() {
    // Listen for yield updates
    window.addEventListener('yieldUpdated', function(event) {
        updateYieldStats(event.detail);
    });
    
    // Refresh button
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshBalance);
    }
}

async function updateDashboardData() {
    try {
        console.log('Updating dashboard data...');
        
        // Update RLUSD balance
        let balance = 0;
        if (window.xrplClient && window.xrplClient.isConnected) {
            try {
                balance = await window.xrplClient.getRLUSDBalance();
            } catch (error) {
                console.error('Failed to get balance from XRPL client:', error);
                balance = getStoredBalance();
            }
        } else {
            balance = getStoredBalance();
        }
        
        console.log('Current balance:', balance);
        updateBalance(balance);
        
        // Update yield and donation stats
        const yieldEarned = parseFloat(localStorage.getItem('total_yield') || '0');
        const totalDonated = parseFloat(localStorage.getItem('total_donated') || '0');
        
        console.log('Yield earned:', yieldEarned, 'Total donated:', totalDonated);
        
        updateElement('yieldEarned', yieldEarned.toFixed(2));
        updateElement('totalDonated', totalDonated.toFixed(2));
        
        // Update circle status
        updateCircleStatus();
        
        console.log('Dashboard data updated successfully');
        
        // Start yield simulation if we have a balance and it's not already running
        if (balance > 0 && !localStorage.getItem('yield_interval_active')) {
            startYieldSimulation();
        }
        
    } catch (error) {
        console.error('Failed to update dashboard:', error);
        showError('Failed to load dashboard data');
    }
}

function updateBalance(balance) {
    const balanceElement = document.getElementById('rlusdBalance');
    if (balanceElement) {
        // Animate balance change
        animateNumber(balanceElement, parseFloat(balanceElement.textContent) || 0, balance, 1000);
    }
}

function updateYieldStats(data) {
    if (data.yield !== undefined) {
        updateElement('yieldEarned', data.yield.toFixed(2));
    }
    if (data.donated !== undefined) {
        updateElement('totalDonated', data.donated.toFixed(2));
    }
}

function updateCircleStatus() {
    const circleData = JSON.parse(localStorage.getItem('user_circle') || 'null');
    const statusElement = document.getElementById('circleStatus');
    
    if (statusElement) {
        if (circleData) {
            statusElement.textContent = `${circleData.name} - Active`;
            statusElement.className = 'stat-value circle-active';
        } else {
            statusElement.textContent = 'Not Joined';
            statusElement.className = 'stat-value';
        }
    }
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = start + (end - start) * easeOutQuart(progress);
        element.textContent = currentValue.toFixed(2);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

async function refreshBalance() {
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.classList.add('loading');
        refreshBtn.style.transform = 'rotate(360deg)';
        refreshBtn.style.transition = 'transform 0.5s ease';
    }
    
    try {
        console.log('Refreshing balance...');
        await updateDashboardData();
        if (typeof showToast === 'function') {
            showToast('Balance updated successfully', 'success');
        }
    } catch (error) {
        console.error('Refresh failed:', error);
        if (typeof showToast === 'function') {
            showToast('Failed to refresh balance', 'error');
        }
    } finally {
        if (refreshBtn) {
            setTimeout(() => {
                refreshBtn.classList.remove('loading');
                refreshBtn.style.transform = 'rotate(0deg)';
            }, 500);
        }
    }
}

function updateActiveNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === 'dashboard.html') {
            item.classList.add('active');
        }
    });
}

function startPeriodicUpdates() {
    // Update dashboard every 30 seconds
    setInterval(updateDashboardData, 30000);
}

function getStoredBalance() {
    return parseFloat(localStorage.getItem('rlusd_balance') || '0');
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    
    const container = document.querySelector('.dashboard-main .container');
    if (container) {
        container.insertBefore(errorDiv, container.firstChild);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
}

function startYieldSimulation() {
    // Check if yield simulation is already running
    const existingInterval = localStorage.getItem('yield_interval_active');
    if (existingInterval === 'true') {
        return;
    }
    
    localStorage.setItem('yield_interval_active', 'true');
    console.log('Starting yield simulation...');
    
    // Simulate yield earning every 30 seconds for demo
    const yieldInterval = setInterval(() => {
        const balance = parseFloat(localStorage.getItem('rlusd_balance') || '0');
        if (balance > 0) {
            const annualYieldRate = 0.05; // 5% annual yield
            const thirtySecondYield = balance * (annualYieldRate / 1051200); // 1051200 thirty-second periods in a year
            
            const currentYield = parseFloat(localStorage.getItem('total_yield') || '0');
            const newYield = currentYield + thirtySecondYield;
            localStorage.setItem('total_yield', newYield.toString());
            
            // Calculate and store donation
            const donationPercentage = parseFloat(localStorage.getItem('donation_percentage') || '20') / 100;
            const donation = thirtySecondYield * donationPercentage;
            const currentDonated = parseFloat(localStorage.getItem('total_donated') || '0');
            localStorage.setItem('total_donated', (currentDonated + donation).toString());
            
            // Update dashboard display
            updateElement('yieldEarned', newYield.toFixed(2));
            updateElement('totalDonated', (currentDonated + donation).toFixed(2));
            
            // Emit event for other pages
            window.dispatchEvent(new CustomEvent('yieldUpdated', {
                detail: { yield: newYield, donated: currentDonated + donation }
            }));
            
            console.log('Yield updated:', { yield: newYield, donated: currentDonated + donation });
        }
    }, 30000); // Every 30 seconds
    
    // Store interval ID for cleanup
    window.yieldInterval = yieldInterval;
}

// Clean up on page unload
window.addEventListener('beforeunload', function() {
    if (window.yieldInterval) {
        clearInterval(window.yieldInterval);
        localStorage.setItem('yield_interval_active', 'false');
    }
});
