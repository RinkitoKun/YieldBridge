// Deposit functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeDeposit();
    setupEventListeners();
});

function initializeDeposit() {
    updateCurrentBalance();
    updateActiveNavigation();
}

function setupEventListeners() {
    const depositForm = document.getElementById('depositForm');
    const depositAmount = document.getElementById('depositAmount');
    
    if (depositForm) {
        depositForm.addEventListener('submit', handleDeposit);
    }
    
    if (depositAmount) {
        depositAmount.addEventListener('input', updateFormValidation);
    }
}

async function updateCurrentBalance() {
    try {
        let balance = 0;
        if (xrplClient && xrplClient.isConnected) {
            balance = await xrplClient.getRLUSDBalance();
        } else {
            balance = getStoredBalance();
        }
        
        const balanceElement = document.getElementById('currentBalance');
        if (balanceElement) {
            balanceElement.textContent = balance.toFixed(2);
        }
        console.log('Current balance updated:', balance);
    } catch (error) {
        console.error('Failed to update current balance:', error);
    }
}

function setAmount(amount) {
    const amountInput = document.getElementById('depositAmount');
    if (amountInput) {
        amountInput.value = amount;
        updateFormValidation();
    }
}

function updateFormValidation() {
    const depositAmount = document.getElementById('depositAmount');
    const depositBtn = document.getElementById('depositBtn');
    
    if (depositAmount && depositBtn) {
        const amount = parseFloat(depositAmount.value);
        const isValid = amount >= 1;
        
        depositBtn.disabled = !isValid;
        depositBtn.className = isValid ? 'deposit-btn' : 'deposit-btn loading';
    }
}

async function handleDeposit(event) {
    event.preventDefault();
    
    const depositAmount = document.getElementById('depositAmount');
    const depositBtn = document.getElementById('depositBtn');
    
    if (!depositAmount || !depositBtn) return;
    
    const amount = parseFloat(depositAmount.value);
    
    if (amount < 1) {
        showToast('Minimum deposit amount is $1', 'error');
        return;
    }
    
    // Show loading state
    depositBtn.classList.add('loading');
    depositBtn.disabled = true;
    
    try {
        // Simulate deposit processing
        await simulateDeposit(amount);
        
        // Show success modal
        showSuccessModal();
        
        // Update balance display
        await updateCurrentBalance();
        
        // Reset form
        depositAmount.value = '';
        updateFormValidation();
        
    } catch (error) {
        console.error('Deposit failed:', error);
        showToast(error.message || 'Deposit failed', 'error');
    } finally {
        // Remove loading state
        depositBtn.classList.remove('loading');
        depositBtn.disabled = false;
    }
}

async function simulateDeposit(amount) {
    console.log('Simulating deposit of', amount);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
        if (xrplClient && xrplClient.depositRLUSD) {
            console.log('Using XRPL client for deposit');
            return await xrplClient.depositRLUSD(amount);
        } else {
            console.log('Using localStorage simulation for deposit');
            // Fallback for when XRPL client is not available
            const currentBalance = getStoredBalance();
            const newBalance = currentBalance + amount;
            localStorage.setItem('rlusd_balance', newBalance.toString());
            
            // Add to transaction history
            const history = JSON.parse(localStorage.getItem('transaction_history') || '[]');
            history.unshift({
                type: 'deposit',
                amount: amount,
                txHash: 'sim_' + Date.now(),
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('transaction_history', JSON.stringify(history.slice(0, 50)));
            
            // Start yield simulation
            if (window.xrplClient && window.xrplClient.startYieldSimulation) {
                window.xrplClient.startYieldSimulation();
            }
            
            console.log('Deposit simulation completed');
            return true;
        }
    } catch (error) {
        console.error('Deposit simulation failed:', error);
        throw error;
    }
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'block';
        
        // Add animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
    }
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('show');
        
        setTimeout(() => {
            modal.style.display = 'none';
            // Navigate back to dashboard
            window.location.href = 'dashboard.html';
        }, 300);
    }
}

function updateActiveNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === 'deposit.html') {
            item.classList.add('active');
        }
    });
}

function getStoredBalance() {
    return parseFloat(localStorage.getItem('rlusd_balance') || '0');
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('successModal');
    if (modal && event.target === modal) {
        closeModal();
    }
});
