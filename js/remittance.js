// Remittance functionality for sending RLUSD

let pendingTransaction = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeRemittance();
    setupEventListeners();
});

function initializeRemittance() {
    updateAvailableBalance();
    updateActiveNavigation();
}

function setupEventListeners() {
    const sendForm = document.getElementById('sendForm');
    const sendAmount = document.getElementById('sendAmount');
    const recipientAddress = document.getElementById('recipientAddress');
    
    if (sendForm) {
        sendForm.addEventListener('submit', handleSendForm);
    }
    
    if (sendAmount) {
        sendAmount.addEventListener('input', updateTransactionSummary);
    }
    
    if (recipientAddress) {
        recipientAddress.addEventListener('input', validateRecipientAddress);
    }
}

async function updateAvailableBalance() {
    try {
        const balance = await (xrplClient ? xrplClient.getRLUSDBalance() : getStoredBalance());
        const balanceElement = document.getElementById('availableBalance');
        if (balanceElement) {
            balanceElement.textContent = balance.toFixed(2);
        }
    } catch (error) {
        console.error('Failed to update available balance:', error);
    }
}

function validateRecipientAddress() {
    const recipientInput = document.getElementById('recipientAddress');
    const address = recipientInput.value.trim();
    
    if (address && xrplClient && xrplClient.isValidAddress) {
        const isValid = xrplClient.isValidAddress(address);
        recipientInput.style.borderColor = isValid ? 'var(--success-color)' : 'var(--danger-color)';
        
        if (!isValid && address.length > 10) {
            showValidationError('Invalid XRP Ledger address format');
        } else {
            hideValidationError();
        }
    } else {
        recipientInput.style.borderColor = '';
        hideValidationError();
    }
}

function showValidationError(message) {
    const recipientInput = document.getElementById('recipientAddress');
    let errorElement = recipientInput.parentNode.querySelector('.validation-error');
    
    if (!errorElement) {
        errorElement = document.createElement('small');
        errorElement.className = 'validation-error';
        errorElement.style.color = 'var(--danger-color)';
        recipientInput.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function hideValidationError() {
    const recipientInput = document.getElementById('recipientAddress');
    const errorElement = recipientInput.parentNode.querySelector('.validation-error');
    if (errorElement) {
        errorElement.remove();
    }
}

async function updateTransactionSummary() {
    const sendAmount = parseFloat(document.getElementById('sendAmount').value) || 0;
    const networkFee = await getNetworkFee();
    const total = sendAmount + networkFee;
    
    document.getElementById('summaryAmount').textContent = `RLUSD ${sendAmount.toFixed(6)}`;
    document.getElementById('summaryFee').textContent = `RLUSD ${networkFee.toFixed(6)}`;
    document.getElementById('summaryTotal').textContent = `RLUSD ${total.toFixed(6)}`;
}

async function getNetworkFee() {
    if (xrplClient && xrplClient.getNetworkFee) {
        try {
            return await xrplClient.getNetworkFee();
        } catch (error) {
            console.error('Failed to get network fee:', error);
        }
    }
    return 0.000012; // Default XRPL fee
}

async function handleSendForm(event) {
    event.preventDefault();
    
    const recipientAddress = document.getElementById('recipientAddress').value.trim();
    const sendAmount = parseFloat(document.getElementById('sendAmount').value);
    const memo = document.getElementById('memo').value.trim();
    
    // Validate inputs
    if (!recipientAddress) {
        showToast('Please enter a recipient address', 'error');
        return;
    }
    
    if (xrplClient && xrplClient.isValidAddress && !xrplClient.isValidAddress(recipientAddress)) {
        showToast('Invalid recipient address format', 'error');
        return;
    }
    
    if (sendAmount <= 0) {
        showToast('Please enter a valid amount', 'error');
        return;
    }
    
    // Check available balance
    const availableBalance = await (xrplClient ? xrplClient.getRLUSDBalance() : getStoredBalance());
    const networkFee = await getNetworkFee();
    const totalRequired = sendAmount + networkFee;
    
    if (availableBalance < totalRequired) {
        showToast('Insufficient balance for this transaction', 'error');
        return;
    }
    
    // Store transaction details for confirmation
    pendingTransaction = {
        recipient: recipientAddress,
        amount: sendAmount,
        memo: memo,
        fee: networkFee,
        total: totalRequired
    };
    
    showConfirmModal();
}

function showConfirmModal() {
    const modal = document.getElementById('confirmModal');
    const confirmDetails = document.getElementById('confirmDetails');
    
    if (modal && confirmDetails && pendingTransaction) {
        confirmDetails.innerHTML = `
            <div class="confirm-transaction">
                <div class="confirm-row">
                    <span>To:</span>
                    <span class="mono">${formatAddress(pendingTransaction.recipient, 12)}</span>
                </div>
                <div class="confirm-row">
                    <span>Amount:</span>
                    <span>RLUSD ${pendingTransaction.amount.toFixed(6)}</span>
                </div>
                <div class="confirm-row">
                    <span>Network Fee:</span>
                    <span>RLUSD ${pendingTransaction.fee.toFixed(6)}</span>
                </div>
                <div class="confirm-row total">
                    <span>Total:</span>
                    <span>RLUSD ${pendingTransaction.total.toFixed(6)}</span>
                </div>
                ${pendingTransaction.memo ? `
                <div class="confirm-row">
                    <span>Memo:</span>
                    <span>${pendingTransaction.memo}</span>
                </div>
                ` : ''}
            </div>
        `;
        
        modal.style.display = 'block';
    }
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) {
        modal.style.display = 'none';
        pendingTransaction = null;
    }
}

async function executeSend() {
    if (!pendingTransaction) {
        showToast('No transaction to execute', 'error');
        return;
    }
    
    const sendBtn = document.querySelector('#confirmModal .primary-btn');
    if (sendBtn) {
        sendBtn.classList.add('loading');
        sendBtn.disabled = true;
        sendBtn.textContent = 'Sending...';
    }
    
    try {
        let result;
        
        if (xrplClient && xrplClient.isConnected) {
            // Send real RLUSD transaction
            result = await xrplClient.sendRLUSD(
                pendingTransaction.recipient,
                pendingTransaction.amount,
                pendingTransaction.memo
            );
        } else {
            // Simulate transaction
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
            result = await simulateSendTransaction();
        }
        
        if (result && (result.result?.meta?.TransactionResult === 'tesSUCCESS' || result.hash)) {
            closeConfirmModal();
            showSuccessModal(result.result?.hash || result.hash);
            
            // Update balance display
            await updateAvailableBalance();
            
            // Reset form
            document.getElementById('sendForm').reset();
            updateTransactionSummary();
            
        } else {
            throw new Error('Transaction failed');
        }
        
    } catch (error) {
        console.error('Send transaction failed:', error);
        showToast(error.message || 'Transaction failed', 'error');
    } finally {
        if (sendBtn) {
            sendBtn.classList.remove('loading');
            sendBtn.disabled = false;
            sendBtn.textContent = 'Send Now';
        }
    }
}

async function simulateSendTransaction() {
    // Simulate sending RLUSD
    const currentBalance = getStoredBalance();
    const newBalance = currentBalance - pendingTransaction.total;
    localStorage.setItem('rlusd_balance', newBalance.toString());
    
    const txHash = 'sim_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
    
    // Add to transaction history
    const history = JSON.parse(localStorage.getItem('transaction_history') || '[]');
    history.unshift({
        type: 'send',
        amount: pendingTransaction.amount,
        destination: pendingTransaction.recipient,
        memo: pendingTransaction.memo,
        txHash: txHash,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('transaction_history', JSON.stringify(history.slice(0, 50)));
    
    return { hash: txHash };
}

function showSuccessModal(txHash) {
    const modal = document.getElementById('successModal');
    const transactionHash = document.getElementById('transactionHash');
    
    if (modal) {
        if (transactionHash && txHash) {
            transactionHash.innerHTML = `
                <div class="tx-hash">
                    <small>Transaction Hash:</small>
                    <div class="hash-display">
                        <span class="mono">${formatAddress(txHash, 16)}</span>
                        <button onclick="copyToClipboard('${txHash}')" class="copy-btn">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
            `;
        }
        
        modal.style.display = 'block';
        
        // Add success animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
    }
}

function closeSuccessModal() {
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

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Transaction hash copied to clipboard', 'success');
    }).catch(() => {
        showToast('Failed to copy to clipboard', 'error');
    });
}

function updateActiveNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === 'remittance.html') {
            item.classList.add('active');
        }
    });
}

function getStoredBalance() {
    return parseFloat(localStorage.getItem('rlusd_balance') || '0');
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    const confirmModal = document.getElementById('confirmModal');
    const successModal = document.getElementById('successModal');
    
    if (confirmModal && event.target === confirmModal) {
        closeConfirmModal();
    }
    
    if (successModal && event.target === successModal) {
        closeSuccessModal();
    }
});

// Add CSS for new elements
const additionalStyles = `
.confirm-transaction {
    margin: 1rem 0;
}

.confirm-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    padding: 0.5rem 0;
}

.confirm-row.total {
    border-top: 1px solid var(--gray-300);
    font-weight: bold;
    margin-top: 0.5rem;
    padding-top: 0.75rem;
}

.mono {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
}

.tx-hash {
    margin: 1rem 0;
    padding: 1rem;
    background: var(--gray-50);
    border-radius: var(--border-radius);
}

.hash-display {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.copy-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.75rem;
}

.copy-btn:hover {
    background: var(--primary-dark);
}

.validation-error {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.75rem;
}
`;

// Add styles to document
const styleElement = document.createElement('style');
styleElement.textContent = additionalStyles;
document.head.appendChild(styleElement);
