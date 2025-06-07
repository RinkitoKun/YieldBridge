// Wallet setup and connection functionality

class WalletManager {
    constructor() {
        this.client = null;
        this.wallet = null;
        this.isConnected = false;
        this.useTestnet = true;
        this.testnetServer = 'wss://s.altnet.rippletest.net:51233';
        this.mainnetServer = 'wss://xrplcluster.com';
    }

    async initialize() {
        try {
            const network = document.querySelector('input[name="network"]:checked').value;
            this.useTestnet = network === 'testnet';
            
            const server = this.useTestnet ? this.testnetServer : this.mainnetServer;
            console.log(`Connecting to ${network}:`, server);
            
            this.client = new xrpl.Client(server);
            await this.client.connect();
            this.isConnected = true;
            
            this.updateConnectionStatus(true, 'Connected');
            return true;
        } catch (error) {
            console.error('Failed to connect to XRPL:', error);
            this.updateConnectionStatus(false, 'Connection Failed');
            return false;
        }
    }

    async createNewWallet() {
        try {
            // Generate new wallet
            this.wallet = xrpl.Wallet.generate();
            console.log('Generated wallet:', this.wallet.address);

            if (this.useTestnet && this.isConnected) {
                // Fund testnet wallet
                const fundResult = await this.client.fundWallet(this.wallet);
                console.log('Wallet funded:', fundResult);
                
                // Wait for funding to complete
                await this.waitForAccountActivation();
            }

            // Save wallet to localStorage
            this.saveWalletToStorage();
            
            return this.wallet;
        } catch (error) {
            console.error('Failed to create wallet:', error);
            // Still save wallet even if funding fails (for demo purposes)
            if (this.wallet) {
                this.saveWalletToStorage();
                return this.wallet;
            }
            throw error;
        }
    }

    async importWallet(seed) {
        try {
            // Validate and import wallet
            this.wallet = xrpl.Wallet.fromSeed(seed);
            console.log('Imported wallet:', this.wallet.address);

            // Save wallet to localStorage
            this.saveWalletToStorage();
            
            return this.wallet;
        } catch (error) {
            console.error('Failed to import wallet:', error);
            throw error;
        }
    }

    async waitForAccountActivation() {
        let attempts = 0;
        const maxAttempts = 15;
        
        while (attempts < maxAttempts) {
            try {
                const accountInfo = await this.getAccountInfo();
                if (accountInfo) {
                    console.log('Account activated successfully');
                    return accountInfo;
                }
            } catch (error) {
                // Account not found yet, continue waiting
            }
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            attempts++;
        }
        
        console.warn('Account activation timeout - continuing anyway');
        return null;
    }

    async getAccountInfo() {
        if (!this.wallet || !this.isConnected) {
            throw new Error('Wallet not connected');
        }

        try {
            const accountInfo = await this.client.request({
                command: 'account_info',
                account: this.wallet.address,
                ledger_index: 'validated'
            });
            return accountInfo.result.account_data;
        } catch (error) {
            if (error.data?.error === 'actNotFound') {
                return null;
            }
            throw error;
        }
    }

    saveWalletToStorage() {
        if (!this.wallet) return;
        
        const walletData = {
            address: this.wallet.address,
            seed: this.wallet.seed,
            network: this.useTestnet ? 'testnet' : 'mainnet',
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('yieldbridge_wallet', JSON.stringify(walletData));
        console.log('Wallet saved to storage');
    }

    updateConnectionStatus(connected, message = '') {
        const statusElement = document.getElementById('connectionStatus');
        const addressElement = document.getElementById('walletAddress');
        
        if (statusElement) {
            statusElement.className = connected ? 'fas fa-circle connected' : 'fas fa-circle disconnected';
        }
        
        if (addressElement) {
            if (connected && this.wallet) {
                addressElement.textContent = formatAddress(this.wallet.address);
            } else {
                addressElement.textContent = message || (connected ? 'Connected' : 'Not Connected');
            }
        }
    }

    exportWalletData() {
        if (!this.wallet) return null;
        
        return {
            address: this.wallet.address,
            seed: this.wallet.seed,
            network: this.useTestnet ? 'testnet' : 'mainnet',
            exportedAt: new Date().toISOString()
        };
    }
}

// Global wallet manager instance
let walletManager = null;

document.addEventListener('DOMContentLoaded', function() {
    walletManager = new WalletManager();
    setupEventListeners();
    checkExistingWallet();
});

function setupEventListeners() {
    // Wallet option clicks
    document.getElementById('createNewWallet').addEventListener('click', handleCreateNewWallet);
    document.getElementById('importExistingWallet').addEventListener('click', handleImportWallet);
    document.getElementById('connectXumm').addEventListener('click', handleXummConnect);
    
    // Network selection
    document.querySelectorAll('input[name="network"]').forEach(radio => {
        radio.addEventListener('change', handleNetworkChange);
    });
}

async function checkExistingWallet() {
    const existingWallet = localStorage.getItem('yieldbridge_wallet');
    if (existingWallet) {
        try {
            const walletData = JSON.parse(existingWallet);
            showExistingWalletOption(walletData);
        } catch (error) {
            console.error('Failed to parse existing wallet data:', error);
        }
    }
}

function showExistingWalletOption(walletData) {
    const walletOptions = document.querySelector('.wallet-options');
    const existingOption = document.createElement('div');
    existingOption.className = 'wallet-option existing-wallet';
    existingOption.innerHTML = `
        <div class="option-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <div class="option-content">
            <h3>Continue with Existing Wallet</h3>
            <p>Address: ${formatAddress(walletData.address)}</p>
        </div>
        <div class="option-arrow">
            <i class="fas fa-chevron-right"></i>
        </div>
    `;
    
    existingOption.addEventListener('click', continueToApp);
    walletOptions.insertBefore(existingOption, walletOptions.firstChild);
}

async function handleCreateNewWallet() {
    try {
        showCreateWalletModal();
        
        // Initialize connection
        await walletManager.initialize();
        updateCreationStep(1);
        
        // Create wallet
        const wallet = await walletManager.createNewWallet();
        updateCreationStep(2);
        
        // Show wallet details
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateCreationStep(3);
        showWalletDetails(wallet);
        
    } catch (error) {
        console.error('Failed to create wallet:', error);
        if (typeof showToast === 'function') {
            showToast(`Failed to create wallet: ${error.message}`, 'error');
        }
        closeCreateWalletModal();
    }
}

function handleImportWallet() {
    showImportWalletModal();
}

function handleXummConnect() {
    if (typeof showToast === 'function') {
        showToast('XUMM integration coming soon!', 'info');
    }
}

function handleNetworkChange() {
    const selectedNetwork = document.querySelector('input[name="network"]:checked').value;
    console.log('Network changed to:', selectedNetwork);
}

function showCreateWalletModal() {
    const modal = document.getElementById('createWalletModal');
    modal.style.display = 'block';
    
    // Reset steps
    document.querySelectorAll('.creation-step').forEach(step => {
        step.classList.remove('active', 'completed');
    });
    document.getElementById('step1').classList.add('active');
    
    document.getElementById('walletDetails').style.display = 'none';
    document.getElementById('walletActions').style.display = 'none';
}

function updateCreationStep(stepNumber) {
    const currentStep = document.querySelector('.creation-step.active');
    if (currentStep) {
        currentStep.classList.remove('active');
        currentStep.classList.add('completed');
        currentStep.querySelector('.step-icon i').className = 'fas fa-check';
    }
    
    if (stepNumber <= 3) {
        const nextStep = document.getElementById(`step${stepNumber}`);
        nextStep.classList.add('active');
    }
}

function showWalletDetails(wallet) {
    document.getElementById('walletAddressDisplay').textContent = wallet.address;
    document.getElementById('walletSeedDisplay').textContent = wallet.seed;
    
    document.getElementById('walletDetails').style.display = 'block';
    document.getElementById('walletActions').style.display = 'flex';
}

function showImportWalletModal() {
    const modal = document.getElementById('importWalletModal');
    modal.style.display = 'block';
    
    // Clear form
    document.getElementById('importForm').reset();
    document.getElementById('importStatus').innerHTML = '';
}

async function importWallet() {
    const seedInput = document.getElementById('importSeed');
    const seed = seedInput.value.trim();
    const statusDiv = document.getElementById('importStatus');
    
    if (!seed) {
        statusDiv.innerHTML = '<p class="error">Please enter a valid seed or private key</p>';
        return;
    }
    
    try {
        statusDiv.innerHTML = '<p class="info">Importing wallet...</p>';
        
        // Initialize connection
        await walletManager.initialize();
        
        // Import wallet
        const wallet = await walletManager.importWallet(seed);
        
        statusDiv.innerHTML = `<p class="success">Wallet imported successfully! Address: ${formatAddress(wallet.address)}</p>`;
        
        setTimeout(() => {
            closeImportModal();
            continueToApp();
        }, 2000);
        
    } catch (error) {
        console.error('Failed to import wallet:', error);
        statusDiv.innerHTML = `<p class="error">Failed to import wallet: ${error.message}</p>`;
    }
}

function closeCreateWalletModal() {
    document.getElementById('createWalletModal').style.display = 'none';
}

function closeImportModal() {
    document.getElementById('importWalletModal').style.display = 'none';
}

function copyAddress() {
    const address = document.getElementById('walletAddressDisplay').textContent;
    navigator.clipboard.writeText(address).then(() => {
        if (typeof showToast === 'function') {
            showToast('Address copied to clipboard', 'success');
        }
    });
}

function copySeed() {
    const seed = document.getElementById('walletSeedDisplay').textContent;
    navigator.clipboard.writeText(seed).then(() => {
        if (typeof showToast === 'function') {
            showToast('Seed copied to clipboard', 'success');
        }
    });
}

function downloadBackup() {
    const walletData = walletManager.exportWalletData();
    if (!walletData) return;
    
    const blob = new Blob([JSON.stringify(walletData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `yieldbridge-wallet-${walletData.address.substring(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    if (typeof showToast === 'function') {
        showToast('Wallet backup downloaded', 'success');
    }
}

function continueToApp() {
    const existingWallet = localStorage.getItem('yieldbridge_wallet');
    if (existingWallet) {
        // Set some demo balance if none exists
        const hasBalance = localStorage.getItem('rlusd_balance');
        if (!hasBalance) {
            localStorage.setItem('rlusd_balance', '100.00');
        }
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        if (typeof showToast === 'function') {
            showToast('No wallet connected', 'error');
        }
    }
}
