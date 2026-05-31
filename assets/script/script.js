// for fetch header in every page

fetch('/components/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('global-header-placeholder').innerHTML = data;

        // હેડર લોડ થયા પછી તેની અંદરની સ્ક્રિપ્ટ (Hamburger toggle, વગેરે) ને ફરીથી એક્ટિવેટ કરવી પડે
        initHeaderScripts();
    });




document.addEventListener("DOMContentLoaded", () => {
    // સાચો પાથ ચેક કરી લેવો (જો એક જ ફોલ્ડરમાં હોય તો './footer.html' લખવું વધુ સારું)
    fetch("/components/footer.html")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Footer ફાઈલ મળી નથી! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const container = document.getElementById("footer-container");
            if (container) {
                container.innerHTML = data;
                console.log("Footer successfully loaded!");
            } else {
                console.error("ભૂલ: HTML માં 'footer-container' આઈડી વાળો div મળ્યો નથી!");
            }
        })
        .catch(error => {
            console.error("Error loading footer:", error);
        });
});


function initHeaderScripts() {
    const menuToggle = document.getElementById('menuToggle');
    const navigationBar = document.getElementById('navigationBar');
    const productDropdownItem = document.getElementById('productDropdownItem');
    const mainHeader = document.getElementById('mainHeader');
    const subDropdownItems = document.querySelectorAll('.agro-dropdown-item');

    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle('open');
            navigationBar.classList.toggle('open');
        });
    }

    if (productDropdownItem) {
        productDropdownItem.querySelector('.agro-nav-link').addEventListener('click', (e) => {
            if (window.innerWidth <= 767) {
                e.preventDefault();
                productDropdownItem.classList.toggle('mobile-open');
            }
        });
    }

    subDropdownItems.forEach(item => {
        item.querySelector('.agro-dropdown-link').addEventListener('click', (e) => {
            if (window.innerWidth <= 767) {
                e.preventDefault();
                e.stopPropagation();
                subDropdownItems.forEach(sib => {
                    if (sib !== item) sib.classList.remove('mobile-sub-open');
                });
                item.classList.toggle('mobile-sub-open');
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (navigationBar && !navigationBar.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('open');
            navigationBar.classList.remove('open');
            productDropdownItem.classList.remove('mobile-open');
            subDropdownItems.forEach(item => item.classList.remove('mobile-sub-open'));
        }
    });

    window.addEventListener('scroll', () => {
        if (mainHeader) {
            if (window.scrollY > 50) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        }
    });
}




// for fetch the cursor in every page

// સિક્યોરલી cursor.html લોડ કરવાની સાચી રીત
fetch('/components/cursor.html')
    .then(response => response.text())
    .then(htmlData => {
        document.getElementById('global-cursor-placeholder').innerHTML = htmlData;
        // HTML લોડ થઈ ગયા પછી જ એનિમેશન એન્જીન ચાલુ થશે
        startSpiceCursorEngine();
    });

function startSpiceCursorEngine() {
    const coreDot = document.getElementById('agroCoreDot');
    const container = document.getElementById('agroParticleContainer');

    let mouse = { x: 0, y: 0 };
    let particles = [];

    // એવરફ્રેશ બ્રાન્ડ કલર્સ જે કણોમાં રેન્ડમલી બદલાશે (ઓરેન્જ, ડાર્ક ગ્રીન, લાઈટ ગ્રીન)
    const spiceColors = ['#fe8a03', '#0a551c', '#479f27', '#63cf3e'];

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // મેઈન ઓરેન્જ ડોટને માઉસની સાથે ઇન્સ્ટન્ટ ફેરવો
        if (coreDot) {
            coreDot.style.left = mouse.x + 'px';
            coreDot.style.top = mouse.y + 'px';
        }

        // જ્યારે માઉસ હલે ત્યારે નવા કણો (Particles) ઉત્પન્ન કરો
        if (particles.length < 25) { // Maximum particles on screen
            createSpiceParticle(mouse.x, mouse.y);
        }
    });

    function createSpiceParticle(x, y) {
        const p = document.createElement('div');
        p.className = 'agro-spice-particle';

        // જીરાના દાણા અને બારીક મસાલા જેવા અલગ-અલગ શેપ અને સાઈઝ
        const size = Math.random() * 5 + 3; // 3px to 8px
        const isCuminShape = Math.random() > 0.5; // Randomly make some capsule shaped like cumin seeds

        p.style.width = size + 'px';
        p.style.height = isCuminShape ? (size * 1.8) + 'px' : size + 'px';
        p.style.borderRadius = isCuminShape ? '4px' : '50%';
        p.style.backgroundColor = spiceColors[Math.floor(Math.random() * spiceColors.length)];

        // શરૂઆતની પોઝિશન
        p.style.left = x + 'px';
        p.style.top = y + 'px';

        container.appendChild(p);

        // કણોની સ્પીડ અને ડાયરેક્શન (હવામાં વિખરાતી વાઇબ આપવા)
        const forceX = (Math.random() - 0.5) * 2;
        const forceY = (Math.random() - 0.5) * 2;

        particles.push({
            element: p,
            x: x,
            y: y,
            vx: forceX,
            vy: forceY,
            alpha: 1,
            scale: 1,
            life: Math.random() * 30 + 20 // આયુષ્ય
        });
    }

    // સ્મૂથ 60fps રેન્ડરિંગ લૂપ
    function updateParticles() {
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.life--;

            if (p.life <= 0) {
                p.element.remove();
                particles.splice(i, 1);
                i--;
            } else {
                // કણો હવામાં ધીમેથી વિખરાશે અને નીચે તરફ બેસશે (ગ્રેવિટી ઇફેક્ટ)
                p.vx *= 0.95;
                p.vy *= 0.95;
                p.vy += 0.05; // ધીમો ઓર્ગેનિક ડ્રોપ

                p.x += p.vx;
                p.y += p.vy;

                p.alpha = p.life / 40; // ધીમેથી ગાયબ થશે (Fade out)

                p.element.style.left = p.x + 'px';
                p.element.style.top = p.y + 'px';
                p.element.style.opacity = p.alpha;
            }
        }
        requestAnimationFrame(updateParticles);
    }
    requestAnimationFrame(updateParticles);

    // ક્લિક અને હોવર ઇન્ટરેક્શન મેટ્રિક્સ
    document.addEventListener('mousedown', () => coreDot.classList.add('click-active'));
    document.addEventListener('mouseup', () => coreDot.classList.remove('click-active'));

    // સાઇટના બધા બટનો અને લિન્ક્સ પર મેગ્નેટિક રિસ્પોન્સ સેટ કરો
    function applyInteractiveHover() {
        const targets = document.querySelectorAll('a, button, .agro-card, .agro-matrix-box, .agro-social-icon-box');
        targets.forEach(t => {
            t.addEventListener('mouseenter', () => coreDot.classList.add('hover-active'));
            t.addEventListener('mouseleave', () => coreDot.classList.remove('hover-active'));
        });
    }

    applyInteractiveHover();

    // જો હેડર મોડ્યુલ Fetch થી આવતું હોય તો થોડીવાર પછી ફરીથી લિઝનર્સ રન કરો
    setTimeout(applyInteractiveHover, 1500);
}



//cursor tooltip js start

function startSpiceCursorEngine() {
    const coreDot = document.getElementById('agroCoreDot');
    const container = document.getElementById('agroParticleContainer');
    const tooltip = document.getElementById('agroCursorTooltip'); // નવી ટૂલટિપ મેળવો

    let mouse = { x: 0, y: 0 };
    let particles = [];
    const spiceColors = ['#fe8a03', '#0a551c', '#479f27', '#63cf3e'];

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // સેન્ટર ડોટને ફેરવો
        if (coreDot) {
            coreDot.style.left = mouse.x + 'px';
            coreDot.style.top = mouse.y + 'px';
        }

        // ✦ ટૂલટિપ માઉસ કો-ઓર્ડિનેટ્સની સાથે સ્મૂથલી ચાલશે
        if (tooltip) {
            tooltip.style.left = mouse.x + 'px';
            tooltip.style.top = mouse.y + 'px';
        }

        if (particles.length < 25) {
            createSpiceParticle(mouse.x, mouse.y);
        }
    });

    function createSpiceParticle(x, y) {
        const p = document.createElement('div');
        p.className = 'agro-spice-particle';
        const size = Math.random() * 5 + 3;
        const isCuminShape = Math.random() > 0.5;

        p.style.width = size + 'px';
        p.style.height = isCuminShape ? (size * 1.8) + 'px' : size + 'px';
        p.style.borderRadius = isCuminShape ? '4px' : '50%';
        p.style.backgroundColor = spiceColors[Math.floor(Math.random() * spiceColors.length)];
        p.style.left = x + 'px';
        p.style.top = y + 'px';

        container.appendChild(p);

        const forceX = (Math.random() - 0.5) * 2;
        const forceY = (Math.random() - 0.5) * 2;

        particles.push({
            element: p, x: x, y: y, vx: forceX, vy: forceY, alpha: 1, scale: 1,
            life: Math.random() * 30 + 20
        });
    }

    function updateParticles() {
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.life--;
            if (p.life <= 0) {
                p.element.remove();
                particles.splice(i, 1);
                i--;
            } else {
                p.vx *= 0.95; p.vy *= 0.95; p.vy += 0.05;
                p.x += p.vx; p.y += p.vy;
                p.alpha = p.life / 40;
                p.element.style.left = p.x + 'px';
                p.element.style.top = p.y + 'px';
                p.element.style.opacity = p.alpha;
            }
        }
        requestAnimationFrame(updateParticles);
    }
    requestAnimationFrame(updateParticles);

    // ✦ ફિક્સ અને અપડેટેડ: મલ્ટિપલ સેક્શન ઓબ્ઝર્વર લોજિક
    // querySelectorAll થી બધા જ .tooltipshowcase વાળા સેક્શન્સ એક સાથે લિસ્ટમાં મળશે
    const tooltipShowcaseSections = document.querySelectorAll('.tooltipshowcase');

    if (tooltipShowcaseSections.length > 0 && tooltip) {
        const observerOptions = {
            root: null,
            threshold: 0.15 // જ્યારે કોઈપણ સેક્શન ૧૫% સ્ક્રીન પર દેખાય ત્યારે
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // જો યૂઝર કોઈપણ .tooltipshowcase સેક્શનની અંદર હોય તો ટૂલટિપ દેખાશે
                    tooltip.classList.add('visible-active');
                } else {
                    // બહાર નીકળતા જ ચેક કરશે કે બીજા કોઈ બચેલા સેક્શનમાં તો એક્ટિવ નથી ને?
                    // આ સેફ્ટી ચેક બે સેક્શન્સ વચ્ચે ફ્લિકરિંગ (ઝબકારા) થવા નહીં દે
                    let stillInAnySection = false;
                    entries.forEach(e => {
                        if (e.isIntersecting) stillInAnySection = true;
                    });

                    if (!stillInAnySection) {
                        tooltip.classList.remove('visible-active');
                    }
                }
            });
        }, observerOptions);

        // લૂપ ફેરવીને બધા જ .tooltipshowcase વાળા સેક્શન્સને એક સાથે ઓબ્ઝર્વ કરવા માટે લોક કર્યા
        tooltipShowcaseSections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // ક્લિક ઇન્ટરેક્શન
    document.addEventListener('mousedown', () => { if (coreDot) coreDot.classList.add('click-active') });
    document.addEventListener('mouseup', () => { if (coreDot) coreDot.classList.remove('click-active') });

    function applyInteractiveHover() {
        const targets = document.querySelectorAll('a, button, .agro-card, .agro-matrix-box, .agro-social-icon-box');
        targets.forEach(t => {
            t.addEventListener('mouseenter', () => { if (coreDot) coreDot.classList.add('hover-active') });
            t.addEventListener('mouseleave', () => { if (coreDot) coreDot.classList.remove('hover-active') });
        });
    }
    applyInteractiveHover();
    setTimeout(applyInteractiveHover, 1500);
}
// cursor tooltip js over

//home section 3 js start

document.addEventListener("DOMContentLoaded", function () {
    const aboutContent = document.querySelector('.about-content-block');
    const aboutMedia = document.querySelector('.media-wrapper');

    // શરૂઆતમાં બંને બ્લોકને થોડા નીચે અને અદ્રશ્ય રાખવા માટે CSS ઓન ધ ફ્લાય આપવી
    if (aboutContent && aboutMedia) {
        aboutContent.style.opacity = "0";
        aboutContent.style.transform = "translateY(40px)";
        aboutContent.style.transition = "all 0.8s cubic-bezier(0.25, 1, 0.5, 1)";

        aboutMedia.style.opacity = "0";
        aboutMedia.style.transform = "scale(0.95) translateY(30px)";
        aboutMedia.style.transition = "all 1s cubic-bezier(0.25, 1, 0.5, 1) 0.2s";
    }

    const observerOptions = {
        root: null,
        threshold: 0.2 // જ્યારે સેક્શન 20% દેખાય ત્યારે એનિમેશન શરુ થશે
    };

    const aboutObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // સ્ક્ર્રોલ કરતાની સાથે જ એનિમેશન ટ્રિગર થશે
                aboutContent.style.opacity = "1";
                aboutContent.style.transform = "translateY(0)";

                aboutMedia.style.opacity = "1";
                aboutMedia.style.transform = "scale(1) translateY(0)";

                observer.unobserve(entry.target); // એકવાર એનિમેશન થયા પછી સ્ટોપ કરો
            }
        });
    }, observerOptions);

    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
        aboutObserver.observe(aboutSection);
    }
});

// home section 3 js over/


// home section 4 js

document.addEventListener("DOMContentLoaded", function () {
    const track1 = document.querySelector('.track-1');

    let currentPos = 0;
    let targetPos = 0;
    let scrollSpeed = 0.08; // એનિમેશન સ્મૂથનેસ કંટ્રોલ કરવા

    window.addEventListener('scroll', function () {
        // વિન્ડોનું કરંટ સ્ક્ર્રોલ પોઝિશન મેળવો
        let scrollY = window.scrollY;

        // સ્ક્ર્રોલ ના આધારે ટાર્ગેટ પોઝિશન નક્કી કરો (તમે સ્પીડ વધારવા મલ્ટિપ્લાય કરી શકો)
        targetPos = scrollY * 0.4;
    });

    function animateMarquee() {
        // સ્મૂથ ઇનર્શિયા (Lerp) ઇફેક્ટ જેથી આંચકા વગર ચાલે
        currentPos += (targetPos - currentPos) * scrollSpeed;

        if (track1) {
            // TranslateX ની મદદથી ટ્રેક આગળ પાછળ થશે
            track1.style.transform = `translateX(-${currentPos % 500}px)`;
        }

        // રિકર્સિવ લૂપ સતત ચલાવવા માટે
        requestAnimationFrame(animateMarquee);
    }

    // એનિમેશન શરૂ કરો
    animateMarquee();
});

// home section 4 js over



// home section 5 circluar slider 

document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.getElementById("carousel3d");
    const cards = document.querySelectorAll(".carousel-card");

    let cardCount = cards.length;

    // ગણિત: કાર્ડની સંખ્યા મુજબ ત્રિજ્યા (Radius) નક્કી કરો જેથી સર્કલ પ્રોપર બને
    // 5 કાર્ડ માટે 260px થી 300px ની ત્રિજ્યા બેસ્ટ રહેશે
    let radius = 320;
    let angleStep = 360 / cardCount;

    let currentRotation = 0;
    let rotationSpeed = 0.15; // રોટેશન સ્પીડ (તમે અહીંથી વધારી-ઘટાડી શકો છો)
    let isHovered = false;

    // 1. બધા જ કાર્ડ્સને 3D સ્પેસમાં ગોળાકાર ગોઠવો
    cards.forEach((card, i) => {
        let cardAngle = i * angleStep;
        // દરેક કાર્ડને તેના એંગલ પર ફેરવીને ત્રિજ્યા જેટલું પાછળ/આગળ (translateZ) ધકેલો
        card.style.transform = `rotateY(${cardAngle}deg) translateZ(${radius}px)`;
    });

    // 2. Continuous Infinite Animation Loop (અનંત લૂપ)
    function updateCarousel() {
        if (!isHovered) {
            currentRotation += rotationSpeed; // સતત ડિગ્રી પ્લસ થશે
            carousel.style.transform = `rotateY(${currentRotation}deg)`;

            // પાછળ જતા કાર્ડ્સ ઉલ્ટા ન દેખાય અને હંમેશાં યૂઝરની સામે સીધા રહે તે માટે ફેસિંગ લોક કરો
            cards.forEach((card, i) => {
                let cardAngle = i * angleStep;
                let innerGlass = card.querySelector('.card-glass');
                // રિવર્સ રોટેશન જેથી ટેક્સ્ટ હંમેશા ચત્તો વંચાય
                if (innerGlass) {
                    innerGlass.style.transform = `rotateY(${- (currentRotation + cardAngle)}deg)`;
                }
            });
        }
        // બ્રાઉઝર ગ્રાફિક્સ કાર્ડ લૂપ
        requestAnimationFrame(updateCarousel);
    }

    // 3. હોવર કંટ્રોલ (માઉસ લાવતા જ આખું ચક્ર સ્મૂથલી અટકી જશે)
    cards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            isHovered = true;
        });
        card.addEventListener("mouseleave", () => {
            isHovered = false;
        });
    });

    // એનિમેશન શરૂ કરો
    updateCarousel();
});

// home section 5 js over




// home section 6 js start

window.onload = function () {
    const track = document.getElementById("sliderTrack");
    const originalCards = track.querySelectorAll(".arch-card");
    let originalCount = originalCards.length;

    // 1. INFINITE LOOP SETUP
    originalCards.forEach(card => {
        let clone = card.cloneNode(true);
        track.appendChild(clone);
    });

    let speed = 1.0;
    let position = 0;
    let isHovered = false;

    let screenCenter = window.innerWidth / 2;

    function getCardWidth() {
        let firstCard = track.querySelector(".arch-card");
        let style = window.getComputedStyle(firstCard);
        return firstCard.offsetWidth + parseInt(style.marginRight);
    }

    // 2. MAIN ANIMATION LOOP
    function animateSlider() {
        if (!isHovered) {
            position -= speed;

            let cardWidth = getCardWidth();
            let originalWidth = cardWidth * originalCount;

            if (Math.abs(position) >= originalWidth) {
                position = 0;
            }

            track.style.transform = `translateX(${position}px) translateY(-50%)`;

            // 3. RESPONSIVE LAYER (મોબાઈલ અને ડેસ્કટોપ કન્ડિશન ચેક)
            const allCards = track.querySelectorAll(".arch-card");

            allCards.forEach(card => {
                // જો સ્ક્રીન સાઈઝ 768px થી મોટી હોય (Desktop) તો જ કર્વ આપવો
                if (window.innerWidth > 768) {
                    let rect = card.getBoundingClientRect();
                    let cardCenter = rect.left + (rect.width / 2);

                    let distanceFromCenter = cardCenter - screenCenter;
                    let normalizedDistance = distanceFromCenter / screenCenter;

                    if (rect.right > -100 && rect.left < window.innerWidth + 100) {
                        let curveIntensity = Math.pow(Math.abs(normalizedDistance), 1.5);
                        let translateY = curveIntensity * 280;
                        let rotateZ = normalizedDistance * 18;

                        card.style.transform = `translateY(${translateY}px) rotate(${rotateZ}deg)`;
                    }
                } else {
                    // 📱 જો મોબાઇલ સ્ક્રીન હોય તો ગણિત રીસેટ કરીને એકદમ સીધું (Straight Line) રાખવું
                    card.style.transform = "none";
                }
            });
        }
        requestAnimationFrame(animateSlider);
    }

    // HOVER CONTROLS
    track.addEventListener("mouseenter", () => { isHovered = true; });
    track.addEventListener("mouseleave", () => { isHovered = false; });

    // સ્ક્રીન નાની-મોટી થાય ત્યારે સેન્ટર અપડેટ કરવું
    window.addEventListener("resize", () => {
        screenCenter = window.innerWidth / 2;
    });

    animateSlider();
};

// home section 6 js over


// home section 8 js start
document.addEventListener("DOMContentLoaded", function () {
    const titleElement = document.getElementById("changing-title");
    const imgBoxes = document.querySelectorAll(".ef-img-box");

    function updateTextWithAnimation(newText, textColor) {
        titleElement.innerHTML = "";
        titleElement.style.color = textColor;

        const letters = newText.split("");

        letters.forEach((char, index) => {
            const span = document.createElement("span");
            span.textContent = char === " " ? "\u00A0" : char;
            span.classList.add("ef-letter");
            span.style.animationDelay = `${index * 0.03}s`;
            titleElement.appendChild(span);
        });
    }

    updateTextWithAnimation("EVERFRESH", "#ffffff");

    imgBoxes.forEach(box => {
        box.addEventListener("mouseenter", function () {
            const textToSet = this.getAttribute("data-text");
            const colorToSet = this.getAttribute("data-color");
            updateTextWithAnimation(textToSet, colorToSet);
        });
    });
});

/* section 8 js over */

// section 10 js start 

//   <!-- --- ✦ SMART JS FOR PROGRESSIVE TEXT REVEAL ✦ --- -->
const track = document.getElementById('revealTrack');
const mediaBox = document.getElementById('mediaBox');

// ત્રણેય કન્ટેન્ટ બ્લોક્સ
const block1 = document.getElementById('block1');
const block2 = document.getElementById('block2');
const block3 = document.getElementById('block3');

window.addEventListener('scroll', () => {
    const trackRect = track.getBoundingClientRect();
    const trackTop = trackRect.top;
    const trackHeight = trackRect.height;
    const windowHeight = window.innerHeight;

    // સ્ક્રૉલ પ્રોગ્રેસ રેશિયો (0 થી 1)
    if (trackTop <= 0 && Math.abs(trackTop) <= trackHeight - windowHeight) {
        const progress = Math.abs(trackTop) / (trackHeight - windowHeight);

        // રિસ્પોન્સિવ વિડ્થ ગણતરી (મોબાઈલ માટે ચેક)
        const isMobile = window.innerWidth <= 992;
        const startWidth = isMobile ? 260 : 320;
        const startHeight = isMobile ? 260 : 320;
        const startRadius = 24;

        // વિડિયો એક્સપાન્ડ લોજિક
        const currentWidth = startWidth + (window.innerWidth - startWidth) * Math.min(progress * 1.5, 1);
        const currentHeight = startHeight + (window.innerHeight - startHeight) * Math.min(progress * 1.5, 1);
        const currentRadius = startRadius - (startRadius * Math.min(progress * 1.5, 1));

        mediaBox.style.width = `${currentWidth}px`;
        mediaBox.style.height = `${currentHeight}px`;
        mediaBox.style.borderRadius = `${currentRadius}px`;

        // ✦ ટેક્સ્ટ વન-બાય-વન શો કરવાનું એડવાન્સ લોજિક ✦
        // વિડિયો 100% ફૂલ સ્ક્રીન થયા પછી જ ટેક્સ્ટ શરૂ થશે

        // પહેલો બ્લોક શો કરો
        if (progress >= 0.50) {
            block1.classList.add('show');
        } else {
            block1.classList.remove('show');
        }

        // બીજો બ્લોક શો કરો
        if (progress >= 0.70) {
            block2.classList.add('show');
        } else {
            block2.classList.remove('show');
        }

        // ત્રીજો બ્લોક શો કરો
        if (progress >= 0.90) {
            block3.classList.add('show');
        } else {
            block3.classList.remove('show');
        }
    }
    // સેક્શનની ઉપર હોય ત્યારે બધું રીસેટ કરવું
    else if (trackTop > 0) {
        const isMobile = window.innerWidth <= 992;
        mediaBox.style.width = isMobile ? "260px" : "320px";
        mediaBox.style.height = isMobile ? "260px" : "260px";
        mediaBox.style.borderRadius = "24px";

        block1.classList.remove('show');
        block2.classList.remove('show');
        block3.classList.remove('show');
    }
});


// section 10 js over