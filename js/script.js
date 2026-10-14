
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    // ==========================================
    // 1. STORAGE AND INITIAL PROJECTS
    // ==========================================

    const STORAGE_KEY = "projectKBProjects";

    const initialProjects = [
        {
            id: 1,
            title: "Student Management System",
            category: "Web Development",
            description:
                "Manage student records with features to add, update, search and delete student information.",
            technologies: ["HTML", "CSS", "JavaScript"],
            icon: "🎓",
            githubUrl: "",
            prerequisites: "Web browser and a code editor such as VS Code.",
            installation:
                "1. Download or clone the project repository.\n" +
                "2. Open the project folder in VS Code.\n" +
                "3. Open index.html using Live Server."
        },
        {
            id: 2,
            title: "Python Calculator",
            category: "Python",
            description:
                "A calculator application demonstrating basic arithmetic operations using Python.",
            technologies: ["Python", "Tkinter"],
            icon: "🧮",
            githubUrl: "",
            prerequisites: "Python 3 installed on your computer.",
            installation:
                "1. Install Python 3.\n" +
                "2. Open the project folder in a terminal.\n" +
                "3. Run the application using python main.py, if main.py is the project's entry point."
        },
        {
            id: 3,
            title: "Library Management System",
            category: "Java",
            description:
                "Manage books, issue records, returns and library information.",
            technologies: ["Java", "JDBC", "MySQL"],
            icon: "📚",
            githubUrl: "",
            prerequisites: "JDK, MySQL and a compatible Java IDE.",
            installation:
                "1. Install the JDK and MySQL.\n" +
                "2. Open the project in your Java IDE.\n" +
                "3. Configure the database connection.\n" +
                "4. Run the application using its configured entry point."
        },
        {
            id: 4,
            title: "Personal Portfolio Website",
            category: "Web Development",
            description:
                "A responsive personal website to showcase skills, education, projects and achievements.",
            technologies: ["HTML", "CSS", "JavaScript"],
            icon: "💻",
            githubUrl: "",
            prerequisites: "A modern web browser and a code editor.",
            installation:
                "1. Open the project folder in VS Code.\n" +
                "2. Check that the HTML, CSS and JavaScript files are present.\n" +
                "3. Open index.html using Live Server."
        },
        {
            id: 5,
            title: "Database Management Project",
            category: "Database",
            description:
                "A sample database project demonstrating SQL queries, relationships and CRUD operations.",
            technologies: ["MySQL", "SQL"],
            icon: "🗄️",
            githubUrl: "",
            prerequisites: "MySQL Server and a SQL client.",
            installation:
                "1. Install and start MySQL Server.\n" +
                "2. Open the project's SQL script.\n" +
                "3. Create the database and tables according to the documentation.\n" +
                "4. Execute the queries."
        },
        {
            id: 6,
            title: "Weather Application",
            category: "Web Development",
            description:
                "A weather dashboard that can display weather information using an external API.",
            technologies: ["HTML", "CSS", "JavaScript", "API"],
            icon: "🌤️",
            githubUrl: "",
            prerequisites: "A modern browser and an API key if required by the selected weather service.",
            installation:
                "1. Open the project folder in VS Code.\n" +
                "2. Configure the weather API according to its provider's instructions.\n" +
                "3. Run the website using a local web server."
        }
    ];

    // ==========================================
    // 2. LOAD AND SAVE PROJECTS
    // ==========================================

    function loadProjects() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (saved === null) {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(initialProjects)
                );

                return initialProjects.map(project => ({ ...project }));
            }

            const parsed = JSON.parse(saved);

            if (!Array.isArray(parsed)) {
                throw new Error("Stored project data is invalid.");
            }

            return parsed.map(project => ({
                ...project,
                technologies: Array.isArray(project.technologies)
                    ? project.technologies
                    : [],
                githubUrl: project.githubUrl || "",
                prerequisites: project.prerequisites || "",
                installation: project.installation || "",
                icon: project.icon || "💻"
            }));
        } catch (error) {
            console.error("Unable to load projects:", error);
            return initialProjects.map(project => ({ ...project }));
        }
    }

    let projects = loadProjects();

    function saveProjects() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(projects)
            );

            return true;
        } catch (error) {
            console.error("Unable to save projects:", error);
            alert(
                "Unable to save project data. Check your browser storage settings."
            );

            return false;
        }
    }

    // ==========================================
    // 3. SECURITY AND FORMATTING HELPERS
    // ==========================================

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }

    function renderDocumentation(value) {
        if (typeof value !== "string" || !value.trim()) {
            return "<p>Documentation has not been added yet.</p>";
        }

        return value
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(Boolean)
            .map(line => `<p>${escapeHTML(line)}</p>`)
            .join("");
    }

    function isValidGitHubUrl(value) {
        if (!value) {
            return true;
        }

        try {
            const url = new URL(value);

            return (
                url.protocol === "https:" &&
                url.hostname === "github.com" &&
                !url.username &&
                !url.password &&
                /^\/[^/]+\/[^/]+\/?$/.test(url.pathname)
            );
        } catch {
            return false;
        }
    }

    // ==========================================
    // 4. PROJECTS PAGE: SEARCH AND FILTER
    // ==========================================

    const projectsGrid = document.getElementById("projectsGrid");

    if (projectsGrid) {
        const searchInput = document.getElementById("searchInput");
        const searchButton = document.getElementById("searchButton");
        const projectCount = document.getElementById("projectCount");
        const emptyState = document.getElementById("emptyState");
        const filterButtons = document.querySelectorAll(".filter-btn");

        let activeCategory = "All";

        function renderProjects() {
            const keyword = searchInput
                ? searchInput.value.trim().toLowerCase()
                : "";

            const filteredProjects = projects.filter(project => {
                const searchableText = [
                    project.title,
                    project.category,
                    project.description,
                    ...(project.technologies || []),
                    project.prerequisites,
                    project.installation
                ].join(" ").toLowerCase();

                const matchesSearch = searchableText.includes(keyword);

                const matchesCategory =
                    activeCategory === "All" ||
                    project.category === activeCategory;

                return matchesSearch && matchesCategory;
            });

            projectsGrid.innerHTML = filteredProjects.map(project => `
                <article class="project-card">
                    <div class="project-card-top">
                        <div class="project-icon">
                            ${escapeHTML(project.icon)}
                        </div>

                        <span class="project-category">
                            ${escapeHTML(project.category)}
                        </span>
                    </div>

                    <div class="project-card-body">
                        <h3>${escapeHTML(project.title)}</h3>

                        <p class="project-description">
                            ${escapeHTML(project.description)}
                        </p>

                        <div class="tech-tags">
                            ${(project.technologies || []).map(technology => `
                                <span class="tech-tag">
                                    ${escapeHTML(technology)}
                                </span>
                            `).join("")}
                        </div>

                        <div class="project-card-footer">
                            <a class="view-project"
                               href="project-details.html?id=${encodeURIComponent(project.id)}">
                                View Details →
                            </a>
                        </div>
                    </div>
                </article>
            `).join("");

            if (projectCount) {
                projectCount.textContent =
                    `${filteredProjects.length} project${filteredProjects.length === 1 ? "" : "s"} found`;
            }

            if (emptyState) {
                emptyState.hidden = filteredProjects.length !== 0;
            }
        }

        if (searchInput) {
            searchInput.addEventListener("input", renderProjects);
        }

        if (searchButton) {
            searchButton.addEventListener("click", renderProjects);
        }

        filterButtons.forEach(button => {
            button.addEventListener("click", function () {
                filterButtons.forEach(item => {
                    item.classList.remove("active");
                });

                this.classList.add("active");
                activeCategory = this.dataset.filter || "All";

                renderProjects();
            });
        });

        renderProjects();
    }

    // ==========================================
    // 5. PROJECT DETAILS PAGE
    // ==========================================

    const detailsContainer = document.getElementById("projectDetails");

    if (detailsContainer) {
        const params = new URLSearchParams(window.location.search);
        const projectId = params.get("id");

        const project = projects.find(
            item => String(item.id) === projectId
        );

        if (!project) {
            detailsContainer.innerHTML = `
                <div class="details-error">
                    <h2>Project not found</h2>
                    <p>Please select a project from the project library.</p>
                    <br>
                    <a href="projects.html" class="primary-button">
                        Browse Projects
                    </a>
                </div>
            `;
        } else {
            const technologiesHTML = (project.technologies || [])
                .map(technology => `
                    <span>${escapeHTML(technology)}</span>
                `)
                .join("");

            const githubHTML = project.githubUrl &&
                isValidGitHubUrl(project.githubUrl)
                ? `
                    <a class="primary-button"
                       href="${escapeHTML(project.githubUrl)}"
                       target="_blank"
                       rel="noopener noreferrer">
                        View on GitHub →
                    </a>
                `
                : `
                    <p>No GitHub repository has been provided.</p>
                `;

            detailsContainer.innerHTML = `
                <section class="details-banner">
                    <div class="details-icon">
                        ${escapeHTML(project.icon)}
                    </div>

                    <span class="details-category">
                        ${escapeHTML(project.category)}
                    </span>

                    <h1>${escapeHTML(project.title)}</h1>

                    <p>${escapeHTML(project.description)}</p>

                    <div class="details-actions">
                        <a href="projects.html" class="primary-button">
                            ← All Projects
                        </a>
                    </div>
                </section>

                <div class="details-content">
                    <div>
                        <section class="details-panel">
                            <h2>About This Project</h2>
                            <p>${escapeHTML(project.description)}</p>
                        </section>

                        <section class="details-panel">
                            <h2>Prerequisites</h2>
                            ${renderDocumentation(project.prerequisites)}
                        </section>

                        <section class="details-panel">
                            <h2>Installation Instructions</h2>
                            ${renderDocumentation(project.installation)}
                        </section>
                    </div>

                    <aside>
                        <section class="details-panel">
                            <h2>Technologies Used</h2>

                            <div class="details-tech">
                                ${technologiesHTML || "<p>No technologies listed.</p>"}
                            </div>
                        </section>

                        <section class="details-panel">
                            <h2>Project Information</h2>
                            <p>
                                <strong>Category:</strong>
                                ${escapeHTML(project.category)}
                            </p>
                            <p>
                                <strong>Project ID:</strong>
                                ${escapeHTML(project.id)}
                            </p>
                        </section>

                        <section class="details-panel">
                            <h2>Source Code Repository</h2>
                            ${githubHTML}
                        </section>
                    </aside>
                </div>
            `;
        }
    }

    // ==========================================
    // 6. ADMIN PAGE: ELEMENT REFERENCES
    // ==========================================

    const projectForm = document.getElementById("projectForm");

    if (projectForm) {
        const projectIdInput = document.getElementById("projectId");
        const titleInput = document.getElementById("title");
        const categoryInput = document.getElementById("category");
        const descriptionInput = document.getElementById("description");
        const technologiesInput = document.getElementById("technologies");
        const iconInput = document.getElementById("icon");

        const githubUrlInput = document.getElementById("githubUrl");
        const prerequisitesInput = document.getElementById("prerequisites");
        const installationInput = document.getElementById("installation");

        const saveButton = document.getElementById("saveButton");
        const cancelButton = document.getElementById("cancelButton");
        const formTitle = document.getElementById("formTitle");
        const adminMessage = document.getElementById("adminMessage");
        const adminProjectList = document.getElementById("adminProjectList");
        const adminEmptyState = document.getElementById("adminEmptyState");

        // ==========================================
        // 7. RENDER ADMIN TABLE AND STATISTICS
        // ==========================================

        function renderAdmin() {
            document.getElementById("totalProjects").textContent =
                projects.length;

            document.getElementById("totalCategories").textContent =
                new Set(projects.map(project => project.category)).size;

            adminProjectList.innerHTML = projects.map(project => `
                <tr>
                    <td>
                        ${escapeHTML(project.icon)}
                        ${escapeHTML(project.title)}
                    </td>

                    <td>${escapeHTML(project.category)}</td>

                    <td>
                        ${(project.technologies || []).map(escapeHTML).join(", ")}
                    </td>

                    <td>
                        <button
                            type="button"
                            class="admin-action"
                            data-action="edit"
                            data-id="${escapeHTML(project.id)}">
                            Edit
                        </button>

                        <button
                            type="button"
                            class="admin-action delete"
                            data-action="delete"
                            data-id="${escapeHTML(project.id)}">
                            Delete
                        </button>
                    </td>
                </tr>
            `).join("");

            if (adminEmptyState) {
                adminEmptyState.hidden = projects.length > 0;
            }
        }

        // ==========================================
        // 8. RESET FORM
        // ==========================================

        function resetForm() {
            projectForm.reset();

            projectIdInput.value = "";

            if (iconInput) {
                iconInput.value = "💻";
            }

            formTitle.textContent = "Add New Project";
            saveButton.textContent = "Add Project";
            cancelButton.hidden = true;
            adminMessage.textContent = "";
        }

        // ==========================================
        // 9. ADD AND UPDATE PROJECTS
        // ==========================================

        projectForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const title = titleInput.value.trim();
            const category = categoryInput.value;
            const description = descriptionInput.value.trim();

            const technologies = technologiesInput.value
                .split(",")
                .map(technology => technology.trim())
                .filter(Boolean);

            const icon = iconInput.value.trim() || "💻";

            const githubUrl = githubUrlInput.value.trim();
            const prerequisites = prerequisitesInput.value.trim();
            const installation = installationInput.value.trim();

            if (!title || !category || !description ||
                technologies.length === 0) {
                adminMessage.textContent =
                    "Please fill in all required fields.";

                return;
            }

            if (!isValidGitHubUrl(githubUrl)) {
                adminMessage.textContent =
                    "Enter a valid HTTPS GitHub repository URL, such as https://github.com/username/repository.";

                return;
            }

            const editingId = projectIdInput.value;

            if (editingId) {
                const index = projects.findIndex(
                    project => String(project.id) === editingId
                );

                if (index === -1) {
                    adminMessage.textContent = "Project not found.";
                    return;
                }

                projects[index] = {
                    ...projects[index],
                    title,
                    category,
                    description,
                    technologies,
                    icon,
                    githubUrl,
                    prerequisites,
                    installation
                };
            } else {
                const newId = projects.reduce(
                    (maximum, project) =>
                        Math.max(maximum, Number(project.id) || 0),
                    0
                ) + 1;

                projects.push({
                    id: newId,
                    title,
                    category,
                    description,
                    technologies,
                    icon,
                    githubUrl,
                    prerequisites,
                    installation
                });
            }

            if (!saveProjects()) {
                return;
            }

            renderAdmin();
            resetForm();

            adminMessage.textContent = editingId
                ? "Project updated successfully."
                : "Project added successfully.";
        });

        // ==========================================
        // 10. EDIT AND DELETE PROJECTS
        // ==========================================

        adminProjectList.addEventListener("click", function (event) {
            const button = event.target.closest("button[data-action]");

            if (!button) {
                return;
            }

            const id = button.dataset.id;

            const project = projects.find(
                item => String(item.id) === id
            );

            if (!project) {
                return;
            }

            if (button.dataset.action === "edit") {
                projectIdInput.value = project.id;
                titleInput.value = project.title;
                categoryInput.value = project.category;
                descriptionInput.value = project.description;

                technologiesInput.value =
                    (project.technologies || []).join(", ");

                iconInput.value = project.icon || "💻";
                githubUrlInput.value = project.githubUrl || "";
                prerequisitesInput.value = project.prerequisites || "";
                installationInput.value = project.installation || "";

                formTitle.textContent = "Edit Project";
                saveButton.textContent = "Save Changes";
                cancelButton.hidden = false;
                adminMessage.textContent = "";

                projectForm.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

            if (button.dataset.action === "delete") {
                const confirmed = confirm(
                    `Are you sure you want to delete "${project.title}"?`
                );

                if (!confirmed) {
                    return;
                }

                projects = projects.filter(
                    item => String(item.id) !== id
                );

                if (!saveProjects()) {
                    return;
                }

                renderAdmin();
                resetForm();

                adminMessage.textContent =
                    "Project deleted successfully.";
            }
        });

        // ==========================================
        // 11. CANCEL EDIT
        // ==========================================

        cancelButton.addEventListener("click", resetForm);

        // Initial admin display
        renderAdmin();
    }

    // ==========================================
    // 12. HOME PAGE INITIALIZATION
    // ==========================================

    console.log(
        "Project Knowledge Base loaded successfully."
    );
});
