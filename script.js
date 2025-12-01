// ============================================
// Global Variables
// ============================================
let apiData = { categories: [], apis: [] };
let allAPIs = [];
let filteredAPIs = [];
let currentCategory = 'all';
let itemsPerPage = 12;
let currentPage = 1;

// ============================================
// DOM Elements
// ============================================
const searchInput = document.getElementById('searchInput');
const categoriesGrid = document.getElementById('categoriesGrid');
const apisGrid = document.getElementById('apisGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const apiModal = document.getElementById('apiModal');
// Close button uses id="modalClose" and class="modal-close"
const closeModal = document.getElementById('modalClose') || document.querySelector('.modal-close');
const totalApisElement = document.getElementById('totalApis');
const totalCategoriesElement = document.getElementById('totalCategories');
const freeApisElement = document.getElementById('freeApis');
// Stats spans on the page use class="stat-number" — we'll fallback to these if IDs not present
const statNumberSpans = document.querySelectorAll('.stat-number');

// ============================================
// Load API Data from JSON
// ============================================
async function loadAPIData() {
    try {
        // For local file access, we'll embed the data directly
        // This avoids CORS issues with file:// protocol
        const response = await fetch('apis-database.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        apiData = await response.json();
        allAPIs = apiData.apis || [];
        filteredAPIs = [...allAPIs];

        console.log(`✅ Loaded ${allAPIs.length} APIs from ${apiData.categories?.length || 0} categories`);

        // Update statistics
        updateStatistics();
        
        console.log('📊 Rendering categories and APIs...');
        // Initialize the page
        renderCategories();
        renderAPIs();
        
        console.log('✅ Page initialized successfully');
        console.log('Categories rendered:', document.querySelectorAll('.category-card').length);
        console.log('API cards rendered:', document.querySelectorAll('.api-card').length);
    } catch (error) {
        console.error('Error loading API data:', error);
        // Fallback: try to load from embedded data if fetch fails
        console.log('Trying fallback method...');
        loadEmbeddedData();
    }
}

// ============================================
// Fallback: Load embedded data (if fetch fails)
// ============================================
function loadEmbeddedData() {
    // This is a fallback in case the JSON file can't be loaded
    // We'll create a minimal dataset for testing
    apiData = {
        categories: ["Animals", "Anime", "Art & Design"],
        apis: [
            {
                "name": "Test API",
                "description": "This is a test API",
                "auth": "No",
                "https": true,
                "cors": "Yes",
                "link": "https://example.com",
                "category": "Animals",
                "usageExample": "Use this API for testing",
                "appIdeas": ["Test App", "Demo App"]
            }
        ]
    };

    allAPIs = apiData.apis;
    filteredAPIs = [...allAPIs];

    updateStatistics();
    renderCategories();
    renderAPIs();

    console.log('Loaded fallback data');
}

// ============================================
// Update Statistics
// ============================================
function updateStatistics() {
    const freeAPIs = allAPIs.filter(api => api.auth === 'No' || api.auth === 'None').length;
    
    // Update ID-based elements if present
    if (totalApisElement) totalApisElement.textContent = allAPIs.length;
    if (totalCategoriesElement) totalCategoriesElement.textContent = apiData.categories.length;
    if (freeApisElement) freeApisElement.textContent = freeAPIs;

    // Fallback to the visible stat-number blocks in the header
    if (statNumberSpans && statNumberSpans.length >= 3) {
        statNumberSpans[0].textContent = allAPIs.length;
        statNumberSpans[1].textContent = apiData.categories ? apiData.categories.length : 0;
        // Display percentage free APIs
        const percentFree = allAPIs.length ? Math.round((freeAPIs / allAPIs.length) * 100) : 0;
        statNumberSpans[2].textContent = `${percentFree}%`;
    }
}

// ============================================
// Render Categories
// ============================================
function renderCategories() {
    if (!categoriesGrid) {
        console.error('❌ categoriesGrid element not found!');
        return;
    }
    console.log('Rendering categories...');
    const allCategoryCard = `
        <div class="category-card ${currentCategory === 'all' ? 'active' : ''}" data-category="all">
            <div class="category-icon">🌐</div>
            <h3 class="category-name">All APIs</h3>
            <p class="category-count">${allAPIs.length} APIs</p>
        </div>
    `;
    
    const categoryCards = apiData.categories.map(category => {
        const count = allAPIs.filter(api => api.category === category).length;
        const icon = getCategoryIcon(category);
        
        return `
            <div class="category-card ${currentCategory === category ? 'active' : ''}" data-category="${category}">
                <div class="category-icon">${icon}</div>
                <h3 class="category-name">${category}</h3>
                <p class="category-count">${count} APIs</p>
            </div>
        `;
    }).join('');
    
    categoriesGrid.innerHTML = allCategoryCard + categoryCards;
    
    // Add click event to category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            currentCategory = card.dataset.category;
            currentPage = 1;
            filterByCategory();
            setTimeout(() => {
                const apisSection = document.getElementById('apis');
                if (apisSection) {
                    apisSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        });
    });
// Nav link scroll for Categories
document.addEventListener('DOMContentLoaded', () => {
    const navCategories = document.querySelector('a.nav-link[href="#categories"]');
    if (navCategories) {
        navCategories.addEventListener('click', function(e) {
            e.preventDefault();
            const catSection = document.getElementById('categories');
            if (catSection) {
                catSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
});
}

// ============================================
// Get Category Icon
// ============================================
function getCategoryIcon(category) {
    const icons = {
        'Animals': '🐾',
        'Anime': '🎌',
        'Anti-Malware': '🛡️',
        'Art & Design': '🎨',
        'Authentication': '🔐',
        'Blockchain': '⛓️',
        'Books': '📚',
        'Business': '💼',
        'Calendar': '📅',
        'Cloud Storage': '☁️',
        'Cryptocurrency': '₿',
        'Currency Exchange': '💱',
        'Development': '💻',
        'Dictionaries': '📖',
        'Documents': '📄',
        'Email': '📧',
        'Entertainment': '🎬',
        'Environment': '🌍',
        'Events': '🎉',
        'Finance': '💰',
        'Food & Drink': '🍔',
        'Games & Comics': '🎮',
        'Geocoding': '📍',
        'Government': '🏛️',
        'Health': '⚕️',
        'Jobs': '💼',
        'Machine Learning': '🤖',
        'Music': '🎵',
        'News': '📰',
        'Open Data': '📊',
        'Patent': '⚖️',
        'Personality': '😊',
        'Phone': '📱',
        'Photography': '📷',
        'Programming': '⌨️',
        'Science & Math': '🔬',
        'Security': '🔒',
        'Shopping': '🛒',
        'Social': '👥',
        'Sports & Fitness': '⚽',
        'Test Data': '🧪',
        'Text Analysis': '📝',
        'Tracking': '📦',
        'Transportation': '🚗',
        'URL Shorteners': '🔗',
        'Vehicle': '🚙',
        'Video': '🎥',
        'Weather': '🌤️'
    };
    
    return icons[category] || '📌';
}

// ============================================
// Filter by Category
// ============================================
function filterByCategory() {
    currentPage = 1;
    
    // Apply category filter
    if (currentCategory === 'all') {
        filteredAPIs = [...allAPIs];
    } else {
        filteredAPIs = allAPIs.filter(api => api.category === currentCategory);
    }
    
    // Re-apply all active filters
    applyAllFilters();
    
    renderCategories();
    renderAPIs();
}

// ============================================
// Apply All Filters Helper
// ============================================
function applyAllFilters() {
    // Get base APIs from category
    let baseAPIs;
    if (currentCategory === 'all') {
        baseAPIs = [...allAPIs];
    } else {
        baseAPIs = allAPIs.filter(api => api.category === currentCategory);
    }
    
    // Apply checkbox filters
    let filtered = baseAPIs;
    
    const authFilter = document.getElementById('authFilter');
    const httpsFilter = document.getElementById('httpsFilter');
    const corsFilter = document.getElementById('corsFilter');
    
    if (authFilter && authFilter.checked) {
        filtered = filtered.filter(api => 
            api.auth === 'No' || 
            api.auth === 'None' || 
            api.auth === '' || 
            api.auth.toLowerCase() === 'no'
        );
    }
    
    if (httpsFilter && httpsFilter.checked) {
        filtered = filtered.filter(api => api.https === true || api.https === 'Yes');
    }
    
    if (corsFilter && corsFilter.checked) {
        filtered = filtered.filter(api => 
            api.cors === 'Yes' || 
            api.cors === 'yes' || 
            api.cors === 'Yes*' ||
            api.cors === 'Unknown'
        );
    }
    
    filteredAPIs = filtered;
    
    // Apply search if there's a search term
    const searchTerm = searchInput?.value.trim();
    if (searchTerm) {
        applySearch(searchTerm);
    }
}

// ============================================
// Apply Search
// ============================================
function applySearch(searchTerm) {
    const term = searchTerm.toLowerCase();
    
    filteredAPIs = filteredAPIs.filter(api => 
        api.name.toLowerCase().includes(term) ||
        api.description.toLowerCase().includes(term) ||
        api.category.toLowerCase().includes(term)
    );
}

// ============================================
// Render APIs
// ============================================
function renderAPIs() {
    if (!apisGrid) {
        console.error('❌ apisGrid element not found!');
        return;
    }
    console.log(`Rendering ${filteredAPIs.length} APIs...`);
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    const apisToShow = filteredAPIs.slice(startIndex, endIndex);
    
    if (apisToShow.length === 0) {
        apisGrid.innerHTML = '<p class="no-results">No APIs found. Try a different search or category.</p>';
        loadMoreBtn.style.display = 'none';
        return;
    }
    
    const apiCards = apisToShow.map(api => `
        <div class="api-card" data-api='${JSON.stringify(api).replace(/'/g, "&#39;")}'>
            <div class="api-header">
                <h3 class="api-name">${api.name}</h3>
                <span class="api-category">${api.category}</span>
            </div>
            <p class="api-description">${api.description}</p>
            <div class="api-tags">
                <span class="api-tag auth">🔑 ${api.auth}</span>
                <span class="api-tag https">${api.https ? '🔒 HTTPS' : '⚠️ HTTP'}</span>
                <span class="api-tag cors">🌐 ${api.cors}</span>
            </div>
            <div class="api-footer">
                <a href="${api.link}" target="_blank" rel="noopener noreferrer" class="api-link">
                    Explore API →
                </a>
            </div>
        </div>
    `).join('');
    
    apisGrid.innerHTML = apiCards;
    
    // Show/hide load more button
    if (endIndex >= filteredAPIs.length) {
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    } else {
        if (loadMoreBtn) loadMoreBtn.style.display = 'block';
    }
    
    // Add click event to entire cards to show details
    document.querySelectorAll('.api-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on the link
            if (e.target.closest('.api-link')) return;
            
            const apiDataStr = this.dataset.api;
            const api = JSON.parse(apiDataStr);
            showAPIDetails(api);
        });
    });
}

// ============================================
// Show API Details Modal
// ============================================
function showAPIDetails(api) {
    const modalContent = `
        <div class="modal-header">
            <h2>${api.name}</h2>
            <span class="category-badge">${api.category}</span>
        </div>
        <div class="modal-body">
            <div class="detail-section">
                <h3>Description</h3>
                <p>${api.description}</p>
            </div>
            
            <div class="detail-section">
                <h3>API Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Authentication:</strong>
                        <span class="${api.auth === 'No' || api.auth === 'None' ? 'free-badge' : ''}">${api.auth}</span>
                    </div>
                    <div class="info-item">
                        <strong>HTTPS:</strong>
                        <span>${api.https ? '✓ Yes' : '✗ No'}</span>
                    </div>
                    <div class="info-item">
                        <strong>CORS:</strong>
                        <span>${api.cors}</span>
                    </div>
                    <div class="info-item">
                        <strong>Link:</strong>
                        <a href="${api.link}" target="_blank" rel="noopener noreferrer">${api.link}</a>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Usage Example</h3>
                <div class="code-block">
                    <code>${api.usageExample}</code>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>App Ideas</h3>
                <ul class="ideas-list">
                    ${api.appIdeas.map(idea => `<li>${idea}</li>`).join('')}
                </ul>
            </div>
            
            <div class="modal-actions">
                <a href="${api.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-large">
                    <i class="fas fa-external-link-alt"></i> Open API Documentation
                </a>
            </div>
        </div>
    `;
    
    const modalBody = document.getElementById('modalBody');
    if (modalBody) {
        modalBody.innerHTML = modalContent;
    }
    apiModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ============================================
// Search Functionality
// ============================================
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim();
        currentPage = 1;
        
        // Use the unified filter system
        applyAllFilters();
        
        renderAPIs();
    });
}

// ============================================
// Load More Functionality
// ============================================
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderAPIs();
    });
}

// ============================================
// Filter Functionality
// ============================================
const authFilter = document.getElementById('authFilter');
const httpsFilter = document.getElementById('httpsFilter');
const corsFilter = document.getElementById('corsFilter');

function applyFilters() {
    currentPage = 1;
    applyAllFilters();
    renderAPIs();
}

// Attach event listeners to filter checkboxes
if (authFilter) {
    authFilter.addEventListener('change', applyFilters);
}
if (httpsFilter) {
    httpsFilter.addEventListener('change', applyFilters);
}
if (corsFilter) {
    corsFilter.addEventListener('change', applyFilters);
}

// ============================================
// View Toggle Functionality (Grid/List)
// ============================================
const viewButtons = document.querySelectorAll('.view-btn');

viewButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const viewType = this.getAttribute('data-view');
        
        // Update active button
        viewButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Toggle grid view class
        if (apisGrid) {
            if (viewType === 'list') {
                apisGrid.classList.add('list-view');
            } else {
                apisGrid.classList.remove('list-view');
            }
        }
    });
});

// ============================================
// Modal Functionality
// ============================================
if (closeModal) {
    closeModal.addEventListener('click', () => {
        apiModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

if (apiModal) {
    apiModal.addEventListener('click', (e) => {
        if (e.target === apiModal) {
            apiModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && apiModal.classList.contains('active')) {
        apiModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// ============================================
// Scroll to Top
// ============================================
window.addEventListener('scroll', () => {
    const scrollTop = document.getElementById('scrollTop');
    if (scrollTop && window.pageYOffset > 300) {
        scrollTop.classList.add('visible');
    } else if (scrollTop) {
        scrollTop.classList.remove('visible');
    }
});

const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// Initialize App
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadAPIData();
});
