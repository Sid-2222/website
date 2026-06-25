/* =============================================
   NAV SCROLL BEHAVIOR
============================================= */
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* =============================================
   SCROLL REVEAL
============================================= */
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
      setTimeout(() => {
        el.classList.add('visible');
      }, delay);
      observer.unobserve(el);
    }
  });
}, observerOptions);

document.querySelectorAll('.skill-card, .timeline-item').forEach(el => {
  observer.observe(el);
});

/* =============================================
   GITHUB REPOS
============================================= */
const GITHUB_USER = 'Sid-2222';
const reposGrid = document.getElementById('reposGrid');

// Language color map
const langColors = {
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Jupyter: '#DA5B0B',
  TypeScript: '#2b7489',
  Shell: '#89e051',
  Kotlin: '#A97BFF',
};

async function fetchRepos() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12&type=public`
    );

    if (!response.ok) throw new Error('GitHub API error');

    const repos = await response.json();
    renderRepos(repos);
  } catch (err) {
    reposGrid.innerHTML = `
      <div class="repo-loading">
        <p style="color:var(--text-dim)">Could not load repositories. 
          <a href="https://github.com/${GITHUB_USER}?tab=repositories" target="_blank" rel="noopener">
            View them directly on GitHub →
          </a>
        </p>
      </div>`;
  }
}

function renderRepos(repos) {
  if (!repos.length) {
    reposGrid.innerHTML = '<div class="repo-loading"><p>No public repositories found.</p></div>';
    return;
  }

  reposGrid.innerHTML = '';

  repos.forEach((repo, i) => {
    const card = document.createElement('div');
    card.className = 'repo-card';
    card.style.animationDelay = `${i * 60}ms`;

    const langColor = langColors[repo.language] || '#7a8099';
    const langHTML = repo.language
      ? `<span class="repo-lang"><span class="lang-dot" style="background:${langColor}"></span>${repo.language}</span>`
      : '';

    const starsHTML = repo.stargazers_count > 0
      ? `<span class="repo-stars">⭐ ${repo.stargazers_count}</span>`
      : '';

    const desc = repo.description
      ? repo.description.length > 100
        ? repo.description.slice(0, 100) + '…'
        : repo.description
      : '<span style="color:var(--text-dim);font-style:italic">No description</span>';

    const updated = new Date(repo.updated_at).toLocaleDateString('en-US', {
      month: 'short', year: 'numeric'
    });

    card.innerHTML = `
      <div class="repo-card-header">
        <p class="repo-name"><a href="${repo.html_url}" target="_blank" rel="noopener">📁 ${repo.name}</a></p>
        ${starsHTML}
      </div>
      <p class="repo-description">${desc}</p>
      <div class="repo-footer">
        ${langHTML}
        <span class="repo-lang" style="margin-left:auto">Updated ${updated}</span>
      </div>
    `;

    reposGrid.appendChild(card);
  });
}

fetchRepos();

/* =============================================
   CONTACT FORM — Formspree (emails go to your inbox)
============================================= */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;
  formStatus.textContent = '';
  formStatus.className = 'form-note';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' }
    });

    if (response.ok) {
      formStatus.textContent = '✓ Message sent! I\'ll get back to you soon.';
      formStatus.className = 'form-note success';
      form.reset();
    } else {
      const json = await response.json();
      if (json.errors) {
        formStatus.textContent = json.errors.map(e => e.message).join(', ');
      } else {
        formStatus.textContent = 'Something went wrong. Please email me directly.';
      }
      formStatus.className = 'form-note error';
    }
  } catch {
    formStatus.textContent = 'Network error. Please email hisiddhartha21@gmail.com directly.';
    formStatus.className = 'form-note error';
  }

  submitBtn.textContent = 'Send Message';
  submitBtn.disabled = false;
});

/* =============================================
   ACTIVE NAV LINK ON SCROLL
============================================= */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--accent)'
          : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

document.getElementById("year").textContent = new Date().getFullYear();
