// Impact tracking functionality

const mockCommunityGoals = [
    {
        id: 1,
        title: "Clean Water Well",
        description: "Fund a clean water well for the local community",
        target: 5000,
        raised: 3500,
        category: "infrastructure",
        icon: "fas fa-tint",
        location: "Rural Kenya"
    },
    {
        id: 2,
        title: "School Solar Panels",
        description: "Provide renewable energy for the local school",
        target: 3000,
        raised: 1200,
        category: "education",
        icon: "fas fa-solar-panel",
        location: "Philippines"
    },
    {
        id: 3,
        title: "Microfinance Fund",
        description: "Support small business loans for women entrepreneurs",
        target: 10000,
        raised: 7800,
        category: "economic",
        icon: "fas fa-store",
        location: "Guatemala"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    initializeImpact();
    setupEventListeners();
});

function initializeImpact() {
    updatePersonalImpactStats();
    loadDonationSettings();
    loadCommunityGoals();
    loadImpactHistory();
}

function setupEventListeners() {
    const donationSlider = document.getElementById('donationPercentage');
    const percentageValue = document.getElementById('percentageValue');
    
    if (donationSlider && percentageValue) {
        donationSlider.addEventListener('input', function() {
            percentageValue.textContent = `${this.value}%`;
        });
    }
    
    // Listen for yield updates
    window.addEventListener('yieldUpdated', function(event) {
        updatePersonalImpactStats();
    });
}

function updatePersonalImpactStats() {
    try {
        const totalYield = parseFloat(localStorage.getItem('total_yield') || '0');
        const totalDonated = parseFloat(localStorage.getItem('total_donated') || '0');
        const peopleHelped = Math.floor(totalDonated / 10); // Assume $10 helps 1 person
        
        console.log('Updating impact stats:', { totalYield, totalDonated, peopleHelped });
        
        updateElement('totalYield', totalYield.toFixed(2));
        updateElement('totalDonated', totalDonated.toFixed(2));
        updateElement('peopleHelped', peopleHelped.toString());
        
        // Update donation percentage display
        const donationPercentage = localStorage.getItem('donation_percentage') || '20';
        const percentageElement = document.querySelector('[data-translate="impact.personal.donatedPercent"]');
        if (percentageElement) {
            percentageElement.textContent = `${donationPercentage}% of yield`;
        }
        
        console.log('Impact stats updated successfully');
        
    } catch (error) {
        console.error('Failed to update personal impact stats:', error);
    }
}

function loadDonationSettings() {
    const savedPercentage = localStorage.getItem('donation_percentage') || '20';
    const donationSlider = document.getElementById('donationPercentage');
    const percentageValue = document.getElementById('percentageValue');
    
    if (donationSlider) {
        donationSlider.value = savedPercentage;
    }
    
    if (percentageValue) {
        percentageValue.textContent = `${savedPercentage}%`;
    }
}

function saveSettings() {
    const donationSlider = document.getElementById('donationPercentage');
    if (!donationSlider) {
        console.error('Donation slider not found');
        return;
    }
    
    const percentage = donationSlider.value;
    localStorage.setItem('donation_percentage', percentage);
    
    console.log('Donation percentage saved:', percentage);
    
    if (typeof showToast === 'function') {
        showToast('Donation settings saved successfully', 'success');
    }
    
    // Update the display
    updatePersonalImpactStats();
}

function loadCommunityGoals() {
    const goalsGrid = document.getElementById('goalsGrid');
    if (!goalsGrid) return;
    
    goalsGrid.innerHTML = mockCommunityGoals.map(goal => 
        createGoalCard(goal)
    ).join('');
}

function createGoalCard(goal) {
    const progressPercentage = Math.min((goal.raised / goal.target) * 100, 100);
    const remaining = Math.max(goal.target - goal.raised, 0);
    
    return `
        <div class="goal-card">
            <div class="goal-header">
                <div class="goal-info">
                    <i class="${goal.icon}"></i>
                    <div>
                        <h3>${goal.title}</h3>
                        <p class="goal-location">${goal.location}</p>
                    </div>
                </div>
                <span class="goal-category">${goal.category}</span>
            </div>
            
            <p class="goal-description">${goal.description}</p>
            
            <div class="goal-progress">
                <div class="goal-progress-bar" style="width: ${progressPercentage}%"></div>
            </div>
            
            <div class="goal-stats">
                <div class="goal-stat">
                    <span class="label">Raised</span>
                    <span class="value">$${goal.raised.toLocaleString()}</span>
                </div>
                <div class="goal-stat">
                    <span class="label">Target</span>
                    <span class="value">$${goal.target.toLocaleString()}</span>
                </div>
                <div class="goal-stat">
                    <span class="label">Remaining</span>
                    <span class="value">$${remaining.toLocaleString()}</span>
                </div>
            </div>
            
            <div class="goal-progress-text">
                <strong>${progressPercentage.toFixed(1)}%</strong> funded
            </div>
        </div>
    `;
}

function loadImpactHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    // Generate mock impact history based on stored data
    const history = generateImpactHistory();
    
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="history-empty">
                <i class="fas fa-heart"></i>
                <p>Start earning yield to see your impact history</p>
            </div>
        `;
        return;
    }
    
    historyList.innerHTML = history.map(item => 
        createHistoryItem(item)
    ).join('');
}

function generateImpactHistory() {
    const transactionHistory = JSON.parse(localStorage.getItem('transaction_history') || '[]');
    const donationPercentage = parseFloat(localStorage.getItem('donation_percentage') || '20') / 100;
    
    const impactHistory = [];
    
    // Add donation events based on transaction history
    transactionHistory.forEach(tx => {
        if (tx.type === 'deposit') {
            impactHistory.push({
                type: 'deposit',
                amount: tx.amount,
                date: new Date(tx.timestamp),
                description: `Deposited RLUSD ${tx.amount} - started earning yield for impact`
            });
        }
    });
    
    // Add simulated donation events
    const totalDonated = parseFloat(localStorage.getItem('total_donated') || '0');
    if (totalDonated > 0) {
        const now = new Date();
        const daysAgo = Math.floor(totalDonated * 10); // Simulate donation frequency
        
        for (let i = 0; i < Math.min(5, Math.floor(totalDonated)); i++) {
            const donationDate = new Date(now.getTime() - (i * daysAgo * 24 * 60 * 60 * 1000));
            const donationAmount = (totalDonated / Math.floor(totalDonated)) || 0.1;
            
            impactHistory.push({
                type: 'donation',
                amount: donationAmount,
                date: donationDate,
                description: `Donated $${donationAmount.toFixed(2)} to Clean Water Well project`
            });
        }
    }
    
    // Sort by date (newest first)
    return impactHistory.sort((a, b) => b.date - a.date).slice(0, 10);
}

function createHistoryItem(item) {
    const iconClass = item.type === 'donation' ? 'fas fa-heart' : 'fas fa-plus-circle';
    const iconColor = item.type === 'donation' ? 'var(--danger-color)' : 'var(--success-color)';
    
    return `
        <div class="history-item">
            <div class="history-icon" style="color: ${iconColor}">
                <i class="${iconClass}"></i>
            </div>
            <div class="history-content">
                <p class="history-description">${item.description}</p>
                <small class="history-date">${formatDate(item.date)}</small>
            </div>
            <div class="history-amount">
                ${item.type === 'donation' ? '-' : '+'}$${item.amount.toFixed(2)}
            </div>
        </div>
    `;
}

function formatDate(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// Add CSS for impact-specific styles
const impactStyles = `
.goal-card {
    background: white;
    padding: 1.5rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-sm);
    margin-bottom: 1rem;
}

.goal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.goal-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.goal-info i {
    font-size: 2rem;
    color: var(--primary-color);
}

.goal-info h3 {
    margin: 0;
    font-size: 1.125rem;
}

.goal-location {
    color: var(--gray-500);
    font-size: 0.875rem;
    margin: 0;
}

.goal-category {
    background: var(--gray-100);
    color: var(--gray-700);
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.75rem;
    text-transform: capitalize;
}

.goal-description {
    color: var(--gray-600);
    margin-bottom: 1rem;
}

.goal-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin: 1rem 0;
}

.goal-stat {
    text-align: center;
}

.goal-stat .label {
    display: block;
    font-size: 0.75rem;
    color: var(--gray-500);
    margin-bottom: 0.25rem;
}

.goal-stat .value {
    font-size: 1rem;
    font-weight: bold;
    color: var(--gray-800);
}

.goal-progress-text {
    text-align: center;
    color: var(--gray-600);
    font-size: 0.875rem;
}

.history-empty {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--gray-500);
}

.history-empty i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.history-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid var(--gray-200);
}

.history-item:last-child {
    border-bottom: none;
}

.history-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: var(--gray-100);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.history-content {
    flex: 1;
}

.history-description {
    margin: 0;
    font-size: 0.875rem;
}

.history-date {
    color: var(--gray-500);
    font-size: 0.75rem;
}

.history-amount {
    font-weight: bold;
    color: var(--gray-800);
}

@media (max-width: 768px) {
    .goal-stats {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }
    
    .goal-header {
        flex-direction: column;
        gap: 1rem;
    }
    
    .history-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
}
`;

// Add styles to document
const styleElement = document.createElement('style');
styleElement.textContent = impactStyles;
document.head.appendChild(styleElement);
