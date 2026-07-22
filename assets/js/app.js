// SMT Portal - Main Application JavaScript

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage === 'index.html' || currentPage === '') {
        // Initialize landing page
        initializeLandingPage();
    } else if (currentPage === 'dashboard.html') {
        // Initialize dashboard
        initializeDashboard();
    }
});

/**
 * Initialize landing page functionality
 */
function initializeLandingPage() {
    // Setup smooth scrolling for anchor links
    setupSmoothScroll();
    console.log('[APP] Landing page initialized');
}

/**
 * Setup smooth scroll for anchor links
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize dashboard functionality
 */
function initializeDashboard() {
    // Add active menu item on current page
    setActiveMenuItem();
    
    // Load dashboard data from API
    loadDashboardData();
    
    // Add interactive features
    initializeButtons();
    console.log('[APP] Dashboard initialized');
}

/**
 * Load dashboard data from API
 */
function loadDashboardData() {
    console.log('[APP] Loading dashboard data from API...');
    
    // Call API to get dashboard data
    APIService.getDashboard()
        .then(response => {
            if (response.success) {
                console.log('[APP] Dashboard data loaded successfully');
                updateDashboardData(response.data);
                
                // Initialize charts after data is loaded
                setTimeout(() => {
                    initializeCharts();
                }, 100);
            }
        })
        .catch(error => {
            console.error('[APP] Error loading dashboard data:', error);
            showNotification('Gagal memuatkan data dashboard', 'error');
        });
}

/**
 * Update dashboard UI with data from API
 * @param {object} data - Dashboard data from API
 */
function updateDashboardData(data) {
    // Update summary cards
    if (data.income !== undefined) {
        const incomeCard = document.querySelector('.summary-card:nth-child(1) .amount');
        if (incomeCard) incomeCard.textContent = 'RM' + data.income.toLocaleString('ms-MY');
    }

    if (data.expense !== undefined) {
        const expenseCard = document.querySelector('.summary-card:nth-child(2) .amount');
        if (expenseCard) expenseCard.textContent = 'RM' + data.expense.toLocaleString('ms-MY');
    }

    if (data.balance !== undefined) {
        const balanceCard = document.querySelector('.summary-card:nth-child(3) .amount');
        if (balanceCard) balanceCard.textContent = 'RM' + data.balance.toLocaleString('ms-MY');
    }

    if (data.score !== undefined) {
        const scoreCard = document.querySelector('.summary-card:nth-child(4) .amount');
        if (scoreCard) scoreCard.textContent = data.score;
    }

    // Update monthly trend chart
    if (data.monthlyTrend && Array.isArray(data.monthlyTrend)) {
        updateMonthlyTrendChart(data.monthlyTrend);
    }

    // Update budget section
    if (data.budget) {
        updateBudgetSection(data.budget);
    }

    // Update categories list
    if (data.categories && Array.isArray(data.categories)) {
        updateCategoriesList(data.categories);
    }

    // Update recent transactions
    if (data.recentTransactions && Array.isArray(data.recentTransactions)) {
        updateRecentTransactions(data.recentTransactions);
    }

    console.log('[APP] Dashboard UI updated with API data');
}

/**
 * Update monthly trend chart
 * @param {array} trends - Monthly trend data
 */
function updateMonthlyTrendChart(trends) {
    const chartBars = document.querySelector('.chart-bars');
    if (!chartBars) return;

    // Clear existing bars
    chartBars.innerHTML = '';

    // Create new bars based on API data
    trends.forEach(trend => {
        const maxValue = 100; // Reference max height percentage
        const incomeHeight = (trend.income / 6000) * 100; // Normalize to percentage
        const expenseHeight = (trend.expense / 6000) * 100;

        const columnHTML = `
            <div class="chart-column">
                <div class="bar income" style="height: ${incomeHeight}%;"></div>
                <div class="bar expense" style="height: ${expenseHeight}%;"></div>
                <small>${trend.month}</small>
            </div>
        `;
        chartBars.insertAdjacentHTML('beforeend', columnHTML);
    });

    console.log('[APP] Monthly trend chart updated');
}

/**
 * Update budget section
 * @param {object} budget - Budget data
 */
function updateBudgetSection(budget) {
    if (budget.percentage !== undefined) {
        const budgetPercent = document.querySelector('.budget-percent');
        if (budgetPercent) budgetPercent.textContent = budget.percentage + '%';
    }

    if (budget.used !== undefined && budget.total !== undefined) {
        const progressValue = document.querySelector('.progress-value');
        if (progressValue) {
            progressValue.style.width = budget.percentage + '%';
        }

        const budgetText = document.querySelector('.progress-track + small');
        if (budgetText) {
            budgetText.textContent = `RM${budget.used.toLocaleString('ms-MY')} dari RM${budget.total.toLocaleString('ms-MY')}`;
        }
    }

    // Update budget details
    const budgetDetails = document.querySelectorAll('.budget-details div');
    if (budgetDetails.length >= 4) {
        if (budgetDetails[0] && budget.used !== undefined) {
            budgetDetails[0].querySelector('strong').textContent = 'RM' + budget.used.toLocaleString('ms-MY');
        }
        if (budgetDetails[1] && budget.total !== undefined && budget.used !== undefined) {
            const remaining = budget.total - budget.used;
            budgetDetails[1].querySelector('strong').textContent = 'RM' + remaining.toLocaleString('ms-MY');
        }
        if (budgetDetails[3] && budget.daysRemaining !== undefined) {
            budgetDetails[3].querySelector('strong').textContent = budget.daysRemaining + ' hari';
        }
    }

    console.log('[APP] Budget section updated');
}

/**
 * Update categories list
 * @param {array} categories - Categories data
 */
function updateCategoriesList(categories) {
    const categoryList = document.querySelector('.category-list');
    if (!categoryList) return;

    // Clear existing items
    categoryList.innerHTML = '';

    // Create new category items based on API data
    categories.forEach(category => {
        const categoryHTML = `
            <div class="category-item">
                <div class="category-name">
                    <div class="category-icon">${category.icon || '📊'}</div>
                    <div>
                        <strong>${category.name}</strong>
                        <small>${category.count || 0} transaksi</small>
                    </div>
                </div>
                <strong class="expense-amount">RM${category.amount.toLocaleString('ms-MY')}</strong>
            </div>
        `;
        categoryList.insertAdjacentHTML('beforeend', categoryHTML);
    });

    console.log('[APP] Categories list updated');
}

/**
 * Update recent transactions
 * @param {array} transactions - Transactions data
 */
function updateRecentTransactions(transactions) {
    const transactionList = document.querySelector('.transaction-list');
    if (!transactionList) return;

    // Clear existing items
    transactionList.innerHTML = '';

    // Create new transaction items based on API data
    transactions.forEach(transaction => {
        const amountClass = transaction.amount >= 0 ? 'income-amount' : 'expense-amount';
        const amountText = transaction.amount >= 0 ? '+RM' : '-RM';
        const absAmount = Math.abs(transaction.amount);

        const transactionHTML = `
            <div class="transaction-item">
                <div class="transaction-left">
                    <div class="transaction-icon">${transaction.icon || '💳'}</div>
                    <div>
                        <strong>${transaction.name}</strong>
                        <small>${transaction.date}</small>
                    </div>
                </div>
                <span class="${amountClass}">${amountText}${absAmount.toLocaleString('ms-MY')}</span>
            </div>
        `;
        transactionList.insertAdjacentHTML('beforeend', transactionHTML);
    });

    console.log('[APP] Recent transactions updated');
}


/**
 * Set active menu item based on current page
 */
function setActiveMenuItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage || (href === '#' && currentPage === '')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * Initialize button interactions
 */
function initializeButtons() {
    const buttons = document.querySelectorAll('.icon-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            handleButtonClick(this);
        });
    });
}

/**
 * Handle button clicks
 */
function handleButtonClick(button) {
    if (button.textContent.includes('🔔')) {
        // Show notification
        showNotification('Tiada notifikasi baharu', 'info');
    }
}

/**
 * Initialize chart animations
 */
function initializeCharts() {
    const bars = document.querySelectorAll('.chart-bars .bar');
    
    bars.forEach((bar, index) => {
        // Animate bars on page load
        const height = bar.style.height;
        bar.style.height = '0';
        bar.style.transition = 'height 0.8s ease-out';
        
        setTimeout(() => {
            bar.style.height = height;
        }, index * 50);
    });

    console.log('[APP] Chart animations initialized');
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // You can extend this to show visual notifications
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('ms-MY', {
        style: 'currency',
        currency: 'MYR',
        minimumFractionDigits: 2
    }).format(amount);
}

/**
 * Responsive menu toggle for mobile
 */
function initializeResponsiveMenu() {
    const sidebar = document.querySelector('.sidebar');
    
    if (window.innerWidth <= 760) {
        sidebar.style.position = 'relative';
        sidebar.style.width = '100%';
    }
}

window.addEventListener('resize', initializeResponsiveMenu);
initializeResponsiveMenu();
