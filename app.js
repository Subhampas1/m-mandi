// =============================================
// THE MULTILINGUAL MANDI - App Logic
// =============================================

// ===== Application State =====
const appState = {
    currentScreen: 'landing',
    selectedLanguage: null,
    userRole: null,
    commodities: [],
    currentNegotiation: null,
    voiceActive: false
};

// ===== Sample Data =====
const sampleCommodities = [
    {
        id: 1,
        name: 'Tomatoes',
        nameHindi: 'टमाटर',
        nameTamil: 'தக்காளி',
        price: 50,
        quantity: '100 kg',
        location: 'Maharashtra',
        quality: 'A-Grade',
        icon: '🍅',
        isBestPrice: true
    },
    {
        id: 2,
        name: 'Potatoes',
        nameHindi: 'आलू',
        nameTamil: 'உருளைக்கிழங்கு',
        price: 35,
        quantity: '200 kg',
        location: 'Punjab',
        quality: 'Premium',
        icon: '🥔',
        isBestPrice: false
    },
    {
        id: 3,
        name: 'Onions',
        nameHindi: 'प्याज',
        nameTamil: 'வெங்காயம்',
        price: 42,
        quantity: '150 kg',
        location: 'Karnataka',
        quality: 'A-Grade',
        icon: '🧅',
        isBestPrice: true
    },
    {
        id: 4,
        name: 'Rice',
        nameHindi: 'चावल',
        nameTamil: 'அரிசி',
        price: 65,
        quantity: '500 kg',
        location: 'West Bengal',
        quality: 'Basmati',
        icon: '🌾',
        isBestPrice: false
    },
    {
        id: 5,
        name: 'Wheat',
        nameHindi: 'गेहूं',
        nameTamil: 'கோதுமை',
        price: 28,
        quantity: '300 kg',
        location: 'Haryana',
        quality: 'Premium',
        icon: '🌾',
        isBestPrice: true
    },
    {
        id: 6,
        name: 'Green Chillies',
        nameHindi: 'हरी मिर्च',
        nameTamil: 'பச்சை மிளகாய்',
        price: 80,
        quantity: '50 kg',
        location: 'Andhra Pradesh',
        quality: 'A-Grade',
        icon: '🌶️',
        isBestPrice: false
    }
];

const languageContent = {
    hindi: {
        code: 'hi',
        name: 'Hindi',
        script: 'हिंदी',
        greeting: 'नमस्ते'
    },
    english: {
        code: 'en',
        name: 'English',
        script: 'English',
        greeting: 'Hello'
    },
    tamil: {
        code: 'ta',
        name: 'Tamil',
        script: 'தமிழ்',
        greeting: 'வணக்கம்'
    },
    bengali: {
        code: 'bn',
        name: 'Bengali',
        script: 'বাংলা',
        greeting: 'নমস্কার'
    },
    marathi: {
        code: 'mr',
        name: 'Marathi',
        script: 'मराठी',
        greeting: 'नमस्कार'
    },
    telugu: {
        code: 'te',
        name: 'Telugu',
        script: 'తెలుగు',
        greeting: 'నమస్కారం'
    }
};

// ===== Screen Navigation =====
function navigateToScreen(screenId) {
    // Hide all screens
    const allScreens = document.querySelectorAll('.screen');
    allScreens.forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        appState.currentScreen = screenId;

        // Trigger screen-specific initialization
        initializeScreen(screenId);

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function initializeScreen(screenId) {
    switch (screenId) {
        case 'buyer-marketplace':
            renderCommoditiesList();
            break;
        case 'vendor-dashboard':
            renderVendorListings();
            break;
        case 'negotiation':
            animateDealProgress();
            break;
    }
}

// ===== Voice Simulation =====
function simulateVoiceInput() {
    const voiceButton = document.querySelector('.voice-button');
    if (!voiceButton) return;

    appState.voiceActive = true;
    voiceButton.style.transform = 'scale(1.1)';
    voiceButton.style.background = 'linear-gradient(135deg, #E67300, #FF9933)';

    // Simulate voice processing
    setTimeout(() => {
        voiceButton.style.transform = 'scale(1)';
        voiceButton.style.background = 'linear-gradient(135deg, #FF9933, #FFB366)';
        appState.voiceActive = false;

        // Show feedback
        showVoiceFeedback('Voice detected! Select language below or continue speaking...');
    }, 2000);
}

function simulateVendorVoice() {
    const voiceButton = document.querySelector('.voice-button-small');
    if (!voiceButton) return;

    voiceButton.style.transform = 'scale(1.2)';

    setTimeout(() => {
        voiceButton.style.transform = 'scale(1)';

        // Auto-fill example data
        document.getElementById('commodity-name').value = 'Tomatoes (टमाटर)';
        document.getElementById('commodity-quantity').value = '100';
        document.getElementById('commodity-location').value = 'Maharashtra';

        showNotification('✓ Voice input processed!', 'success');
    }, 1500);
}

function simulateBuyerVoice() {
    const voiceButton = document.querySelector('.voice-search .voice-button-small');
    if (!voiceButton) return;

    voiceButton.style.transform = 'scale(1.2)';

    setTimeout(() => {
        voiceButton.style.transform = 'scale(1)';
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = 'Tomatoes (தக்காளி)';
            searchInput.focus();
        }
        showNotification('🎤 Searching for Tomatoes...', 'success');
    }, 1500);
}

function showVoiceFeedback(message) {
    const indicator = document.getElementById('selected-language');
    if (indicator) {
        indicator.textContent = message;
        indicator.style.color = 'var(--color-success)';
    }
}

// ===== Language Selection =====
function selectLanguage(languageKey) {
    const selectedLang = languageContent[languageKey];
    if (!selectedLang) return;

    appState.selectedLanguage = selectedLang;

    // Update UI to show selection
    const allTiles = document.querySelectorAll('.language-tile');
    allTiles.forEach(tile => tile.classList.remove('selected'));

    event.target.closest('.language-tile').classList.add('selected');

    // Show confirmation
    const indicator = document.getElementById('selected-language');
    if (indicator) {
        indicator.innerHTML = `
            <strong>Selected:</strong> ${selectedLang.script} (${selectedLang.name})<br>
            ${selectedLang.greeting}!
        `;
    }

    // Auto-advance after selection
    setTimeout(() => {
        navigateToScreen('role-select');
    }, 1500);
}

// ===== Role Selection =====
function selectRole(role) {
    appState.userRole = role;

    // Visual feedback
    const roleCard = event.target.closest('.role-card');
    roleCard.style.borderColor = 'var(--color-success)';
    roleCard.style.transform = 'scale(1.05)';

    setTimeout(() => {
        if (role === 'vendor') {
            navigateToScreen('vendor-dashboard');
        } else {
            navigateToScreen('buyer-marketplace');
        }
    }, 800);
}

// ===== AI Price Discovery =====
function requestAIPrice() {
    const commodityName = document.getElementById('commodity-name').value;
    const quantity = document.getElementById('commodity-quantity').value;
    const location = document.getElementById('commodity-location').value;

    if (!commodityName || !quantity) {
        showNotification('⚠️ Please enter commodity name and quantity', 'warning');
        return;
    }

    // Show loading state
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '🤖 AI Analyzing...';
    button.disabled = true;

    // Simulate AI processing
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;

        // Show AI price panel with animation
        const pricePanel = document.getElementById('ai-price-panel');
        if (pricePanel) {
            pricePanel.style.display = 'block';
            pricePanel.style.animation = 'fadeIn 0.5s forwards';

            // Generate dynamic price based on input
            const basePrice = Math.floor(Math.random() * 50) + 30;
            const priceRange = `₹${basePrice} - ₹${basePrice + 10} / kg`;

            const priceValue = document.getElementById('suggested-price');
            if (priceValue) {
                priceValue.textContent = priceRange;
            }
        }

        // Scroll to AI panel
        pricePanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 2500);
}

function listCommodity() {
    const commodityName = document.getElementById('commodity-name').value;
    const quantity = document.getElementById('commodity-quantity').value;
    const price = document.getElementById('suggested-price').textContent;

    const newCommodity = {
        id: Date.now(),
        name: commodityName,
        quantity: quantity + ' kg',
        price: price,
        status: 'Active'
    };

    appState.commodities.push(newCommodity);

    showNotification('✓ Commodity listed successfully!', 'success');

    // Clear form
    document.getElementById('commodity-name').value = '';
    document.getElementById('commodity-quantity').value = '';
    document.getElementById('commodity-location').value = '';

    // Hide AI panel
    const pricePanel = document.getElementById('ai-price-panel');
    if (pricePanel) {
        pricePanel.style.display = 'none';
    }

    // Refresh listings
    renderVendorListings();
}

function renderVendorListings() {
    const listingsGrid = document.getElementById('vendor-listings');
    if (!listingsGrid) return;

    if (appState.commodities.length === 0) {
        listingsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--color-text-secondary);">
                No active listings yet. List your first commodity above!
            </div>
        `;
        return;
    }

    listingsGrid.innerHTML = appState.commodities.map(commodity => `
        <div class="commodity-card">
            <div class="commodity-image">📦</div>
            <div class="commodity-info">
                <h4>${commodity.name}</h4>
                <div class="commodity-price">${commodity.price}</div>
                <div class="commodity-details">
                    📊 ${commodity.quantity}<br>
                    ✅ ${commodity.status}
                </div>
            </div>
        </div>
    `).join('');
}

// ===== Buyer Marketplace =====
function renderCommoditiesList() {
    const commoditiesGrid = document.getElementById('commodities-list');
    if (!commoditiesGrid) return;

    const allCommodities = [...sampleCommodities, ...appState.commodities];

    if (allCommodities.length === 0) {
        commoditiesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--color-text-secondary);">
                No commodities available right now. Check back soon!
            </div>
        `;
        return;
    }

    commoditiesGrid.innerHTML = sampleCommodities.map(commodity => `
        <div class="commodity-card" onclick="startNegotiation(${commodity.id})">
            <div class="commodity-image">${commodity.icon}</div>
            <div class="commodity-info">
                <h4>${commodity.name}</h4>
                <div style="font-size: 0.875rem; color: var(--color-text-secondary);">
                    ${commodity.nameHindi} • ${commodity.nameTamil}
                </div>
                <div class="commodity-price">₹${commodity.price}/kg</div>
                <div class="commodity-details">
                    📍 ${commodity.location}<br>
                    📊 ${commodity.quantity} available<br>
                    ⭐ ${commodity.quality}
                </div>
                ${commodity.isBestPrice ? '<span class="best-price-badge">✓ Fair Price</span>' : ''}
            </div>
        </div>
    `).join('');
}

function startNegotiation(commodityId) {
    const commodity = sampleCommodities.find(c => c.id === commodityId);
    if (!commodity) return;

    appState.currentNegotiation = commodity;
    navigateToScreen('negotiation');
}

// ===== Negotiation =====
function animateDeal Progress() {
    const progressFill = document.getElementById('deal-progress');
    if (!progressFill) return;

    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        progressFill.style.width = `${Math.min(progress, 75)}%`;

        if (progress >= 75) {
            clearInterval(interval);
        }
    }, 100);
}

function acceptSuggestion(suggestionId) {
    const chip = event.target;
    chip.style.background = 'var(--color-success)';
    chip.style.color = 'var(--color-white)';
    chip.style.borderColor = 'var(--color-success)';

    // Update progress
    const progressFill = document.getElementById('deal-progress');
    if (progressFill) {
        progressFill.style.width = '90%';
    }

    showNotification('💬 Response sent!', 'success');
}

function finalizeDeal() {
    const button = event.target;
    button.textContent = '⏳ Processing...';
    button.disabled = true;

    setTimeout(() => {
        // Update progress to 100%
        const progressFill = document.getElementById('deal-progress');
        if (progressFill) {
            progressFill.style.width = '100%';
        }

        showNotification('🎉 Deal finalized successfully!', 'success');

        setTimeout(() => {
            navigateToScreen('impact');
        }, 2000);
    }, 1500);
}

// ===== Notifications =====
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--color-success)' :
            type === 'warning' ? 'var(--color-warning)' :
                'var(--color-primary)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        font-weight: 600;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add slide animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🛒 The Multilingual Mandi initialized');
    console.log('🇮🇳 Visualizing Viksit Bharat through AI');

    // Show landing screen
    navigateToScreen('landing');

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Go back functionality
            const backButton = document.querySelector('.back-button');
            if (backButton) {
                backButton.click();
            }
        }
    });
});

// ===== Utility Functions =====
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

function getLocalizedName(commodity, language) {
    switch (language) {
        case 'hindi':
            return commodity.nameHindi || commodity.name;
        case 'tamil':
            return commodity.nameTamil || commodity.name;
        default:
            return commodity.name;
    }
}

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        appState,
        navigateToScreen,
        selectLanguage,
        selectRole,
        requestAIPrice,
        listCommodity
    };
}
