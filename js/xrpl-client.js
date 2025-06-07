<!DOCTYPE html><!DOCTYPE html>// XRPL Client for handling blockchain interactions


















































































</html></body>    <script src="js/xrpl-client.js"></script>    <script src="js/main.js"></script>    <script src="js/i18n.js"></script>    </footer>        </div>            <p>&copy; 2024 YieldBridge. Built on XRP Ledger with RLUSD.</p>        <div class="container">    <footer class="footer">    </main>        </section>            </div>                </div>                    </div>                        <p data-translate="explainer.step4.desc">Donate portion of yield to local community causes</p>                        <h3 data-translate="explainer.step4.title">4. Create Impact</h3>                        </div>                            <i class="fas fa-heart"></i>                        <div class="step-icon">                    <div class="step">                    </div>                        <p data-translate="explainer.step3.desc">Generate safe returns through automated DeFi strategies</p>                        <h3 data-translate="explainer.step3.title">3. Earn Yield</h3>                        </div>                            <i class="fas fa-chart-line"></i>                        <div class="step-icon">                    <div class="step">                    </div>                        <p data-translate="explainer.step2.desc">Connect with community members in trusted savings groups</p>                        <h3 data-translate="explainer.step2.title">2. Join Savings Circle</h3>                        </div>                            <i class="fas fa-users"></i>                        <div class="step-icon">                    <div class="step">                    </div>                        <p data-translate="explainer.step1.desc">Securely deposit RLUSD stablecoins to your YieldBridge wallet</p>                        <h3 data-translate="explainer.step1.title">1. Deposit RLUSD</h3>                        </div>                            <i class="fas fa-wallet"></i>                        <div class="step-icon">                    <div class="step">                <div class="steps">                <h2 data-translate="explainer.title">How YieldBridge Works</h2>            <div class="container">        <section class="explainer">        </section>            </div>                <button class="cta-button" onclick="window.location.href='dashboard.html'" data-translate="hero.cta">Get Started</button>                <p data-translate="hero.subtitle">Join community savings circles, earn yield with RLUSD, and create impact in your community.</p>                <h1 data-translate="hero.title">Save. Earn. Empower.</h1>            <div class="container">        <section class="hero">    <main class="landing-main">    </header>        </div>            </div>                </select>                    <option value="fr">FR</option>                    <option value="es">ES</option>                    <option value="en">EN</option>                <select id="languageSelect">            <div class="language-selector">            </div>                <span>YieldBridge</span>                <i class="fas fa-bridge-circle-exclamation"></i>            <div class="logo">        <div class="container">    <header class="header"><body></head>    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">    <link rel="stylesheet" href="styles/main.css">    <title>YieldBridge - Save. Earn. Empower.</title>    <meta name="viewport" content="width=device-width, initial-scale=1.0">    <meta charset="UTF-8"><head><html lang="en">
















































































</html></body>    <script src="js/main.js"></script>    <script src="js/i18n.js"></script>    </footer>        </div>            <p>&copy; 2024 YieldBridge. Built on XRP Ledger with RLUSD.</p>        <div class="container">    <footer class="footer">    </main>        </section>            </div>                </div>                    </div>                        <p data-translate="explainer.step4.desc">Donate portion of yield to local community causes</p>                        <h3 data-translate="explainer.step4.title">4. Create Impact</h3>                        </div>                            <i class="fas fa-heart"></i>                        <div class="step-icon">                    <div class="step">                    </div>                        <p data-translate="explainer.step3.desc">Generate safe returns through automated DeFi strategies</p>                        <h3 data-translate="explainer.step3.title">3. Earn Yield</h3>                        </div>                            <i class="fas fa-chart-line"></i>                        <div class="step-icon">                    <div class="step">                    </div>                        <p data-translate="explainer.step2.desc">Connect with community members in trusted savings groups</p>                        <h3 data-translate="explainer.step2.title">2. Join Savings Circle</h3>                        </div>                            <i class="fas fa-users"></i>                        <div class="step-icon">                    <div class="step">                    </div>                        <p data-translate="explainer.step1.desc">Securely deposit RLUSD stablecoins to your YieldBridge wallet</p>                        <h3 data-translate="explainer.step1.title">1. Deposit RLUSD</h3>                        </div>                            <i class="fas fa-wallet"></i>                        <div class="step-icon">                    <div class="step">                <div class="steps">                <h2 data-translate="explainer.title">How YieldBridge Works</h2>            <div class="container">        <section class="explainer">        </section>            </div>                <button class="cta-button" onclick="window.location.href='dashboard.html'" data-translate="hero.cta">Get Started</button>                <p data-translate="hero.subtitle">Join community savings circles, earn yield with RLUSD, and create impact in your community.</p>                <h1 data-translate="hero.title">Save. Earn. Empower.</h1>            <div class="container">        <section class="hero">    <main class="landing-main">    </header>        </div>            </div>                </select>                    <option value="fr">FR</option>                    <option value="es">ES</option>                    <option value="en">EN</option>                <select id="languageSelect">            <div class="language-selector">            </div>                <span>YieldBridge</span>                <i class="fas fa-bridge-circle-exclamation"></i>            <div class="logo">        <div class="container">    <header class="header"><body></head>    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">    <link rel="stylesheet" href="styles/main.css">    <title>YieldBridge - Save. Earn. Empower.</title>    <meta name="viewport" content="width=device-width, initial-scale=1.0">    <meta charset="UTF-8"><head><html lang="en">
class XRPLClient {
    constructor() {
        this.client = null;
        this.wallet = null;
        this.isConnected = false;
        this.testnetServer = 'wss://s.altnet.rippletest.net:51233';
        this.mainnetServer = 'wss://xrplcluster.com';
        this.rlusdIssuer = 'rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De'; // Mock RLUSD issuer for testnet
        this.useTestnet = true; // Switch to false for mainnet
        this.connectionRetries = 0;
        this.maxRetries = 3;
    }

    async connect() {
        try {
            const server = this.useTestnet ? this.testnetServer : this.mainnetServer;
            console.log(`Connecting to ${this.useTestnet ? 'Testnet' : 'Mainnet'}: ${server}`);
            
            this.client = new xrpl.Client(server);
            
            // Add connection event listeners
            this.client.on('connected', () => {
                console.log('Connected to XRPL');
                this.isConnected = true;
                this.connectionRetries = 0;
                this.updateConnectionStatus(true);
            });
            
            this.client.on('disconnected', () => {
                console.log('Disconnected from XRPL');
                this.isConnected = false;
                this.updateConnectionStatus(false);
                this.handleReconnection();
            });
            
            this.client.on('error', (error) => {
                console.error('XRPL connection error:', error);
                this.updateConnectionStatus(false, error.message);
            });
            
            await this.client.connect();
            
            // Verify connection by getting server info
            const serverInfo = await this.client.request({
                command: 'server_info'
            });
            console.log('XRPL Server Info:', serverInfo.result.info);
            
            return true;
        } catch (error) {
            console.error('Failed to connect to XRPL:', error);
            this.updateConnectionStatus(false, error.message);
            return false;
        }
    }

    async handleReconnection() {
        if (this.connectionRetries < this.maxRetries) {
            this.connectionRetries++;
            console.log(`Attempting to reconnect... (${this.connectionRetries}/${this.maxRetries})`);
            
            setTimeout(async () => {
                try {
                    await this.connect();
                } catch (error) {
                    console.error('Reconnection failed:', error);
                }
            }, 2000 * this.connectionRetries); // Exponential backoff
        } else {
            console.error('Max reconnection attempts reached');
            this.updateConnectionStatus(false, 'Connection lost - please refresh');
        }
    }

    async disconnect() {
        if (this.client && this.isConnected) {
            await this.client.disconnect();
            this.isConnected = false;
            this.updateConnectionStatus(false);
        }
    }

    async createTestWallet() {
        try {
            if (!this.isConnected) {
                throw new Error('Not connected to XRPL');
            }

            // Generate a new wallet for testing
            this.wallet = xrpl.Wallet.generate();
            console.log('Generated wallet:', this.wallet.address);
            
            if (this.useTestnet) {
                // Fund the wallet with testnet XRP
                console.log('Funding testnet wallet...');
                const fundResult = await this.client.fundWallet(this.wallet);
                console.log('Test wallet funded:', fundResult);
                
                // Wait a moment for the funding transaction to settle
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
            // Store wallet info in localStorage for persistence
            localStorage.setItem('yieldbridge_wallet', JSON.stringify({
                address: this.wallet.address,
                seed: this.wallet.seed
            }));
            
            return this.wallet;
        } catch (error) {
            console.error('Failed to create test wallet:', error);
            throw error;
        }
    }

    loadWalletFromStorage() {
        const storedWallet = localStorage.getItem('yieldbridge_wallet');
        if (storedWallet) {
            const walletData = JSON.parse(storedWallet);
            this.wallet = xrpl.Wallet.fromSeed(walletData.seed);
            console.log('Loaded wallet from storage:', this.wallet.address);
            return this.wallet;
        }
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
                console.log('Account not found - may need funding');
                return null;
            }
            console.error('Failed to get account info:', error);
            throw error;
        }
    }

    async getXRPBalance() {
        try {
            const accountInfo = await this.getAccountInfo();
            if (!accountInfo) return 0;
            
            // Convert drops to XRP (1 XRP = 1,000,000 drops)
            return parseFloat(xrpl.dropsToXrp(accountInfo.Balance));
        } catch (error) {
            console.error('Failed to get XRP balance:', error);
            return 0;
        }
    }

    async getRLUSDBalance() {
        if (!this.wallet || !this.isConnected) {
            // Return mock balance for simulation
            const mockBalance = localStorage.getItem('rlusd_balance');
            return mockBalance ? parseFloat(mockBalance) : 0;
        }

        try {
            // Get account lines to find RLUSD trustlines
            const accountLines = await this.client.request({
                command: 'account_lines',
                account: this.wallet.address,
                ledger_index: 'validated'
            });
            
            // Look for RLUSD balance
            const rlusdLine = accountLines.result.lines.find(line => 
                line.currency === 'RLUSD' && line.account === this.rlusdIssuer
            );
            
            if (rlusdLine) {
                return parseFloat(rlusdLine.balance);
            }
            
            // If no RLUSD trustline found, return mock balance for demo
            const mockBalance = localStorage.getItem('rlusd_balance');
            return mockBalance ? parseFloat(mockBalance) : 0;
        } catch (error) {
            console.error('Failed to get RLUSD balance:', error);
            // Fallback to mock balance
            const mockBalance = localStorage.getItem('rlusd_balance');
            return mockBalance ? parseFloat(mockBalance) : 0;
        }
    }

    async createTrustline(currency, issuer, limit = '1000000') {
        if (!this.wallet || !this.isConnected) {
            throw new Error('Wallet not connected');
        }

        try {
            const trustSet = {
                TransactionType: 'TrustSet',
                Account: this.wallet.address,
                LimitAmount: {
                    currency: currency,
                    issuer: issuer,
                    value: limit
                }
            };

            const prepared = await this.client.autofill(trustSet);
            const signed = this.wallet.sign(prepared);
            const result = await this.client.submitAndWait(signed.tx_blob);
            
            console.log('Trustline created:', result);
            return result;
        } catch (error) {
            console.error('Failed to create trustline:', error);
            throw error;
        }
    }

    async sendXRP(destinationAddress, amount, memo = '') {
        if (!this.wallet || !this.isConnected) {
            throw new Error('Wallet not connected');
        }

        try {
            const payment = {
                TransactionType: 'Payment',
                Account: this.wallet.address,
                Destination: destinationAddress,
                Amount: xrpl.xrpToDrops(amount.toString()),
            };

            if (memo) {
                payment.Memos = [{
                    Memo: {
                        MemoData: Buffer.from(memo, 'utf8').toString('hex').toUpperCase()
                    }
                }];
            }

            const prepared = await this.client.autofill(payment);
            const signed = this.wallet.sign(prepared);
            const result = await this.client.submitAndWait(signed.tx_blob);
            
            console.log('XRP payment result:', result);
            
            if (result.result.meta.TransactionResult === 'tesSUCCESS') {
                this.addToTransactionHistory({
                    type: 'send_xrp',
                    amount: amount,
                    destination: destinationAddress,
                    memo: memo,
                    txHash: result.result.hash,
                    timestamp: new Date().toISOString()
                });
            }
            
            return result;
        } catch (error) {
            console.error('Failed to send XRP:', error);
            throw error;
        }
    }

    async sendRLUSD(destinationAddress, amount, memo = '') {
        if (!this.wallet || !this.isConnected) {
            // Simulate transaction for demo
            return this.simulateRLUSDTransaction(destinationAddress, amount, memo);
        }

        try {
            const payment = {
                TransactionType: 'Payment',
                Account: this.wallet.address,
                Destination: destinationAddress,
                Amount: {
                    currency: 'RLUSD',
                    issuer: this.rlusdIssuer,
                    value: amount.toString()
                }
            };

            if (memo) {
                payment.Memos = [{
                    Memo: {
                        MemoData: Buffer.from(memo, 'utf8').toString('hex').toUpperCase()
                    }
                }];
            }

            const prepared = await this.client.autofill(payment);
            const signed = this.wallet.sign(prepared);
            const result = await this.client.submitAndWait(signed.tx_blob);
            
            console.log('RLUSD payment result:', result);
            
            if (result.result.meta.TransactionResult === 'tesSUCCESS') {
                this.addToTransactionHistory({
                    type: 'send',
                    amount: amount,
                    destination: destinationAddress,
                    memo: memo,
                    txHash: result.result.hash,
                    timestamp: new Date().toISOString()
                });
            }
            
            return result;
        } catch (error) {
            console.error('Failed to send RLUSD:', error);
            // Fallback to simulation
            return this.simulateRLUSDTransaction(destinationAddress, amount, memo);
        }
    }

    async simulateRLUSDTransaction(destinationAddress, amount, memo = '') {
        // Simulate the transaction for demo purposes
        const mockTxHash = this.generateMockTxHash();
        
        // Deduct from local balance
        const currentBalance = await this.getRLUSDBalance();
        if (currentBalance < amount) {
            throw new Error('Insufficient balance');
        }
        
        const newBalance = currentBalance - amount;
        localStorage.setItem('rlusd_balance', newBalance.toString());
        
        // Add to transaction history
        this.addToTransactionHistory({
            type: 'send',
            amount: amount,
            destination: destinationAddress,
            memo: memo,
            txHash: mockTxHash,
            timestamp: new Date().toISOString()
        });
        
        return {
            result: {
                hash: mockTxHash,
                meta: { TransactionResult: 'tesSUCCESS' }
            }
        };
    }

    async depositRLUSD(amount) {
        try {
            // For prototype, simulate deposit by adding to localStorage balance
            const currentBalance = await this.getRLUSDBalance();
            const newBalance = currentBalance + amount;
            localStorage.setItem('rlusd_balance', newBalance.toString());
            
            // Add to transaction history
            this.addToTransactionHistory({
                type: 'deposit',
                amount: amount,
                txHash: this.generateMockTxHash(),
                timestamp: new Date().toISOString()
            });
            
            // Start yield earning simulation if not already running
            this.startYieldSimulation();
            
            return true;
        } catch (error) {
            console.error('Failed to deposit RLUSD:', error);
            throw error;
        }
    }

    startYieldSimulation() {
        // Check if yield simulation is already running
        const existingInterval = localStorage.getItem('yield_interval_active');
        if (existingInterval === 'true') {
            return;
        }
        
        localStorage.setItem('yield_interval_active', 'true');
        
        // Simulate yield earning every minute
        const yieldInterval = setInterval(() => {
            const balance = parseFloat(localStorage.getItem('rlusd_balance') || '0');
            if (balance > 0) {
                const annualYieldRate = 0.05; // 5% annual yield
                const minutelyYield = balance * (annualYieldRate / 525600); // 525600 minutes in a year
                
                const currentYield = parseFloat(localStorage.getItem('total_yield') || '0');
                const newYield = currentYield + minutelyYield;
                localStorage.setItem('total_yield', newYield.toString());
                
                // Calculate and store donation
                const donationPercentage = parseFloat(localStorage.getItem('donation_percentage') || '20') / 100;
                const donation = minutelyYield * donationPercentage;
                const currentDonated = parseFloat(localStorage.getItem('total_donated') || '0');
                localStorage.setItem('total_donated', (currentDonated + donation).toString());
                
                // Emit event for UI updates
                window.dispatchEvent(new CustomEvent('yieldUpdated', {
                    detail: { yield: newYield, donated: currentDonated + donation }
                }));
            }
        }, 60000); // Every minute
        
        // Store interval ID for cleanup
        window.yieldInterval = yieldInterval;
    }

    stopYieldSimulation() {
        localStorage.setItem('yield_interval_active', 'false');
        if (window.yieldInterval) {
            clearInterval(window.yieldInterval);
            window.yieldInterval = null;
        }
    }

    addToTransactionHistory(transaction) {
        const history = JSON.parse(localStorage.getItem('transaction_history') || '[]');
        history.unshift(transaction);
        localStorage.setItem('transaction_history', JSON.stringify(history.slice(0, 50))); // Keep last 50 transactions
    }

    getTransactionHistory() {
        return JSON.parse(localStorage.getItem('transaction_history') || '[]');
    }

    generateMockTxHash() {
        return 'tx_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    updateConnectionStatus(connected, errorMessage = '') {
        const statusElement = document.getElementById('connectionStatus');
        const addressElement = document.getElementById('walletAddress');
        
        if (statusElement) {
            statusElement.className = connected ? 'fas fa-circle connected' : 'fas fa-circle disconnected';
        }
        
        if (addressElement) {
            if (connected && this.wallet) {
                addressElement.textContent = formatAddress(this.wallet.address);
            } else if (errorMessage) {
                addressElement.textContent = errorMessage;
            } else {
                addressElement.textContent = connected ? 'Connected' : 'Disconnected';
            }
        }
    }

    async initialize() {
        try {
            // Connect to XRPL
            const connected = await this.connect();
            if (!connected) {
                throw new Error('Failed to connect to XRPL');
            }
            
            // Try to load existing wallet or create new one
            let wallet = this.loadWalletFromStorage();
            if (!wallet) {
                wallet = await this.createTestWallet();
            } else {
                // Verify wallet still exists on ledger
                try {
                    await this.getAccountInfo();
                } catch (error) {
                    console.log('Stored wallet not found on ledger, creating new one');
                    wallet = await this.createTestWallet();
                }
            }
            
            console.log('XRPL Client initialized with wallet:', wallet.address);
            
            // Update UI with wallet info
            this.updateConnectionStatus(true);
            
            return true;
        } catch (error) {
            console.error('Failed to initialize XRPL client:', error);
            this.updateConnectionStatus(false, 'Initialization failed');
            return false;
        }
    }

    // Utility method to validate XRPL address
    isValidAddress(address) {
        try {
            return xrpl.isValidClassicAddress(address);
        } catch (error) {
            return false;
        }
    }

    // Get network fee for transactions
    async getNetworkFee() {
        if (!this.isConnected) {
            return 0.000012; // Default fee in XRP
        }

        try {
            const feeResult = await this.client.request({
                command: 'fee'
            });
            return parseFloat(xrpl.dropsToXrp(feeResult.result.drops.base_fee));
        } catch (error) {
            console.error('Failed to get network fee:', error);
            return 0.000012; // Fallback fee
        }
    }
}

// Global XRPL client instance
let xrplClient = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    if (typeof xrpl !== 'undefined') {
        console.log('Initializing XRPL client...');
        xrplClient = new XRPLClient();
        
        // Show loading state
        const statusElement = document.getElementById('connectionStatus');
        const addressElement = document.getElementById('walletAddress');
        
        if (statusElement) {
            statusElement.className = 'fas fa-spinner fa-spin';
        }
        if (addressElement) {
            addressElement.textContent = 'Connecting...';
        }
        
        // Initialize with timeout
        const initPromise = xrplClient.initialize();
        const timeoutPromise = new Promise((resolve) => {
            setTimeout(() => resolve(false), 10000); // 10 second timeout
        });
        
        const success = await Promise.race([initPromise, timeoutPromise]);
        
        if (!success) {
            console.warn('XRPL initialization timed out or failed, using simulation mode');
            if (addressElement) {
                addressElement.textContent = 'Simulation Mode';
            }
            if (statusElement) {
                statusElement.className = 'fas fa-circle disconnected';
            }
        }
    } else {
        console.error('XRPL library not loaded');
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (xrplClient) {
        xrplClient.stopYieldSimulation();
        xrplClient.disconnect();
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, could pause some operations
    } else {
        // Page is visible again, check connection
        if (xrplClient && !xrplClient.isConnected) {
            xrplClient.connect().catch(console.error);
        }
    }
});
