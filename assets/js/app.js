// SMT Portal - Main Application JavaScript

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

/**
 * Initialize dashboard functionality
 */
function initializeDashboard() {
    // Add active menu item on current page
    setActiveMenuItem();
    
    // Add interactive features
    initializeButtons();
    initializeCharts();
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
    const bars = document.querySelectorAll('.bar');
    
    bars.forEach((bar, index) => {
        // Animate bars on page load
        const height = bar.style.height;
        bar.style.height = '0';
        bar.style.transition = 'height 0.8s ease-out';
        
        setTimeout(() => {
            bar.style.height = height;
        }, index * 50);
    });
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
 * Smooth scroll for anchor links
 */
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

/**
 * Export data utilities
 */
const DataUtils = {
    /**
     * Get summary data
     */
    getSummary: function() {
        return {
            income: 4250,
            expense: 2180,
            balance: 2070,
            score: 94
        };
    },

    /**
     * Get monthly trend data
     */
    getMonthlyTrend: function() {
        return [
            { month: 'Jan', income: 3500, expense: 2100 },
            { month: 'Feb', income: 4200, expense: 1900 },
            { month: 'Mac', income: 3800, expense: 2300 },
            { month: 'Apr', income: 4800, expense: 2500 },
            { month: 'Mei', income: 4500, expense: 2700 },
            { month: 'Jun', income: 5100, expense: 3000 },
            { month: 'Jul', income: 5400, expense: 2900 }
        ];
    },

    /**
     * Get expense categories
     */
    getExpenseCategories: function() {
        return [
            { name: 'Makanan & Minuman', amount: 486, count: 12 },
            { name: 'Pengangkutan', amount: 320, count: 8 },
            { name: 'Belanja Runcit', amount: 245, count: 5 },
            { name: 'Hiburan', amount: 150, count: 3 },
            { name: 'Kesihatan', amount: 89, count: 2 }
        ];
    },

    /**
     * Get recent transactions
     */
    getRecentTransactions: function() {
        return [
            { name: 'Pizza Hut', amount: -62, date: 'Hari ini, 13:45', icon: '🍕' },
            { name: 'Gaji Bulanan', amount: 4250, date: 'Kemarin, 09:00', icon: '💳' },
            { name: 'Shell Petrol', amount: -85, date: '2 hari yang lalu', icon: '⛽' },
            { name: 'Tesco Supermarket', amount: -156, date: '3 hari yang lalu', icon: '🛒' },
            { name: 'Netflix Subscription', amount: -17.90, date: '1 minggu yang lalu', icon: '🎬' }
        ];
    }
};

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
