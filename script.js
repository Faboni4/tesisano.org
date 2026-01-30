/**
 * Tesi & Sano - Main Script
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initDynamicContent();
});

// Navigation Logic
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Highlight active link
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop() || (currentPath.endsWith('/') && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Data Rendering Logic
function initDynamicContent() {
    // Only run if SITE_DATA is available
    if (typeof window.SITE_DATA === 'undefined') return;

    // Check which page we are on to render appropriate content
    const page = document.body.getAttribute('data-page');

    if (page === 'characters') {
        renderCharacters();
    } else if (page === 'team') {
        renderTeam();
    } else if (page === 'gallery') {
        renderGallery();
    } else if (page === 'home') {
        renderHomeFeatured();
    }
}

function renderCharacters() {
    const container = document.getElementById('character-grid');
    if (!container) return;

    window.SITE_DATA.characters.forEach(char => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${char.image}" alt="${char.name}" class="card-img-top">
            <div class="card-body">
                <h3 class="card-title">${char.name}</h3>
                <p class="card-role">${char.role}</p>
                <p>${char.shortDesc}</p>
                <button class="btn btn-secondary mt-sm" onclick="openDetail('character', '${char.id}')">Read More</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderTeam() {
    const container = document.getElementById('team-grid');
    if (!container) return;

    window.SITE_DATA.team.forEach(member => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${member.image}" alt="${member.name}" class="card-img-top">
            <div class="card-body">
                <h3 class="card-title">${member.name}</h3>
                <p class="card-role">${member.role}</p>
                <p>${member.bio}</p>
                <button class="btn btn-secondary mt-sm" onclick="openDetail('team', '${member.id}')">Full Bio</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderGallery() {
    const container = document.getElementById('gallery-grid');
    if (!container) return;

    window.SITE_DATA.gallery.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card gallery-item';
        card.style.cursor = 'pointer';
        card.onclick = () => openLightbox(index);
        card.innerHTML = `
            <img src="${item.src}" alt="${item.caption}" class="card-img-top">
            <div class="card-body text-center">
                <p>${item.caption}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// Simple Home Page Dynamic injection (optional, but keeps data central)
function renderHomeFeatured() {
    // We could inject dynamic "featured" items here if the design called for it
}

// Modal / Detail Logic
function openDetail(type, id) {
    let data;
    if (type === 'character') {
        data = window.SITE_DATA.characters.find(c => c.id === id);
    } else if (type === 'team') {
        data = window.SITE_DATA.team.find(t => t.id === id);
    }

    if (!data) return;

    // Create Modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
    modal.style.zIndex = '2000';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.padding = '20px';

    const content = `
        <div class="modal-content" style="background: white; padding: 2rem; border-radius: 16px; max-width: 600px; width: 100%; position: relative; max-height: 90vh; overflow-y: auto;">
            <button onclick="this.closest('.modal-overlay').remove()" style="position: absolute; top: 15px; right: 20px; border: none; background: none; font-size: 2rem; cursor: pointer;">&times;</button>
            <div class="text-center mb-md">
                <img src="${data.detailImage || data.image}" alt="${data.name}" style="max-height: 300px; margin: 0 auto; border-radius: 8px;">
            </div>
            <h2>${data.name}</h2>
            <p style="color: var(--color-secondary); font-weight: 600; margin-bottom: 1rem;">${data.role}</p>
            <p>${data.fullDesc || data.fullBio || data.shortDesc || data.bio}</p>
        </div>
    `;

    modal.innerHTML = content;
    document.body.appendChild(modal);
}

function openLightbox(index) {
    const images = window.SITE_DATA.gallery;
    const current = images[index];

    const modal = document.createElement('div');
    modal.className = 'lightbox-overlay';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
    modal.style.zIndex = '3000';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';

    modal.innerHTML = `
        <div style="position: relative; max-width: 90%; max-height: 90%;">
            <button onclick="this.closest('.lightbox-overlay').remove()" style="position: absolute; top: -40px; right: 0; border: none; background: none; color: white; font-size: 2rem; cursor: pointer;">&times;</button>
            <img src="${current.src}" style="max-width: 100%; max-height: 90vh; border-radius: 4px;">
            <p style="color: white; text-align: center; margin-top: 10px;">${current.caption}</p>
        </div>
    `;

    document.body.appendChild(modal);
}
