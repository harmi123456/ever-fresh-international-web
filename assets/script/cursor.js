
const coreDot =
    document.getElementById(
        "agroCoreDot"
    );

const tooltip =
    document.getElementById(
        "agroCursorTooltip"
    );

const messages = [
    "Keep Scrolling...",
    "Discover Premium Quality...",
    "Exporting Worldwide...",
    "Trusted By Global Buyers...",
    "Explore Our Products...",
    "Ready For Your Next Order?"
];

let currentMessage = 0;

/* =========================
   MOUSE FOLLOW
========================= */

document.addEventListener(
    "mousemove",
    (e) => {

        coreDot.style.left =
            e.clientX + "px";

        coreDot.style.top =
            e.clientY + "px";

        tooltip.style.left =
            e.clientX + "px";

        tooltip.style.top =
            e.clientY + "px";

    }
);

/* =========================
   CLICK EFFECT
========================= */

document.addEventListener(
    "mousedown",
    () => {

        coreDot.classList.add(
            "click-active"
        );

    }
);

document.addEventListener(
    "mouseup",
    () => {

        coreDot.classList.remove(
            "click-active"
        );

    }
);

/* =========================
   HOVER EFFECT
========================= */

function applyHoverEffects() {

    const targets =
        document.querySelectorAll(
            'a, button, .agro-card, .agro-matrix-box, .agro-social-icon-box'
        );

    targets.forEach(item => {

        item.addEventListener(
            "mouseenter",
            () => {

                coreDot.classList.add(
                    "hover-active"
                );

            }
        );

        item.addEventListener(
            "mouseleave",
            () => {

                coreDot.classList.remove(
                    "hover-active"
                );

            }
        );

    });

}

applyHoverEffects();

setTimeout(
    applyHoverEffects,
    1500
);

/* =========================
   TEXT ROTATION
========================= */

setInterval(() => {

    if (
        tooltip.classList.contains(
            "visible-active"
        )
    ) {

        currentMessage++;

        if (
            currentMessage >=
            messages.length
        ) {

            currentMessage = 0;

        }

        tooltip.textContent =
            messages[currentMessage];

    }

}, 3000);

/* =========================
   SHOW FROM 5TH SECTION
========================= */

const sections =
    document.querySelectorAll(
        "section"
    );

if (
    sections.length >= 5
) {

    const fifthSection =
        sections[4];

    const observer =
        new IntersectionObserver(

            (entries) => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        tooltip.classList.add(
                            "visible-active"
                        );

                    }

                });

            },

            {
                threshold: .25
            }

        );

    observer.observe(
        fifthSection
    );

}

/* =========================
   HIDE AT FOOTER
========================= */

const footer =
    document.querySelector(
        "footer"
    );

if (footer) {

    const footerObserver =
        new IntersectionObserver(

            (entries) => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        tooltip.classList.remove(
                            "visible-active"
                        );

                    }
                    else {

                        if (
                            window.scrollY >
                            sections[4].offsetTop
                        ) {

                            tooltip.classList.add(
                                "visible-active"
                            );

                        }

                    }

                });

            },

            {
                threshold: .1
            }

        );

    footerObserver.observe(
        footer);

}
