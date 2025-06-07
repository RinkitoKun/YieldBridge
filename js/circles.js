// Savings circles functionality

const mockCircles = [
    {
        id: 1,
        name: "Community Builders",
        members: 5,
        maxMembers: 8,
        monthlyContribution: 50,
        duration: 12,
        description: "Building community infrastructure",
        nextPayout: "2024-01-15",
        status: "active"
    },
    {
        id: 2,
        name: "Small Business Fund",
        members: 7,
        maxMembers: 10,
        monthlyContribution: 100,
        duration: 6,
        description: "Supporting local entrepreneurs",
        nextPayout: "2024-01-20",
        status: "recruiting"
    },
    {
        id: 3,
        name: "Education Support",
        members: 4,
        maxMembers: 6,
        monthlyContribution: 25,
        duration: 24,
        description: "Funding educational initiatives",
        nextPayout: "2024-01-25",
        status: "active"
    }
];

let selectedCircle = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeCircles();
    setupEventListeners();
});

function initializeCircles() {
    loadUserCircle();
    loadAvailableCircles();
    setupFilters();
}

function setupEventListeners() {
    const contributionFilter = document.getElementById('contributionFilter');
    const durationFilter = document.getElementById('durationFilter');
    
    if (contributionFilter) {
        contributionFilter.addEventListener('change', filterCircles);
    }
    
    if (durationFilter) {
        durationFilter.addEventListener('change', filterCircles);
    }
}

function loadUserCircle() {
    const userCircle = JSON.parse(localStorage.getItem('user_circle') || 'null');
    const myCircleSection = document.getElementById('myCircleSection');
    
    if (userCircle && myCircleSection) {
        myCircleSection.style.display = 'block';
        populateUserCircleData(userCircle);
    }
}

function populateUserCircleData(circleData) {
    // Update circle name and status
    updateElement('myCircleName', circleData.name);
    updateElement('myCircleStatus', circleData.status);
    
    // Update stats
    updateElement('circleMembers', `${circleData.members}/${circleData.maxMembers}`);
    updateElement('monthlyContribution', `$${circleData.monthlyContribution}`);
    updateElement('nextPayout', calculateNextPayout(circleData.nextPayout));
    
    // Update member list
    updateMemberList(circleData);
}

function updateMemberList(circleData) {
    const memberList = document.getElementById('memberList');
    if (!memberList) return;
    
    // Mock member data
    const members = [
        { name: 'You', active: true },
        { name: 'Alice M.', active: false },
        { name: 'Bob K.', active: false },
        { name: 'Carol S.', active: false },
        { name: 'David L.', active: false }
    ];
    
    memberList.innerHTML = members.map(member => 
        `<div class="member ${member.active ? 'active' : ''}">${member.name}</div>`
    ).join('');
}

function loadAvailableCircles() {
    const circlesGrid = document.getElementById('circlesGrid');
    if (!circlesGrid) return;
    
    const userCircle = JSON.parse(localStorage.getItem('user_circle') || 'null');
    const availableCircles = mockCircles.filter(circle => 
        !userCircle || circle.id !== userCircle.id
    );
    
    circlesGrid.innerHTML = availableCircles.map(circle => 
        createCircleCard(circle)
    ).join('');
    
    // Add click listeners to join buttons
    circlesGrid.querySelectorAll('.join-circle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const circleId = parseInt(this.dataset.circleId);
            showJoinModal(circleId);
        });
    });
}

function createCircleCard(circle) {
    const isRecruiting = circle.status === 'recruiting';
    const spotsLeft = circle.maxMembers - circle.members;
    
    return `
        <div class="circle-card">
            <div class="circle-header">
                <h3>${circle.name}</h3>
                <span class="circle-status ${circle.status}">${circle.status}</span>
            </div>
            <p class="circle-description">${circle.description}</p>
            <div class="circle-stats">
                <div class="stat">
                    <span class="label">Members</span>
                    <span class="value">${circle.members}/${circle.maxMembers}</span>
                </div>
                <div class="stat">
                    <span class="label">Monthly</span>
                    <span class="value">$${circle.monthlyContribution}</span>
                </div>
                <div class="stat">
                    <span class="label">Duration</span>
                    <span class="value">${circle.duration} months</span>
                </div>
            </div>
            <div class="circle-actions">
                ${isRecruiting ? 
                    `<button class="join-circle-btn primary-btn" data-circle-id="${circle.id}">
                        Join Circle (${spotsLeft} spots left)
                    </button>` :
                    `<button class="join-circle-btn secondary-btn" disabled>
                        Full
                    </button>`
                }
            </div>
        </div>
    `;
}

function filterCircles() {
    const contributionFilter = document.getElementById('contributionFilter').value;
    const durationFilter = document.getElementById('durationFilter').value;
    
    let filteredCircles = [...mockCircles];
    
    if (contributionFilter !== 'all') {
        filteredCircles = filteredCircles.filter(circle => 
            circle.monthlyContribution === parseInt(contributionFilter)
        );
    }
    
    if (durationFilter !== 'all') {
        filteredCircles = filteredCircles.filter(circle => 
            circle.duration === parseInt(durationFilter)
        );
    }
    
    const circlesGrid = document.getElementById('circlesGrid');
    if (circlesGrid) {
        circlesGrid.innerHTML = filteredCircles.map(circle => 
            createCircleCard(circle)
        ).join('');
        
        // Re-add event listeners
        circlesGrid.querySelectorAll('.join-circle-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const circleId = parseInt(this.dataset.circleId);
                showJoinModal(circleId);
            });
        });
    }
}

function showJoinModal(circleId) {
    selectedCircle = mockCircles.find(circle => circle.id === circleId);
    if (!selectedCircle) return;
    
    const modal = document.getElementById('joinModal');
    const circleInfo = document.getElementById('selectedCircleInfo');
    
    if (modal && circleInfo) {
        circleInfo.innerHTML = `
            <div class="selected-circle-info">
                <h4>${selectedCircle.name}</h4>
                <p>${selectedCircle.description}</p>
                <div class="join-details">
                    <div class="detail-row">
                        <span>Monthly Contribution:</span>
                        <span>$${selectedCircle.monthlyContribution}</span>
                    </div>
                    <div class="detail-row">
                        <span>Duration:</span>
                        <span>${selectedCircle.duration} months</span>
                    </div>
                    <div class="detail-row">
                        <span>Current Members:</span>
                        <span>${selectedCircle.members}/${selectedCircle.maxMembers}</span>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    }
}

function closeJoinModal() {
    const modal = document.getElementById('joinModal');
    if (modal) {
        modal.style.display = 'none';
        selectedCircle = null;
    }
}

function confirmJoin() {
    if (!selectedCircle) return;
    
    // Save user circle to localStorage
    localStorage.setItem('user_circle', JSON.stringify(selectedCircle));
    
    // Update dashboard circle status
    const event = new CustomEvent('circleJoined', { detail: selectedCircle });
    window.dispatchEvent(event);
    
    // Show success message
    showToast(`Successfully joined ${selectedCircle.name}!`, 'success');
    
    // Close modal and refresh page
    closeJoinModal();
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

function calculateNextPayout(payoutDate) {
    const now = new Date();
    const payout = new Date(payoutDate);
    const diffTime = payout - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
        return `${diffDays} days`;
    } else if (diffDays === 0) {
        return 'Today';
    } else {
        return 'Overdue';
    }
}

function setupFilters() {
    // Initialize filter options based on available circles
    const contributions = [...new Set(mockCircles.map(c => c.monthlyContribution))].sort((a, b) => a - b);
    const durations = [...new Set(mockCircles.map(c => c.duration))].sort((a, b) => a - b);
    
    const contributionFilter = document.getElementById('contributionFilter');
    const durationFilter = document.getElementById('durationFilter');
    
    // Add contribution options
    if (contributionFilter) {
        contributions.forEach(amount => {
            const option = document.createElement('option');
            option.value = amount;
            option.textContent = `$${amount}/month`;
            contributionFilter.appendChild(option);
        });
    }
    
    // Add duration options
    if (durationFilter) {
        durations.forEach(months => {
            const option = document.createElement('option');
            option.value = months;
            option.textContent = `${months} months`;
            durationFilter.appendChild(option);
        });
    }
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('joinModal');
    if (modal && event.target === modal) {
        closeJoinModal();
    }
});
