/* =========================================================
   FIXMYCITY - MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   INDIAN / MUMBAI DEMO IMAGES
========================================================= */

const IMAGE_LIBRARY = {

    city:
        "https://images.unsplash.com/photo-1784803537675-ee9273a61b38?auto=format&fit=crop&w=1600&q=85",

    cityNight:
        "https://images.unsplash.com/photo-1769271972348-429a8ad18f51?auto=format&fit=crop&w=1600&q=85",

    street:
        "https://images.unsplash.com/photo-1784803537675-ee9273a61b38?auto=format&fit=crop&w=1400&q=85",

    rainRoad:
        "https://images.unsplash.com/photo-1712852519360-c37b75a0eddf?auto=format&fit=crop&w=1400&q=85",

    garbage:
        "https://images.unsplash.com/photo-1762805544550-f12a8ebceb2e?auto=format&fit=crop&w=1400&q=85",

    streetLight:
        "https://images.unsplash.com/photo-1670948351730-0afd343abebf?auto=format&fit=crop&w=1400&q=85",

    park:
        "https://images.unsplash.com/photo-1708101312087-dd35dcbb41b9?auto=format&fit=crop&w=1400&q=85",

    greenRoad:
        "https://images.unsplash.com/photo-1751973398959-277d8d6502bf?auto=format&fit=crop&w=1400&q=85"
};


/* =========================================================
   DEMO ISSUES
========================================================= */

const DEFAULT_ISSUES = [

    {
        id: "FM001",

        title: "Large pothole near residential road",

        category: "Roads & Potholes",

        description:
            "A large pothole has developed on the road and is creating difficulty for two-wheelers, cars and pedestrians.",

        location:
            "Dombivli East, Maharashtra",

        status:
            "In Progress",

        date:
            "2026-09-12",

        department:
            "Road Maintenance Department",

        image:
            IMAGE_LIBRARY.rainRoad,

        lat:
            19.2167,

        lng:
            73.0861
    },


    {
        id: "FM002",

        title: "Garbage accumulation near market",

        category: "Garbage & Cleanliness",

        description:
            "Waste has accumulated near a busy market area and requires municipal collection and cleaning.",

        location:
            "Thane West, Maharashtra",

        status:
            "Under Review",

        date:
            "2026-09-10",

        department:
            "Solid Waste Management",

        image:
            IMAGE_LIBRARY.garbage,

        lat:
            19.2183,

        lng:
            72.9781
    },


    {
        id: "FM003",

        title: "Streetlights not working",

        category:
            "Streetlights",

        description:
            "Several streetlights are not functioning after sunset, leaving a section of the road poorly illuminated.",

        location:
            "Kalyan West, Maharashtra",

        status:
            "Reported",

        date:
            "2026-09-09",

        department:
            "Electrical Department",

        image:
            IMAGE_LIBRARY.streetLight,

        lat:
            19.2403,

        lng:
            73.1305
    },


    {
        id: "FM004",

        title: "Waterlogging after heavy rain",

        category:
            "Water & Drainage",

        description:
            "Rainwater remains accumulated on the roadside because of insufficient drainage flow.",

        location:
            "Andheri East, Mumbai",

        status:
            "In Progress",

        date:
            "2026-09-08",

        department:
            "Storm Water Drain Department",

        image:
            IMAGE_LIBRARY.rainRoad,

        lat:
            19.1197,

        lng:
            72.8468
    },


    {
        id: "FM005",

        title: "Damaged public park facility",

        category:
            "Parks & Public Places",

        description:
            "A public park facility requires maintenance and repair to make the area safer for residents.",

        location:
            "Powai, Mumbai",

        status:
            "Resolved",

        date:
            "2026-09-04",

        department:
            "Parks Department",

        image:
            IMAGE_LIBRARY.park,

        lat:
            19.1176,

        lng:
            72.9060
    },


    {
        id: "FM006",

        title: "Poorly illuminated public road",

        category:
            "Public Safety",

        description:
            "The road has insufficient lighting during evening hours and residents have requested better illumination.",

        location:
            "Navi Mumbai, Maharashtra",

        status:
            "Under Review",

        date:
            "2026-09-02",

        department:
            "Public Safety Department",

        image:
            IMAGE_LIBRARY.streetLight,

        lat:
            19.0330,

        lng:
            73.0297
    }

];


/* =========================================================
   APPLICATION STATE
========================================================= */

let issues = [];

let googleMap = null;

let reportMap = null;

let reportMarker = null;

let issueMarkers = [];

let mapInfoWindow = null;


/* =========================================================
   INITIALIZE APP
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadIssues();

    setupNavigation();

    setupIssueFilters();

    setupReportForm();

    setupImagePreview();

    setupContactForm();

    setupLogin();

    setupModals();

    setupCategoryLinks();

    setupSearchButton();

    setupCurrentLocationButton();

    setDefaultDateTime();

    renderIssues();

    updateStatistics();

    loadGoogleMapsApi();

});


/* =========================================================
   GOOGLE MAPS - RUNTIME KEY LOADER
   The key comes from config.js (built from the
   GOOGLE_MAPS_API_KEY environment variable).
======================================================== */

function loadGoogleMapsApi() {

    const key =
        window.APP_CONFIG &&
        window.APP_CONFIG.GOOGLE_MAPS_API_KEY
            ? String(
                window.APP_CONFIG.GOOGLE_MAPS_API_KEY
            ).trim()
            : "";


    if (!key) {

        showMapsPlaceholder(
            "Maps unavailable",
            "The Google Maps API key is not configured."
        );

        return;

    }


    const script = document.createElement("script");

    script.src =
        "https://maps.googleapis.com/maps/api/js?key=" +
        encodeURIComponent(key) +
        "&callback=initGoogleMap";

    script.async = true;
    script.defer = true;

    script.onerror = () => {
        showMapsPlaceholder(
            "Map failed to load",
            "Check the Google Maps API key and its referrer restrictions."
        );
    };

    document.head.appendChild(script);

}


function showMapsPlaceholder(title, message) {

    const targets = [
        document.getElementById("googleMap"),
        document.getElementById("reportMap")
    ];

    targets.forEach(target => {

        if (!target) {
            return;
        }

        target.innerHTML =
            '<div class="map-placeholder">' +
            "<strong>" +
            escapeHTML(title) +
            "</strong>" +
            "<span>" +
            escapeHTML(message) +
            "</span>" +
            "</div>";

    });

}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function loadIssues() {

    const storedIssues =
        localStorage.getItem("fixMyCityIssues");

    if (storedIssues) {

        try {

            issues = JSON.parse(storedIssues);

        } catch (error) {

            issues = [...DEFAULT_ISSUES];

        }

    } else {

        issues = [...DEFAULT_ISSUES];

        saveIssues();

    }

}


function saveIssues() {

    localStorage.setItem(
        "fixMyCityIssues",
        JSON.stringify(issues)
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    const mobileButton =
        document.getElementById("mobileMenuButton");

    const mainNav =
        document.getElementById("mainNav");

    if (!mobileButton || !mainNav) {
        return;
    }

    mobileButton.addEventListener("click", () => {

        mainNav.classList.toggle("open");

    });


    document.querySelectorAll(".nav-link").forEach(link => {

        link.addEventListener("click", () => {

            mainNav.classList.remove("open");

        });

    });

}


/* =========================================================
   SEARCH BUTTON
========================================================= */

function setupSearchButton() {

    const button =
        document.getElementById("navSearchButton");

    const search =
        document.getElementById("issueSearch");

    if (!button || !search) {
        return;
    }

    button.addEventListener("click", () => {

        document
            .getElementById("issues")
            .scrollIntoView({
                behavior: "smooth"
            });

        setTimeout(() => {

            search.focus();

        }, 500);

    });

}


/* =========================================================
   CATEGORY LINKS
========================================================= */

function setupCategoryLinks() {

    document
        .querySelectorAll("[data-category-link]")
        .forEach(link => {

            link.addEventListener("click", () => {

                const category =
                    link.dataset.categoryLink;

                const categorySelect =
                    document.getElementById("issueCategory");

                if (categorySelect) {

                    categorySelect.value = category;

                }

            });

        });

}


/* =========================================================
   DEFAULT DATE / TIME
========================================================= */

function setDefaultDateTime() {

    const dateInput =
        document.getElementById("issueDate");

    const timeInput =
        document.getElementById("issueTime");

    if (!dateInput || !timeInput) {
        return;
    }

    const now = new Date();

    const date =
        now.toISOString().split("T")[0];

    const time =
        now.toTimeString().slice(0, 5);

    dateInput.value = date;

    timeInput.value = time;

}


/* =========================================================
   ISSUE FILTERS
========================================================= */

function setupIssueFilters() {

    const searchInput =
        document.getElementById("issueSearch");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const statusFilter =
        document.getElementById("statusFilter");


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderIssues
        );

    }


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            renderIssues
        );

    }


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            renderIssues
        );

    }

}


/* =========================================================
   RENDER ISSUES
========================================================= */

function renderIssues() {

    const grid =
        document.getElementById("issuesGrid");

    const emptyState =
        document.getElementById("emptyState");

    if (!grid) {
        return;
    }

    const search =
        document
            .getElementById("issueSearch")
            ?.value
            .toLowerCase()
            .trim() || "";


    const category =
        document
            .getElementById("categoryFilter")
            ?.value || "all";


    const status =
        document
            .getElementById("statusFilter")
            ?.value || "all";


    const filteredIssues =
        issues.filter(issue => {

            const matchesSearch =
                !search ||

                issue.title
                    .toLowerCase()
                    .includes(search) ||

                issue.location
                    .toLowerCase()
                    .includes(search) ||

                issue.category
                    .toLowerCase()
                    .includes(search);


            const matchesCategory =
                category === "all" ||
                issue.category === category;


            const matchesStatus =
                status === "all" ||
                issue.status === status;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            );

        });


    grid.innerHTML =
        filteredIssues
            .map(createIssueCard)
            .join("");


    if (emptyState) {

        emptyState.style.display =
            filteredIssues.length
                ? "none"
                : "block";

    }


    document
        .querySelectorAll(".issue-details-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.issueId;

                    openIssueModal(id);

                }
            );

        });

}


/* =========================================================
   CREATE ISSUE CARD
========================================================= */

function createIssueCard(issue) {

    const statusClass =
        issue.status
            .toLowerCase()
            .replaceAll(" ", "-");


    return `

        <article class="issue-card">

            <div class="issue-card-image">

                <img
                    src="${escapeHTML(issue.image)}"
                    alt="${escapeHTML(issue.title)}"
                    loading="lazy"
                >

                <span
                    class="issue-status status-${statusClass}"
                >
                    ${escapeHTML(issue.status)}
                </span>

            </div>


            <div class="issue-card-body">

                <span class="issue-category">
                    ${escapeHTML(issue.category)}
                </span>

                <h3>
                    ${escapeHTML(issue.title)}
                </h3>

                <p class="issue-location">
                    ${escapeHTML(issue.location)}
                </p>


                <div class="issue-footer">

                    <span class="issue-date">
                        ${formatDate(issue.date)}
                    </span>

                    <button
                        class="issue-details-button"
                        data-issue-id="${escapeHTML(issue.id)}"
                    >
                        View Details
                    </button>

                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   ISSUE MODAL
========================================================= */

function setupModals() {

    const issueModal =
        document.getElementById("issueModal");

    const loginModal =
        document.getElementById("loginModal");

    const modalClose =
        document.getElementById("modalClose");

    const loginClose =
        document.getElementById("loginModalClose");


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            () => closeModal(issueModal)
        );

    }


    if (loginClose) {

        loginClose.addEventListener(
            "click",
            () => closeModal(loginModal)
        );

    }


    document
        .querySelectorAll(".modal-backdrop")
        .forEach(backdrop => {

            backdrop.addEventListener(
                "click",
                () => {

                    const modal =
                        backdrop.closest(".modal");

                    closeModal(modal);

                }
            );

        });


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                document
                    .querySelectorAll(".modal.open")
                    .forEach(closeModal);

            }

        }
    );

}


function openIssueModal(id) {

    const issue =
        issues.find(item => item.id === id);

    if (!issue) {
        return;
    }

    const modal =
        document.getElementById("issueModal");

    const body =
        document.getElementById("modalBody");

    if (!modal || !body) {
        return;
    }


    const stages = [
        "Reported",
        "Verified",
        "Assigned",
        "In Progress",
        "Resolved"
    ];


    const stageIndex =
        getStageIndex(issue.status);


    body.innerHTML = `

        <img
            class="modal-image"
            src="${escapeHTML(issue.image)}"
            alt="${escapeHTML(issue.title)}"
        >


        <span class="eyebrow">
            ${escapeHTML(issue.category)}
        </span>


        <h2>
            ${escapeHTML(issue.title)}
        </h2>


        <p class="modal-description">
            ${escapeHTML(issue.description)}
        </p>


        <div class="modal-meta">

            <div>
                <strong>Issue ID</strong>
                <span>${escapeHTML(issue.id)}</span>
            </div>

            <div>
                <strong>Status</strong>
                <span>${escapeHTML(issue.status)}</span>
            </div>

            <div>
                <strong>Location</strong>
                <span>${escapeHTML(issue.location)}</span>
            </div>

            <div>
                <strong>Department</strong>
                <span>${escapeHTML(issue.department)}</span>
            </div>

            <div>
                <strong>Reported</strong>
                <span>${formatDate(issue.date)}</span>
            </div>

        </div>


        <h3>
            Complaint progress
        </h3>


        <div class="tracking">

            ${stages.map((stage, index) => {

                const completed =
                    index <= stageIndex
                        ? "completed"
                        : "";

                return `

                    <div
                        class="tracking-step ${completed}"
                    >

                        <div class="tracking-dot">
                            ${index + 1}
                        </div>

                        <span>
                            ${stage}
                        </span>

                    </div>

                `;

            }).join("")}

        </div>

    `;


    openModal(modal);

}


function getStageIndex(status) {

    const map = {

        "Reported": 0,

        "Under Review": 1,

        "In Progress": 3,

        "Resolved": 4

    };

    return map[status] ?? 0;

}


/* =========================================================
   MODAL HELPERS
========================================================= */

function openModal(modal) {

    if (!modal) {
        return;
    }

    modal.classList.add("open");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";

}


function closeModal(modal) {

    if (!modal) {
        return;
    }

    modal.classList.remove("open");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";

}


/* =========================================================
   REPORT FORM
========================================================= */

function setupReportForm() {

    const form =
        document.getElementById("issueForm");

    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const title =
                document.getElementById("issueTitle").value.trim();

            const category =
                document.getElementById("issueCategory").value;

            const description =
                document.getElementById("issueDescription").value.trim();

            const location =
                document.getElementById("issueLocation").value.trim();

            const date =
                document.getElementById("issueDate").value;

            const latitude =
                parseFloat(
                    document.getElementById("issueLatitude").value
                );

            const longitude =
                parseFloat(
                    document.getElementById("issueLongitude").value
                );

            const imageInput =
                document.getElementById("issueImage");


            let image =
                getCategoryFallbackImage(category);


            if (
                imageInput.files &&
                imageInput.files[0]
            ) {

                image =
                    await readFileAsDataURL(
                        imageInput.files[0]
                    );

            }


            const newIssue = {

                id:
                    generateIssueId(),

                title,

                category,

                description,

                location,

                status:
                    "Reported",

                date,

                department:
                    "Municipal Department",

                image,

                lat:
                    Number.isFinite(latitude)
                        ? latitude
                        : null,

                lng:
                    Number.isFinite(longitude)
                        ? longitude
                        : null

            };


            issues.unshift(newIssue);

            saveIssues();

            renderIssues();

            updateStatistics();

            renderGoogleMapMarkers();

            form.reset();

            document.getElementById(
                "imagePreview"
            ).innerHTML = "";

            document.getElementById(
                "imagePreview"
            ).style.display = "none";


            showToast(
                `Report submitted successfully. Issue ID: ${newIssue.id}`
            );


            document
                .getElementById("issues")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );

}


/* =========================================================
   IMAGE PREVIEW
========================================================= */

function setupImagePreview() {

    const input =
        document.getElementById("issueImage");

    const preview =
        document.getElementById("imagePreview");

    if (!input || !preview) {
        return;
    }


    input.addEventListener(
        "change",
        () => {

            const file =
                input.files?.[0];

            if (!file) {

                preview.innerHTML = "";

                preview.style.display = "none";

                return;

            }


            const reader =
                new FileReader();


            reader.onload = event => {

                preview.innerHTML = `

                    <img
                        src="${event.target.result}"
                        alt="Selected issue photo"
                    >

                `;

                preview.style.display = "block";

            };


            reader.readAsDataURL(file);

        }
    );

}


/* =========================================================
   CURRENT LOCATION
========================================================= */

function setupCurrentLocationButton() {

    const button =
        document.getElementById(
            "currentLocationButton"
        );

    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            if (!navigator.geolocation) {

                showToast(
                    "Geolocation is not supported by this browser."
                );

                return;

            }


            button.textContent =
                "Locating...";


            navigator.geolocation.getCurrentPosition(

                position => {

                    const lat =
                        position.coords.latitude;

                    const lng =
                        position.coords.longitude;


                    setReportLocation(
                        lat,
                        lng
                    );


                    button.textContent =
                        "Use my current location";


                    showToast(
                        "Your location has been added to the report."
                    );

                },

                () => {

                    button.textContent =
                        "Use my current location";


                    showToast(
                        "Unable to access your location."
                    );

                }

            );

        }
    );

}


/* =========================================================
   GOOGLE MAPS INITIALIZATION
========================================================= */

function initGoogleMap() {

    initializeMainMap();

    initializeReportMap();

}


/* =========================================================
   MAIN GOOGLE MAP
========================================================= */

function initializeMainMap() {

    const mapElement =
        document.getElementById("googleMap");

    if (!mapElement) {
        return;
    }


    googleMap =
        new google.maps.Map(
            mapElement,
            {

                center: {
                    lat: 19.0760,
                    lng: 72.8777
                },

                zoom: 11,

                mapTypeControl: false,

                streetViewControl: false,

                fullscreenControl: true,

                zoomControl: true

            }
        );


    mapInfoWindow =
        new google.maps.InfoWindow();


    renderGoogleMapMarkers();


    const filter =
        document.getElementById(
            "mapCategoryFilter"
        );


    if (filter) {

        filter.addEventListener(
            "change",
            renderGoogleMapMarkers
        );

    }

}


/* =========================================================
   REPORT LOCATION MAP
========================================================= */

function initializeReportMap() {

    const mapElement =
        document.getElementById("reportMap");

    if (!mapElement) {
        return;
    }


    reportMap =
        new google.maps.Map(
            mapElement,
            {

                center: {
                    lat: 19.0760,
                    lng: 72.8777
                },

                zoom: 11,

                mapTypeControl: false,

                streetViewControl: false,

                fullscreenControl: false

            }
        );


    reportMarker =
        new google.maps.Marker({

            map: reportMap,

            position: {
                lat: 19.0760,
                lng: 72.8777
            },

            draggable: true,

            title:
                "Drag this marker to the issue location"

        });


    reportMarker.addListener(
        "dragend",
        event => {

            setReportLocation(
                event.latLng.lat(),
                event.latLng.lng()
            );

        }
    );


    setReportLocation(
        19.0760,
        72.8777
    );

}


/* =========================================================
   SET REPORT LOCATION
========================================================= */

function setReportLocation(lat, lng) {

    const latitude =
        document.getElementById(
            "issueLatitude"
        );

    const longitude =
        document.getElementById(
            "issueLongitude"
        );


    if (latitude) {
        latitude.value = lat;
    }


    if (longitude) {
        longitude.value = lng;
    }


    if (
        reportMap &&
        reportMarker
    ) {

        const position = {
            lat,
            lng
        };


        reportMarker.setPosition(
            position
        );


        reportMap.setCenter(
            position
        );


        reportMap.setZoom(15);

    }

}


/* =========================================================
   RENDER MAP MARKERS
========================================================= */

function renderGoogleMapMarkers() {

    if (!googleMap) {
        return;
    }


    issueMarkers.forEach(
        marker => marker.setMap(null)
    );


    issueMarkers = [];


    const filter =
        document.getElementById(
            "mapCategoryFilter"
        )?.value || "all";


    const filteredIssues =
        issues.filter(issue => {

            return (
                filter === "all" ||
                issue.category === filter
            );

        });


    filteredIssues.forEach(
        (issue, index) => {

            const position =
                getIssueCoordinates(
                    issue,
                    index
                );


            const marker =
                new google.maps.Marker({

                    map: googleMap,

                    position,

                    title: issue.title,

                    animation:
                        google.maps.Animation.DROP

                });


            marker.addListener(
                "click",
                () => {

                    const content = `

                        <div class="map-info-window">

                            <img
                                src="${escapeHTML(issue.image)}"
                                alt="${escapeHTML(issue.title)}"
                            >

                            <h3>
                                ${escapeHTML(issue.title)}
                            </h3>

                            <p>
                                <strong>Category:</strong>
                                ${escapeHTML(issue.category)}
                            </p>

                            <p>
                                <strong>Status:</strong>
                                ${escapeHTML(issue.status)}
                            </p>

                            <p>
                                <strong>Location:</strong>
                                ${escapeHTML(issue.location)}
                            </p>

                        </div>

                    `;


                    mapInfoWindow.setContent(
                        content
                    );


                    mapInfoWindow.open(
                        googleMap,
                        marker
                    );

                }
            );


            issueMarkers.push(marker);

        }
    );


    const count =
        document.getElementById(
            "mapIssueCount"
        );


    if (count) {

        count.textContent =
            filteredIssues.length;

    }

}


/* =========================================================
   MAP COORDINATES
========================================================= */

function getIssueCoordinates(issue, index) {

    if (
        Number.isFinite(issue.lat) &&
        Number.isFinite(issue.lng)
    ) {

        return {
            lat: issue.lat,
            lng: issue.lng
        };

    }


    const fallbackLocations = [

        {
            lat: 19.0760,
            lng: 72.8777
        },

        {
            lat: 19.2183,
            lng: 72.9781
        },

        {
            lat: 19.2403,
            lng: 73.1305
        },

        {
            lat: 19.1197,
            lng: 72.8468
        },

        {
            lat: 19.0330,
            lng: 73.0297
        },

        {
            lat: 19.1176,
            lng: 72.9060
        }

    ];


    return fallbackLocations[
        index %
        fallbackLocations.length
    ];

}


/* =========================================================
   CONTACT FORM
========================================================= */

function setupContactForm() {

    const form =
        document.getElementById(
            "contactForm"
        );

    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            form.reset();


            showToast(
                "Thank you. Your message has been received."
            );

        }
    );

}


/* =========================================================
   LOGIN
========================================================= */

function setupLogin() {

    const loginButton =
        document.getElementById(
            "loginButton"
        );

    const loginModal =
        document.getElementById(
            "loginModal"
        );

    const form =
        document.getElementById(
            "loginForm"
        );


    if (loginButton && loginModal) {

        loginButton.addEventListener(
            "click",
            () => {

                openModal(loginModal);

            }
        );

    }


    if (form) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                closeModal(loginModal);

                form.reset();

                showToast(
                    "Demo login successful."
                );

            }
        );

    }

}


/* =========================================================
   STATISTICS
========================================================= */

function updateStatistics() {

    const reported =
        issues.length;


    const resolved =
        issues.filter(
            issue =>
                issue.status === "Resolved"
        ).length;


    const heroReported =
        document.getElementById(
            "heroReportedCount"
        );


    const heroResolved =
        document.getElementById(
            "heroResolvedCount"
        );


    if (heroReported) {

        heroReported.textContent =
            reported;

    }


    if (heroResolved) {

        heroResolved.textContent =
            resolved;

    }

}


/* =========================================================
   IMAGE FALLBACK
========================================================= */

function getCategoryFallbackImage(category) {

    switch (category) {

        case "Roads & Potholes":
            return IMAGE_LIBRARY.rainRoad;

        case "Garbage & Cleanliness":
            return IMAGE_LIBRARY.garbage;

        case "Streetlights":
            return IMAGE_LIBRARY.streetLight;

        case "Water & Drainage":
            return IMAGE_LIBRARY.rainRoad;

        case "Public Safety":
            return IMAGE_LIBRARY.streetLight;

        case "Parks & Public Places":
            return IMAGE_LIBRARY.park;

        default:
            return IMAGE_LIBRARY.street;

    }

}


/* =========================================================
   FILE TO DATA URL
========================================================= */

function readFileAsDataURL(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                () => resolve(
                    reader.result
                );


            reader.onerror =
                reject;


            reader.readAsDataURL(file);

        }
    );

}


/* =========================================================
   GENERATE ISSUE ID
========================================================= */

function generateIssueId() {

    const highest =
        issues.reduce(
            (max, issue) => {

                const number =
                    parseInt(
                        issue.id
                            .replace(/\D/g, ""),
                        10
                    ) || 0;

                return Math.max(
                    max,
                    number
                );

            },
            0
        );


    return `FM${String(highest + 1).padStart(3, "0")}`;

}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "Unknown date";
    }


    const date =
        new Date(dateString);


    if (Number.isNaN(date.getTime())) {
        return dateString;
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   HTML ESCAPING
========================================================= */

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }


    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


function showToast(message) {

    const toast =
        document.getElementById("toast");


    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3500
        );

}


/* =========================================================
   GOOGLE MAPS ERROR HANDLING
========================================================= */

window.gm_authFailure = function () {

    showToast(
        "Google Maps authentication failed. Check your API key."
    );

};


/* =========================================================
   EXPOSE GOOGLE CALLBACK
========================================================= */

window.initGoogleMap =
    initGoogleMap;