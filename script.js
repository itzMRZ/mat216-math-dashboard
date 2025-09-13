// MAT216 Math Dashboard JavaScript
// Enhanced version with improved functionality and modularity

(function() {
    'use strict';

    // Configuration and State
    const CONFIG = {
        STORAGE_KEY: 'mat216Progress',
        ANIMATION_DURATION: 300,
        DEBOUNCE_DELAY: 150
    };

    const STATE = {
        checkboxes: null,
        progressBar: null,
        milestoneMapping: {
            'q1-monitor': 'milestone-q1',
            'q2-monitor': 'milestone-q2',
            'q3-monitor': 'milestone-q3',
            'q4-monitor': 'milestone-q4',
            'q5-monitor': 'milestone-q5',
            'q6-monitor': 'milestone-q6',
            'q7-monitor': 'milestone-q7'
        },
        summaryData: [
            {
                name: 'Eigenvalue',
                summary: 'A scalar number $\\lambda$ is called an eigenvalue of a linear transformation $T$ from $V$ to $V$ if there exists a non-zero vector \\vec{v} such that $T(\\vec{v}) = \\lambda \\vec{v}$. Similarly, for an $n \\times n$ square matrix $A$, $\\lambda$ is an eigenvalue if there is a non-zero vector \\vec{v} where $A \\vec{v} = \\lambda \\vec{v}$. The vector \\vec{v} is called an eigenvector of the eigenvalue $\\lambda$.',
                equations: ['T(\\vec{v}) = \\lambda \\vec{v}', 'A \\vec{v} = \\lambda \\vec{v}', '\\det(A - \\lambda I) = 0'],
                rules: ['Eigenvalues of an $n \\times n$ matrix $A$ are found by solving the characteristic equation, $\\det(A - \\lambda I) = 0$, where $I$ is the $n \\times n$ identity matrix.', 'For a square matrix $A$ of size $n \\times n$, if $\\lambda_1, \\lambda_2, \\dots, \\lambda_n$ are the eigenvalues of $A$, then:', '$\\mathrm{tr}(A) = \\lambda_1 + \\lambda_2 + \\dots + \\lambda_n$', '$\\det(A) = \\lambda_1 \\cdot \\lambda_2 \\cdot \\dots \\cdot \\lambda_n$', 'If $A$ is an upper or lower triangular matrix, its diagonal elements are the eigenvalues.'],
                things_to_be_careful_about: ['The vector $\\vec{v}$ must be non-zero (i.e., $\\vec{v} \\neq 0$).', 'Carefully expand the determinant in the characteristic equation to find eigenvalues.']
            },
            {
                name: 'Eigenvector',
                summary: 'A non-zero vector \\vec{v} is an eigenvector of an $n \\times n$ square matrix $A$ corresponding to eigenvalue $\\lambda$ if $A \\vec{v} = \\lambda \\vec{v}$. Eigenvalues are found by solving $\\det(A - \\lambda I) = 0$.',
                equations: ['A \\vec{v} = \\lambda \\vec{v}', '(A - \\lambda I) \\vec{v} = 0'],
                rules: ['If $\\lambda$ is an eigenvalue of $A$, then a non-trivial solution \\vec{v} of $(A - \\lambda I) \\vec{v} = 0$ is an eigenvector of $A$.', 'There exist infinitely many eigenvectors for each eigenvalue.', 'If \\vec{v} is an eigenvector, then any scalar multiple of \\vec{v} is also an eigenvector.'],
                things_to_be_careful_about: ['Eigenvectors must be non-trivial (non-zero) solutions.', 'Solve the system $(A-\\lambda I) \\vec{v}=0$ carefully for each eigenvalue.']
            },
            {
                name: 'Diagonalization',
                summary: 'An $n \\times n$ matrix $A$ is diagonalizable if there exists an invertible matrix $P$ such that $A = P D P^{-1}$ with diagonal $D$.',
                equations: ['A = P D P^{-1}', 'D = \\mathrm{diag}(\\lambda_1, \\lambda_2, \\lambda_3, \\dots)', 'A^k = P D^k P^{-1}'],
                rules: ['An $n \\times n$ matrix is diagonalizable iff it has $n$ linearly independent eigenvectors.', '$D$ holds eigenvalues on the diagonal; columns of $P$ are corresponding eigenvectors in the same order.', 'For powers $A^k$, raise each diagonal entry of $D$ to $k$.'],
                things_to_be_careful_about: ['Not diagonalizable if geometric multiplicities do not add up to $n$.', 'Order eigenvalues in $D$ to match column order of eigenvectors in $P$.']
            },
            {
                name: 'General Fourier Series',
                summary: 'Represent a periodic function of period $2L$ as a sum of sines and cosines.',
                equations: ['f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} a_n \\cos(\\tfrac{n\\pi x}{L}) + \\sum_{n=1}^{\\infty} b_n \\sin(\\tfrac{n\\pi x}{L})', 'a_n = \\frac{1}{L} \\int_{-L}^{L} f(x) \\cos(\\tfrac{n\\pi x}{L}) \\, dx', 'b_n = \\frac{1}{L} \\int_{-L}^{L} f(x) \\sin(\\tfrac{n\\pi x}{L}) \\, dx'],
                rules: ['L is half the period.', 'You can integrate over any interval of length $2L$.'],
                things_to_be_careful_about: ['Pick the correct $L$ from the period.', 'Handle piecewise definitions by breaking integrals.']
            },
            {
                name: 'Even and Odd Cases of Fourier Series',
                summary: 'On $(-L,L)$: even functions have cosine-only series; odd functions have sine-only series.',
                equations: ['\\text{Even: } f(x) = \\frac{a_0}{2} + \\sum a_n \\cos(\\tfrac{n\\pi x}{L})', 'a_n = \\frac{2}{L}\\int_{0}^{L} f(x) \\cos(\\tfrac{n\\pi x}{L}) \\, dx', '\\text{Odd: } f(x) = \\sum b_n \\sin(\\tfrac{n\\pi x}{L})', 'b_n = \\frac{2}{L}\\int_{0}^{L} f(x) \\sin(\\tfrac{n\\pi x}{L}) \\, dx'],
                rules: ['Even: $b_n=0$; Odd: $a_n=0$.'],
                things_to_be_careful_about: ['Verify parity on a symmetric interval.']
            },
            {
                name: 'Half-Range Fourier Series',
                summary: 'Extend $(0,L)$ data to $(-L,L)$ by even/odd to obtain cosine/sine series.',
                equations: ['\\text{Cosine: } f(x) = \\frac{a_0}{2} + \\sum a_n \\cos(\\tfrac{n\\pi x}{L})', 'a_n = \\frac{2}{L}\\int_{0}^{L} f(x) \\cos(\\tfrac{n\\pi x}{L}) \\, dx', '\\text{Sine: } f(x) = \\sum b_n \\sin(\\tfrac{n\\pi x}{L})', 'b_n = \\frac{2}{L}\\int_{0}^{L} f(x) \\sin(\\tfrac{n\\pi x}{L}) \\, dx'],
                rules: ['Choose cosine (even extension) or sine (odd extension) based on problem needs.'],
                things_to_be_careful_about: ['Use $L$ as the length of $(0,L)$.']
            },
            {
                name: "Series Sum using Fourier Series and Parseval's Identity",
                summary: 'Use Fourier series values or Parseval to evaluate infinite sums.',
                equations: ['\\frac{1}{L} \\int_{-L}^{L} (f(x))^2 dx = \\frac{a_0^2}{2} + \\sum_{n=1}^{\\infty} (a_n^2 + b_n^2)'],
                rules: ['Evaluate series at convergence points to get sums.', 'Parseval relates integral of $f^2$ to squared coefficients.'],
                things_to_be_careful_about: ['Choose evaluation points carefully with discontinuities.']
            },
            {
                name: 'Complex Fourier Series',
                summary: 'Express $f$ using complex exponentials $c_n e^{i n\\pi x/L}$ with $n\\in\\mathbb{Z}$.',
                equations: ['f(x) = \\sum_{n=-\\infty}^{\\infty} c_n e^{i \\frac{n\\pi x}{L}}', 'c_n = \\frac{1}{2L} \\int_{-L}^{L} f(x) e^{-i \\frac{n\\pi x}{L}} dx'],
                rules: ['Sum over all integers $n$.'],
                things_to_be_careful_about: ['Mind the negative sign in $e^{-i n\\pi x/L}$.']
            },
            {
                name: 'General Fourier Transformation / Fourier Integral',
                summary: 'Transform non-periodic $f$ to frequency domain and back.',
                equations: ['F(\\omega) = \\int_{-\\infty}^{\\infty} f(x) e^{-i\\omega x} dx', 'f(x) = \\frac{1}{2\\pi} \\int_{-\\infty}^{\\infty} F(\\omega) e^{i\\omega x} d\\omega'],
                rules: ['Integrals are over $(-\\infty,\\infty)$.', 'Here the $1/(2\\pi)$ factor is in the inverse transform.'],
                things_to_be_careful_about: ['Evaluate improper integrals carefully.']
            },
            {
                name: 'Fourier Cosine & Sine Transform',
                summary: 'Transforms on $x\\ge 0$: cosine (even extension) and sine (odd extension).',
                equations: ['F_c(\\omega) = \\int_{0}^{\\infty} f(x) \\cos(\\omega x) dx', 'f(x) = \\frac{2}{\\pi} \\int_{0}^{\\infty} F_c(\\omega) \\cos(\\omega x) d\\omega', 'F_s(\\omega) = \\int_{0}^{\\infty} f(x) \\sin(\\omega x) dx', 'f(x) = \\frac{2}{\\pi} \\int_{0}^{\\infty} F_s(\\omega) \\sin(\\omega x) d\\omega'],
                rules: ['Domain is $x\\ge 0$; integrals from $0$ to $\\infty$.'],
                things_to_be_careful_about: ['Use correct inverse scaling $2/\\pi$.']
            }
        ]
    };

    // Utility functions
    const Utils = {
        debounce(func, delay) {
            let timeoutId;
            return function (...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        },

        createElement(tag, options = {}) {
            const element = document.createElement(tag);
            if (options.className) element.className = options.className;
            if (options.textContent) element.textContent = options.textContent;
            if (options.innerHTML) element.innerHTML = options.innerHTML;
            if (options.attributes) {
                Object.entries(options.attributes).forEach(([key, value]) => {
                    element.setAttribute(key, value);
                });
            }
            return element;
        },

        typesetMath(root) {
            if (window.MathJax && MathJax.typesetPromise) {
                return MathJax.typesetPromise(root ? [root] : undefined);
            }
            return Promise.resolve();
        },

        showNotification(message, type = 'info') {
            const notification = Utils.createElement('div', {
                className: `notification notification-${type}`,
                textContent: message
            });

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('notification-show');
            }, 10);

            setTimeout(() => {
                notification.classList.remove('notification-show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    };

    // UI Update Functions
    const UIUpdates = {
        updateTaskStyle(checkbox) {
            const listItem = checkbox.closest('li');
            if (listItem) {
                listItem.classList.toggle('checked-task', checkbox.checked);
                // Add smooth animation
                if (checkbox.checked) {
                    listItem.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        listItem.style.transform = '';
                    }, 150);
                }
            }
        },

        updateProgressBar() {
            // Only count study materials (videos and milestones), not practice questions
            const studyMaterialCheckboxes = Array.from(STATE.checkboxes).filter(cb => {
                const id = cb.id;
                return id.startsWith('vid-') || id.startsWith('milestone-');
            });

            const checkedCount = studyMaterialCheckboxes.filter(cb => cb.checked).length;
            const percentage = studyMaterialCheckboxes.length > 0 ? (checkedCount / studyMaterialCheckboxes.length) * 100 : 0;

            STATE.progressBar.style.width = percentage + '%';
            STATE.progressBar.textContent = Math.round(percentage) + '% Complete';

            // Only show celebration for major milestones (50% and 100%)
            if (percentage >= 50 && percentage < 55 && !STATE.progressBar.dataset.milestone50) {
                Utils.showNotification('Halfway there! 🎯', 'success');
                STATE.progressBar.dataset.milestone50 = 'true';
            } else if (percentage >= 100 && !STATE.progressBar.dataset.milestone100) {
                Utils.showNotification('All tasks completed! 🎉', 'success');
                STATE.progressBar.dataset.milestone100 = 'true';
            }
        },        updateMonitor() {
            for (const monitorId in STATE.milestoneMapping) {
                const milestoneCheckbox = document.getElementById(STATE.milestoneMapping[monitorId]);
                const monitorElement = document.getElementById(monitorId);
                if (milestoneCheckbox && monitorElement) {
                    const isCompleted = milestoneCheckbox.checked;
                    monitorElement.classList.toggle('status-covered', isCompleted);
                    monitorElement.classList.toggle('status-not-covered', !isCompleted);

                    // Add pulse animation for newly completed topics
                    if (isCompleted && !monitorElement.dataset.wasCompleted) {
                        monitorElement.style.animation = 'pulse 0.6s ease-in-out';
                        setTimeout(() => {
                            monitorElement.style.animation = '';
                        }, 600);
                    }
                    monitorElement.dataset.wasCompleted = isCompleted;
                }
            }
        },

        updateAllUI() {
            STATE.checkboxes.forEach(UIUpdates.updateTaskStyle);
            UIUpdates.updateProgressBar();
            UIUpdates.updateMonitor();
        }
    };

    // Progress Management
    const ProgressManager = {
        save() {
            const progress = {};
            STATE.checkboxes.forEach(cb => {
                progress[cb.id] = cb.checked;
            });
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(progress));
        },

        load() {
            const progress = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || {};
            STATE.checkboxes.forEach(cb => {
                cb.checked = progress[cb.id] || false;
            });
        },

        export() {
            const progress = localStorage.getItem(CONFIG.STORAGE_KEY) || '{}';
            const blob = new Blob([progress], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `mat216-progress-${new Date().toISOString().slice(0,10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            Utils.showNotification('Progress exported successfully!', 'success');
        },

        import(file) {
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (typeof data !== 'object' || data === null) {
                        throw new Error("Invalid format");
                    }
                    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
                    App.init(); // Re-initialize with new data
                    Utils.showNotification('Progress imported successfully!', 'success');
                } catch (err) {
                    Utils.showNotification('Import failed: Invalid file format', 'error');
                }
            };
            reader.readAsText(file);
        },

        reset() {
            if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                localStorage.removeItem(CONFIG.STORAGE_KEY);
                App.init(); // Re-initialize
                Utils.showNotification('Progress has been reset', 'info');
            }
        }
    };

    // Event Handlers
    const EventHandlers = {
        handleCheckboxChange: Utils.debounce((event) => {
            UIUpdates.updateTaskStyle(event.target);
            UIUpdates.updateProgressBar();
            UIUpdates.updateMonitor();
            ProgressManager.save();
        }, CONFIG.DEBOUNCE_DELAY),

        handleTabClick(event) {
            const parentBlock = event.target.closest('.practice-tabs');
            const targetTabId = event.target.dataset.tab;

            // Update tab buttons
            parentBlock.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            event.target.classList.add('active');

            // Update tab panels
            parentBlock.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            const activePanel = parentBlock.querySelector(`#tab-${targetTabId}`);
            activePanel.classList.add('active');

            // Typeset math in the newly active panel
            Utils.typesetMath(activePanel);
        },

        handleExport() {
            ProgressManager.export();
        },

        handleImport(event) {
            const file = event.target.files[0];
            ProgressManager.import(file);
            event.target.value = ''; // Reset file input
        },

        handleReset() {
            ProgressManager.reset();
        }
    };

    // Resource Management
    const ResourceManager = {
        buildVideoResources() {
            const slideMap = {
                'vid-21': 'slides/Eigenvalue.pdf',
                'vid-22': 'slides/Eigenvector.pdf',
                'vid-23': 'slides/Diagonalization.pdf',
                'vid-31': 'slides/Half-Range-Fourier-Series.pdf',
                'vid-32': 'slides/Series-Sum-Parseval.pdf',
                'vid-33': 'slides/Complex-Fourier-Series.pdf',
                'vid-34': 'slides/Fourier-Transform.pdf',
                'vid-35': 'slides/Fourier-Cosine-Sine-Transform.pdf'
            };

            const topicMap = {
                'vid-21': 'Eigenvalue',
                'vid-22': 'Eigenvector',
                'vid-23': 'Diagonalization',
                'vid-31': 'Half-Range Fourier Series',
                'vid-32': "Series Sum using Fourier Series and Parseval's Identity",
                'vid-33': 'Complex Fourier Series',
                'vid-34': 'General Fourier Transformation / Fourier Integral',
                'vid-35': 'Fourier Cosine & Sine Transform'
            };

            Object.keys(slideMap).forEach(id => {
                const li = document.getElementById(id)?.closest('li');
                if (!li) return;

                // Avoid duplicating
                if (li.nextElementSibling && li.nextElementSibling.classList?.contains('resource-row')) return;

                const row = Utils.createElement('div', { className: 'resource-row' });

                const tag = Utils.createElement('span', {
                    className: 'tag',
                    textContent: 'Slides'
                });

                const slideLink = Utils.createElement('a', {
                    className: 'slide-link',
                    textContent: 'Open Slides (PDF)',
                    attributes: {
                        href: '#',
                        'data-href': slideMap[id]
                    }
                });

                const summarizeBtn = Utils.createElement('button', {
                    className: 'summarize-btn',
                    textContent: 'Summarize',
                    attributes: {
                        type: 'button',
                        'data-topic': topicMap[id] || ''
                    }
                });

                row.appendChild(tag);
                row.appendChild(slideLink);
                row.appendChild(summarizeBtn);

                li.parentElement.insertBefore(row, li.nextSibling);
            });
        },

        attachSolutionLinks() {
            const panels = ['#tab-past-paper', '#tab-ai-generated', '#tab-provided'];

            panels.forEach(sel => {
                const container = document.querySelector(sel);
                if (!container) return;

                container.querySelectorAll('li').forEach(li => {
                    const label = li.querySelector('label');
                    if (!label) return;

                    const questionText = label.innerText.trim();

                    // Remove any pre-existing solver sections
                    li.querySelectorAll('.solver-section').forEach(section => section.remove());

                    // Create solver section with single label and buttons
                    const solverSection = Utils.createElement('div', {
                        className: 'solver-section'
                    });

                    // Add "Solve With:" label
                    const solverLabel = Utils.createElement('span', {
                        className: 'solver-label',
                        textContent: 'Solve With:'
                    });

                    // Create buttons container
                    const buttonsContainer = Utils.createElement('div', {
                        className: 'solver-buttons'
                    });

                    // Helper to create solver button
                    const createSolverButton = (platform, url) => {
                        // Wolfram gets just the question, others get full instruction
                        const query = platform.toLowerCase() === 'wolfram'
                            ? questionText
                            : `show the question properly and step by step solve \n${questionText}`;

                        const button = Utils.createElement('a', {
                            className: 'solver-btn',
                            attributes: {
                                href: url + encodeURIComponent(query),
                                target: '_blank',
                                rel: 'noopener'
                            }
                        });

                        const icon = Utils.createElement('div', {
                            className: `solver-icon ${platform.toLowerCase()}`
                        });

                        button.appendChild(icon);
                        button.appendChild(document.createTextNode(platform));

                        return button;
                    };

                    // Add solver buttons
                    buttonsContainer.appendChild(createSolverButton('Wolfram', 'https://www.wolframalpha.com/input?i='));
                    buttonsContainer.appendChild(createSolverButton('GPT', 'https://chat.openai.com/?q='));
                    buttonsContainer.appendChild(createSolverButton('Perplexity', 'https://www.perplexity.ai/search?q='));
                    buttonsContainer.appendChild(createSolverButton('Claude', 'https://claude.ai/new?q='));

                    solverSection.appendChild(solverLabel);
                    solverSection.appendChild(buttonsContainer);
                    li.appendChild(solverSection);
                });
            });
        }
    };

    // Modal Management
    const ModalManager = {
        init() {
            const backdrop = document.getElementById('summary-backdrop');
            const titleEl = document.getElementById('summary-title');
            const contentEl = document.getElementById('summary-content');
            const closeEl = document.getElementById('summary-close');
            const tabSlidesBtn = document.getElementById('tab-slides');
            const tabSummaryBtn = document.getElementById('tab-summary');
            const panelSlides = document.getElementById('panel-slides');
            const panelSummary = document.getElementById('panel-summary');
            const pdfFrame = document.getElementById('pdf-frame');
            const openFull = document.getElementById('open-full');

            const setTab = (tab) => {
                if (tab === 'slides') {
                    tabSlidesBtn.classList.add('active');
                    tabSummaryBtn.classList.remove('active');
                    panelSlides.hidden = false;
                    panelSummary.hidden = true;
                    tabSlidesBtn.setAttribute('aria-selected', 'true');
                    tabSummaryBtn.setAttribute('aria-selected', 'false');
                } else {
                    tabSlidesBtn.classList.remove('active');
                    tabSummaryBtn.classList.add('active');
                    panelSlides.hidden = true;
                    panelSummary.hidden = false;
                    tabSlidesBtn.setAttribute('aria-selected', 'false');
                    tabSummaryBtn.setAttribute('aria-selected', 'true');
                }
            };

            const openSummary = (topic) => {
                const data = STATE.summaryData.find(s => s.name === topic);
                if (!data) return;

                titleEl.textContent = topic + ' — Summary';
                contentEl.innerHTML = '';

                const addSection = (heading, body) => {
                    const section = Utils.createElement('div', { className: 'section' });
                    const h4 = Utils.createElement('h4', { textContent: heading });
                    section.appendChild(h4);

                    if (Array.isArray(body)) {
                        const ul = Utils.createElement('ul');
                        body.forEach(text => {
                            const li = Utils.createElement('li', { innerHTML: text });
                            ul.appendChild(li);
                        });
                        section.appendChild(ul);
                    } else {
                        const div = Utils.createElement('div', { innerHTML: body });
                        section.appendChild(div);
                    }
                    contentEl.appendChild(section);
                };

                addSection('Overview', data.summary);
                if (data.equations?.length) {
                    addSection('Key Equations', data.equations.map(e => `$$${e}$$`));
                }
                if (data.rules?.length) {
                    addSection('Rules', data.rules);
                }
                if (data.things_to_be_careful_about?.length) {
                    addSection('Things to be careful about', data.things_to_be_careful_about);
                }

                setTab('summary');
                backdrop.style.display = 'flex';
                Utils.typesetMath(contentEl);
            };

            const openSlides = (title, href) => {
                titleEl.textContent = title + ' — Slides';
                pdfFrame.src = href;
                openFull.href = href;
                setTab('slides');
                backdrop.style.display = 'flex';
            };

            const closeModal = () => {
                backdrop.style.display = 'none';
                pdfFrame.src = '';
            };

            // Event listeners
            document.body.addEventListener('click', (e) => {
                const btn = e.target.closest('.summarize-btn');
                if (btn) {
                    const topic = btn.getAttribute('data-topic');
                    openSummary(topic);
                    return;
                }

                const slide = e.target.closest('.slide-link');
                if (slide && slide.dataset.href) {
                    e.preventDefault();
                    const topic = slide.parentElement.querySelector('.summarize-btn')?.getAttribute('data-topic') || 'Slides';
                    openSlides(topic, slide.dataset.href);
                }
            });

            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) closeModal();
            });

            closeEl.addEventListener('click', closeModal);
            tabSlidesBtn.addEventListener('click', () => setTab('slides'));
            tabSummaryBtn.addEventListener('click', () => setTab('summary'));

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && backdrop.style.display === 'flex') {
                    closeModal();
                }
            });
        }
    };

    // Equation numbering
    const EquationNumbering = {
        numberEquations() {
            const displays = document.querySelectorAll('.katex-display');
            let counter = 0;
            displays.forEach(el => {
                if (!el.querySelector('.eq-number')) {
                    counter += 1;
                    const tag = Utils.createElement('span', {
                        className: 'eq-number',
                        textContent: `(${counter})`
                    });
                    el.appendChild(tag);
                }
            });
        }
    };

    // Main App Object
    const App = {
        init() {
            // Initialize state
            STATE.checkboxes = document.querySelectorAll('input[type="checkbox"]');
            STATE.progressBar = document.getElementById('progress-bar');

            // Build resources
            ResourceManager.buildVideoResources();
            ResourceManager.attachSolutionLinks();

            // Setup event listeners
            this.setupEventListeners();

            // Initialize modal
            ModalManager.init();

            // Load progress and update UI
            ProgressManager.load();
            UIUpdates.updateAllUI();

            // Render math and number equations
            Utils.typesetMath(document.body).then(() => {
                EquationNumbering.numberEquations();
            });

            // Add notification styles if not present
            this.addNotificationStyles();
        },

        setupEventListeners() {
            // Checkbox changes
            STATE.checkboxes.forEach(cb => {
                cb.addEventListener('change', EventHandlers.handleCheckboxChange);
            });

            // Tab buttons
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.addEventListener('click', EventHandlers.handleTabClick);
            });

            // Progress controls
            const importFileInput = document.getElementById('importFile');
            document.getElementById('exportProgress').addEventListener('click', EventHandlers.handleExport);
            document.getElementById('importProgress').addEventListener('click', () => importFileInput.click());
            importFileInput.addEventListener('change', EventHandlers.handleImport);
            document.getElementById('resetProgress').addEventListener('click', EventHandlers.handleReset);
        },

        addNotificationStyles() {
            if (document.getElementById('notification-styles')) return;

            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 10px 14px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    font-size: 0.8rem;
                    z-index: 10000;
                    transform: translateX(100%);
                    transition: transform 0.2s ease-in-out;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    max-width: 250px;
                    opacity: 0.9;
                }
                .notification-show {
                    transform: translateX(0);
                }
                .notification-success {
                    background: linear-gradient(135deg, var(--accent-green), #38a169);
                }
                .notification-error {
                    background: linear-gradient(135deg, var(--accent-red), #e53e3e);
                }
                .notification-info {
                    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
                }
            `;
            document.head.appendChild(style);
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', App.init.bind(App));
    } else {
        App.init();
    }

})();