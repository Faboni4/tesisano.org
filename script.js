/**
 * Tesi & Sano - Main Script
 */

const DB_NAME = 'TesiSanoDB';
const STORE_NAME = 'siteData';

async function initData() {
    return new Promise((resolve) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };

        request.onsuccess = (e) => {
            const db = e.target.result;
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const getRequest = store.get('current');

            getRequest.onsuccess = () => {
                if (getRequest.result) {
                    window.SITE_DATA = getRequest.result;
                    console.log('✅ Loaded saved data from IndexedDB');
                } else {
                    console.log('ℹ️ Using default data.js (No data in IndexedDB)');
                }
                resolve();
            };
            getRequest.onerror = () => {
                console.error('❌ Error reading from IndexedDB');
                resolve();
            };
        };

        request.onerror = () => {
            console.error('❌ Error opening IndexedDB');
            resolve();
        };
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await initData();
    initGlobalBranding();
    initNavigation();
    initDynamicContent();
    initCarousel();
});

// Branding Logic
function initGlobalBranding() {
    if (typeof window.SITE_DATA === 'undefined') return;

    // Update Logo
    const logoImg = document.querySelector('.logo img');
    if (logoImg && window.SITE_DATA.siteSettings && window.SITE_DATA.siteSettings.logoUrl) {
        logoImg.src = window.SITE_DATA.siteSettings.logoUrl;
    }
}

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
    } else if (page === 'behind-the-scenes') {
        renderBehindTheScenes();
    } else if (page === 'home') {
        renderHeroCarousel();
    } else if (page === 'about') {
        renderAboutPage();
    } else if (page === 'contact') {
        renderContactPage();
    }
}

function renderCharacters() {
    const container = document.getElementById('character-grid');
    if (!container) return;

    if (window.SITE_DATA.characters) {
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
}

function renderTeam() {
    const container = document.getElementById('team-grid');
    if (!container) return;

    if (window.SITE_DATA.team) {
        window.SITE_DATA.team.forEach(member => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${member.image}" alt="${member.name}" class="card-img-top">
                <div class="card-body">
                    <h3 class="card-title">${member.name}</h3>
                    <p class="card-role">${member.role}</p>
                    <p class="line-clamp-2">${member.bio}</p>
                    <button class="btn btn-secondary mt-sm" onclick="openDetail('team', '${member.id}')">Show More</button>
                </div>
            `;
            container.appendChild(card);
        });
    }
}

function renderBehindTheScenes() {
    const bts = window.SITE_DATA.btsPage || {};

    // Render Text Elements
    if (bts.title) document.getElementById('bts-header-title').textContent = bts.title;
    if (bts.description) document.getElementById('bts-header-desc').textContent = bts.description;
    if (bts.videoSectionTitle) document.getElementById('bts-video-section-title').textContent = bts.videoSectionTitle;
    if (bts.imageSectionTitle) document.getElementById('bts-image-section-title').textContent = bts.imageSectionTitle;

    // Render Videos
    const videoContainer = document.getElementById('bts-video-grid');
    if (videoContainer) {
        videoContainer.innerHTML = '';
        const videos = bts.videos || [];
        videos.forEach(vid => {
            const placeholder = document.createElement('div');
            placeholder.className = 'video-placeholder';

            // Extract Video Info
            let thumbUrl = 'https://placehold.co/420x236/000/fff?text=Video+Thumbnail';
            let isVimeo = vid.url.includes('vimeo.com');

            if (vid.url.includes('youtube.com') || vid.url.includes('youtu.be')) {
                let videoId = '';
                if (vid.url.includes('v=')) videoId = vid.url.split('v=')[1].split('&')[0];
                else if (vid.url.includes('be/')) videoId = vid.url.split('be/')[1].split('?')[0];
                if (videoId) thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            } else if (isVimeo) {
                const vimeoId = vid.url.split('/').pop().split('?')[0];
                if (vimeoId) thumbUrl = `https://vumbnail.com/${vimeoId}.jpg`;
            }

            placeholder.style.backgroundImage = `url(${thumbUrl})`;
            placeholder.style.backgroundSize = 'cover';
            placeholder.style.backgroundPosition = 'center';

            placeholder.innerHTML = `<span class="video-title">${vid.title}</span>`;
            placeholder.onclick = () => openVideoModal(vid.url);
            videoContainer.appendChild(placeholder);
        });
    }

    // Render Images
    const imageContainer = document.getElementById('bts-image-grid');
    if (imageContainer) {
        imageContainer.innerHTML = '';
        const images = window.SITE_DATA.btsImages || window.SITE_DATA.gallery || [];
        images.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'bts-image';
            div.innerHTML = `<img src="${item.src}" alt="${item.caption || 'BTS Image'}" onclick="openLightbox(${index})">`;
            imageContainer.appendChild(div);
        });
    }
}

function openVideoModal(url) {
    let embedUrl = url;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
        else if (url.includes('be/')) videoId = url.split('be/')[1].split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (url.includes('vimeo.com')) {
        const vimeoId = url.split('/').pop().split('?')[0];
        embedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
    }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.position = 'fixed';
    modal.style.top = '0'; modal.style.left = '0';
    modal.style.width = '100%'; modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
    modal.style.zIndex = '5000';
    modal.style.display = 'flex'; modal.style.justifyContent = 'center'; modal.style.alignItems = 'center';

    modal.innerHTML = `
        <div style="position: relative; width: 90%; max-width: 1000px; aspect-ratio: 16/9;">
            <button onclick="this.closest('.modal-overlay').remove()" style="position: absolute; top: -40px; right: 0; border: none; background: none; color: white; font-size: 2rem; cursor: pointer;">&times;</button>
            <iframe src="${embedUrl}" style="width: 100%; height: 100%; border: none; border-radius: 8px;" allow="autoplay; fullscreen" allowfullscreen></iframe>
        </div>
    `;
    document.body.appendChild(modal);
}

function renderAboutPage() {
    const about = window.SITE_DATA.aboutPage;
    if (!about) return;

    if (about.headerTitle) document.getElementById('about-header-title').textContent = about.headerTitle;
    if (about.headerDesc) document.getElementById('about-header-desc').textContent = about.headerDesc;

    if (about.overviewImg) document.getElementById('about-overview-img').src = about.overviewImg;
    if (about.overviewTitle) document.getElementById('about-overview-title').textContent = about.overviewTitle;
    if (about.overviewP1) document.getElementById('about-overview-p1').textContent = about.overviewP1;
    if (about.overviewP2) document.getElementById('about-overview-p2').textContent = about.overviewP2;

    if (about.themesTitle) document.getElementById('about-themes-title').textContent = about.themesTitle;

    if (about.theme1Title) document.getElementById('about-theme-1-title').textContent = about.theme1Title;
    if (about.theme1Desc) document.getElementById('about-theme-1-desc').textContent = about.theme1Desc;

    if (about.theme2Title) document.getElementById('about-theme-2-title').textContent = about.theme2Title;
    if (about.theme2Desc) document.getElementById('about-theme-2-desc').textContent = about.theme2Desc;

    if (about.theme3Title) document.getElementById('about-theme-3-title').textContent = about.theme3Title;
    if (about.theme3Desc) document.getElementById('about-theme-3-desc').textContent = about.theme3Desc;
}

function renderHeroCarousel() {
    const container = document.querySelector('.hero-carousel');
    if (!container) return;

    const images = window.SITE_DATA.heroImages;
    if (images && images.length > 0) {
        container.innerHTML = '';
        images.forEach((img, index) => {
            const slide = document.createElement('div');
            slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
            slide.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
            container.appendChild(slide);
        });
    }

    // Render Homepage Text Content
    const home = window.SITE_DATA.homepage || {};

    if (home.heroTitle) document.getElementById('hero-title').textContent = home.heroTitle;
    if (home.heroTagline) document.getElementById('hero-tagline').textContent = home.heroTagline;
    if (home.storyTitle) document.getElementById('story-title').textContent = home.storyTitle;
    if (home.storyDesc) document.getElementById('story-desc').textContent = home.storyDesc;
    if (home.missionTitle) document.getElementById('mission-title').textContent = home.missionTitle;
    if (home.missionDesc) document.getElementById('mission-desc').textContent = home.missionDesc;
    if (home.trailerTitle) document.getElementById('trailer-title').textContent = home.trailerTitle;

    // Mission Items
    if (home.missionItem1Title) document.getElementById('mission-item-1-title').textContent = home.missionItem1Title;
    if (home.missionItem1Desc) document.getElementById('mission-item-1-desc').textContent = home.missionItem1Desc;
    if (home.missionItem1Icon) document.getElementById('mission-item-1-icon').textContent = home.missionItem1Icon;

    if (home.missionItem2Title) document.getElementById('mission-item-2-title').textContent = home.missionItem2Title;
    if (home.missionItem2Desc) document.getElementById('mission-item-2-desc').textContent = home.missionItem2Desc;
    if (home.missionItem2Icon) document.getElementById('mission-item-2-icon').textContent = home.missionItem2Icon;

    if (home.missionItem3Title) document.getElementById('mission-item-3-title').textContent = home.missionItem3Title;
    if (home.missionItem3Desc) document.getElementById('mission-item-3-desc').textContent = home.missionItem3Desc;
    if (home.missionItem3Icon) document.getElementById('mission-item-3-icon').textContent = home.missionItem3Icon;

    if (home.trailerEmbed) {
        const trailerContainer = document.getElementById('trailer-container');
        if (trailerContainer) {
            let embedHTML = home.trailerEmbed;

            // Convert plain URL to iframe if needed
            if (embedHTML.trim().startsWith('http') && !embedHTML.includes('<iframe')) {
                let videoId = '';
                if (embedHTML.includes('v=')) videoId = embedHTML.split('v=')[1].split('&')[0];
                else if (embedHTML.includes('be/')) videoId = embedHTML.split('be/')[1].split('?')[0];

                if (videoId) {
                    embedHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
                }
            }

            trailerContainer.innerHTML = embedHTML;
            const iframe = trailerContainer.querySelector('iframe');
            if (iframe) {
                let src = iframe.getAttribute('src');
                if (src) {
                    try {
                        // Handle protocol-relative URLs
                        const absoluteSrc = src.startsWith('//') ? 'https:' + src : src;
                        const url = new URL(absoluteSrc);

                        // Remove origin parameter which causes issues in local context (Error 153)
                        url.searchParams.delete('origin');

                        // Ensure we use https
                        if (url.protocol === 'http:') url.protocol = 'https:';

                        iframe.setAttribute('src', url.toString());
                    } catch (e) {
                        // If URL parsing fails, at least fix protocol-relative
                        if (src.startsWith('//')) {
                            iframe.setAttribute('src', 'https:' + src);
                        }
                    }
                }

                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                if (!iframe.hasAttribute('allowfullscreen')) iframe.setAttribute('allowfullscreen', 'true');

                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.minHeight = '450px';
                iframe.style.border = 'none';
                iframe.style.borderRadius = '16px';
            }
        }
    }
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
    // Gallery/BTS lightbox
    const images = window.SITE_DATA.btsImages || window.SITE_DATA.gallery;
    if (!images) return;
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
            <p style="color: white; text-align: center; margin-top: 10px;">${current.caption || ''}</p>
        </div>
    `;

    document.body.appendChild(modal);
}

// Carousel Logic
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;

    let currentSlide = 0;

    // Auto slide every 5 seconds
    setInterval(() => {
        const activeSlides = document.querySelectorAll('.carousel-slide');
        if (activeSlides.length === 0) return;

        activeSlides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % activeSlides.length;
        activeSlides[currentSlide].classList.add('active');
    }, 5000);
}

function renderContactPage() {
    const contact = window.SITE_DATA.contactPage;
    if (!contact) return;

    if (contact.headerTitle) document.getElementById('contact-header-title').textContent = contact.headerTitle;
    if (contact.headerDesc) document.getElementById('contact-header-desc').textContent = contact.headerDesc;
    if (contact.directEmail) {
        const emailContainer = document.getElementById('contact-email-container');
        if (emailContainer) {
            emailContainer.innerHTML = `Or email us directly at: <strong>${contact.directEmail}</strong>`;
        }
    }
}
