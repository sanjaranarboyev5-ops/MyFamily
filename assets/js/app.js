/**
 * 🏡 MyFamily Web App - Application Controller & Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Current app state
  let currentGalleryCategory = 'all';
  let currentLightboxIndex = 0;
  let currentFilteredGallery = [];
  let currentCalDate = new Date(); // Defaults to current date
  let selectedCalDay = null;
  let countdownInterval = null;

  // Initialize all components
  initTheme();
  initNavigation();
  renderHeroStats();
  renderFamilyMembers();
  renderGallery();
  renderMemories();
  initCalendar();
  initAdminPortal();
  initAmbientAudio();
  initGiftSystem();

  /* =========================================================================
     1. Theme Management (Light / Dark)
     ========================================================================= */
  function initTheme() {
    const savedTheme = window.familyStore.getTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        window.familyStore.setTheme(next);
        updateThemeIcon(next);
        showToast(`Mavzu: ${next === 'dark' ? 'Tungi rejim 🌙' : 'Kunduzgi rejim ☀️'}`);
      });
    }
  }

  function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  /* =========================================================================
     2. Navigation & Header Behavior
     ========================================================================= */
  function initNavigation() {
    const siteHeader = document.getElementById('siteHeader');
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    // Sticky header shadow
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    });

    // Mobile menu toggle
    if (mobileBtn && navLinks) {
      mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
      });

      // Close mobile menu when clicking any link
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
        });
      });
    }

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href*="${sectionId}"]`);
        if (link) {
          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        }
      });
    });
  }

  /* =========================================================================
     3. Hero Statistics
     ========================================================================= */
  function renderHeroStats() {
    const members = window.familyStore.getMembers();
    const gallery = window.familyStore.getGallery();
    const memories = window.familyStore.getMemories();

    const statMembers = document.getElementById('statMembersCount');
    const statPhotos = document.getElementById('statPhotosCount');
    const statMemories = document.getElementById('statMemoriesCount');

    if (statMembers) statMembers.textContent = members.length;
    if (statPhotos) statPhotos.textContent = `${gallery.length}+`;
    if (statMemories) statMemories.textContent = `${memories.length}+`;
  }

  /* =========================================================================
     4. Section 2: Oilamiz (Our Family)
     ========================================================================= */
  function renderFamilyMembers() {
    const grid = document.getElementById('familyMembersGrid');
    if (!grid) return;

    const members = window.familyStore.getMembers();
    grid.innerHTML = '';

    members.forEach(member => {
      const card = document.createElement('div');
      card.className = 'member-card';

      // Format birth date in readable Uzbek
      const birthFormatted = formatDateUz(member.birthDate);

      // Render hobbies tags
      const hobbiesHtml = (member.hobbies || [])
        .map(h => `<span class="hobby-pill">${escapeHtml(h)}</span>`)
        .join('');

      card.innerHTML = `
        <div class="member-image-box">
          <img src="${member.image}" alt="${escapeHtml(member.name)}" loading="lazy">
          <div class="member-badge-role">${escapeHtml(member.role)}</div>
        </div>
        <div class="member-body">
          <h3 class="member-name">${escapeHtml(member.name)}</h3>
          <div class="member-subrole">${escapeHtml(member.subRole || '')}</div>
          
          <div class="member-meta">
            <div class="meta-item">
              <span class="meta-icon">🎂</span>
              <span>${birthFormatted} (${calculateAge(member.birthDate)} yosh)</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">💼</span>
              <span>${escapeHtml(member.profession || '')}</span>
            </div>
          </div>

          <div class="member-hobbies">
            ${hobbiesHtml}
          </div>

          <blockquote class="member-quote">
            "${escapeHtml(member.quote || '')}"
          </blockquote>

          <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
            <button class="btn-card" data-member-id="${member.id}" style="flex: 1;">
              <span>ℹ️</span> Batafsil
            </button>
            <button class="btn-primary btn-gift-member" data-member-id="${member.id}" style="padding: 0.55rem 0.95rem; font-size: 0.85rem;" title="Tavallud kuniga sovg‘a va tilak yo‘llash">
              <span>🎁</span> Sovg‘a
            </button>
          </div>
        </div>
      `;

      // Open detail modal click
      const btn = card.querySelector('.btn-card');
      btn.addEventListener('click', () => {
        openMemberModal(member.id);
      });

      // Open gift modal click
      const giftBtn = card.querySelector('.btn-gift-member');
      giftBtn.addEventListener('click', () => {
        openGiftModal(member.id);
      });

      grid.appendChild(card);
    });
  }

  // Open Member Detail Modal
  function openMemberModal(memberId) {
    const member = window.familyStore.getMember(memberId);
    if (!member) return;

    const modal = document.getElementById('memberDetailModal');
    const body = document.getElementById('memberModalBody');
    if (!modal || !body) return;

    const hobbiesList = (member.hobbies || []).map(h => `<li>✨ ${escapeHtml(h)}</li>`).join('');

    body.innerHTML = `
      <div class="member-modal-hero">
        <img src="${member.image}" class="member-modal-img" alt="${escapeHtml(member.name)}">
        <div>
          <span class="section-badge" style="margin-bottom: 0.4rem;">${escapeHtml(member.role)}</span>
          <h2 style="font-size: 1.8rem; margin-bottom: 0.3rem;">${escapeHtml(member.name)}</h2>
          <p style="color: var(--primary); font-weight: 700;">${escapeHtml(member.subRole || '')}</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin-bottom: 1.8rem; background: var(--bg-secondary); padding: 1.2rem; border-radius: var(--radius-md);">
        <div>
          <strong style="font-size: 0.85rem; color: var(--text-muted);">Tug‘ilgan kuni:</strong>
          <div style="font-weight: 700;">${formatDateUz(member.birthDate)} (${calculateAge(member.birthDate)} yosh)</div>
        </div>
        <div>
          <strong style="font-size: 0.85rem; color: var(--text-muted);">Faoliyati / Kasbi:</strong>
          <div style="font-weight: 700;">${escapeHtml(member.profession || 'Nomaʼlum')}</div>
        </div>
        <div>
          <strong style="font-size: 0.85rem; color: var(--text-muted);">Sevimli taomi:</strong>
          <div style="font-weight: 700;">${escapeHtml(member.favoriteDish || 'Osh')}</div>
        </div>
        <div>
          <strong style="font-size: 0.85rem; color: var(--text-muted);">Aloqa / Telegram:</strong>
          <div style="font-weight: 700; color: var(--primary);">${escapeHtml(member.telegram || member.phone || 'Oila ichki')}</div>
        </div>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="margin-bottom: 0.5rem; font-size: 1.05rem;">Qiziqish va sevimli mashg‘ulotlari:</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.95rem; color: var(--text-secondary);">
          ${hobbiesList}
        </ul>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="margin-bottom: 0.5rem; font-size: 1.05rem;">Xarakteri haqida:</h4>
        <p style="color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem;">
          ${escapeHtml(member.character || 'Har doim oilasi baxti va tinchligi uchun jon kuydiruvchi mehribon inson.')}
        </p>
      </div>

      <div style="background: var(--primary-light); padding: 1.2rem; border-radius: var(--radius-md); border-left: 4px solid var(--primary); margin-bottom: 1.5rem;">
        <strong style="color: var(--primary); display: block; font-size: 0.85rem; margin-bottom: 0.3rem;">Oltin shiori:</strong>
        <p style="font-style: italic; font-weight: 600; color: var(--text-primary); margin: 0;">
          "${escapeHtml(member.quote || '')}"
        </p>
      </div>

      <div>
        <button class="btn-primary" id="openGiftFromModalBtn" style="width: 100%; justify-content: center; padding: 0.75rem 1.2rem; box-shadow: var(--shadow-glow);">
          <span>🎁</span> ${escapeHtml(member.name)}ga sovg‘a va tilak yo‘llash
        </button>
      </div>
    `;

    // Hook gift button inside modal
    const modalGiftBtn = body.querySelector('#openGiftFromModalBtn');
    if (modalGiftBtn) {
      modalGiftBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        openGiftModal(member.id);
      });
    }

    modal.classList.add('active');
  }

  // Close Member modal
  const memberModalClose = document.getElementById('memberModalCloseBtn');
  const memberModal = document.getElementById('memberDetailModal');
  if (memberModalClose && memberModal) {
    memberModalClose.addEventListener('click', () => memberModal.classList.remove('active'));
    memberModal.addEventListener('click', (e) => {
      if (e.target === memberModal) memberModal.classList.remove('active');
    });
  }

  /* =========================================================================
     5. Section 3: Fotoalbom (Gallery & Lightbox)
     ========================================================================= */
  function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    const allItems = window.familyStore.getGallery();
    currentFilteredGallery = currentGalleryCategory === 'all' 
      ? allItems 
      : allItems.filter(item => item.category === currentGalleryCategory);

    grid.innerHTML = '';

    if (currentFilteredGallery.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; color: var(--text-muted);">
          Bu bo‘limda hozircha rasmlar yo‘q. Shaxsiy kabinet orqali yangi surat yuklashingiz mumkin.
        </div>
      `;
      return;
    }

    currentFilteredGallery.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'gallery-card';

      const catLabel = getCategoryLabel(item.category);

      card.innerHTML = `
        <div class="gallery-thumb-wrap">
          <img src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy">
          <div class="gallery-overlay">
            <div class="gallery-top-badges">
              <span class="gallery-category-badge">${catLabel}</span>
              <button class="gallery-like-pill" data-id="${item.id}" title="Yurakcha qo‘yish">
                <span>❤️</span> <span class="like-num">${item.likes || 0}</span>
              </button>
            </div>
            
            <div class="zoom-hint">🔍</div>

            <div class="gallery-info-box">
              <h4 class="gallery-item-title">${escapeHtml(item.title)}</h4>
              <div class="gallery-item-meta">
                <span>📅 ${formatDateUz(item.date)}</span>
                <span>📍 ${escapeHtml(item.location || 'Oila')}</span>
              </div>
            </div>
          </div>
        </div>
      `;

      // Click card to open lightbox
      card.addEventListener('click', (e) => {
        // If clicked on like button, don't open modal
        if (e.target.closest('.gallery-like-pill')) {
          e.stopPropagation();
          const likes = window.familyStore.toggleLikeGallery(item.id);
          card.querySelector('.like-num').textContent = likes;
          showToast(`Sizga "${item.title}" rasmi yoqdi ❤️`);
          return;
        }
        openLightbox(index);
      });

      grid.appendChild(card);
    });
  }

  // Category Filter buttons
  const filterBtns = document.querySelectorAll('#galleryFilters .filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGalleryCategory = btn.dataset.category;
      renderGallery();
    });
  });

  // Lightbox Implementation
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxLikeBtn = document.getElementById('lightboxLikeBtn');
  const lightboxLikeCount = document.getElementById('lightboxLikeCount');
  const lightboxDownloadBtn = document.getElementById('lightboxDownloadBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

  function openLightbox(index) {
    if (!currentFilteredGallery[index]) return;
    currentLightboxIndex = index;
    updateLightboxContent();
    lightboxModal.classList.add('active');
  }

  function updateLightboxContent() {
    const item = currentFilteredGallery[currentLightboxIndex];
    if (!item) return;

    lightboxImg.src = item.image;
    lightboxTitle.textContent = item.title;
    lightboxDesc.textContent = `${item.location ? item.location + ' • ' : ''}${formatDateUz(item.date)} — ${item.description || ''}`;
    lightboxLikeCount.textContent = item.likes || 0;
    lightboxDownloadBtn.href = item.image;
  }

  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentLightboxIndex = (currentLightboxIndex - 1 + currentFilteredGallery.length) % currentFilteredGallery.length;
      updateLightboxContent();
    });
  }

  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentLightboxIndex = (currentLightboxIndex + 1) % currentFilteredGallery.length;
      updateLightboxContent();
    });
  }

  if (lightboxLikeBtn) {
    lightboxLikeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = currentFilteredGallery[currentLightboxIndex];
      if (item) {
        const likes = window.familyStore.toggleLikeGallery(item.id);
        lightboxLikeCount.textContent = likes;
        renderGallery(); // update card counter as well
        showToast('Rasmga yurakcha bosildi! ❤️');
      }
    });
  }

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', () => lightboxModal.classList.remove('active'));
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) lightboxModal.classList.remove('active');
    });
  }

  // Keyboard navigation for lightbox
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') lightboxModal.classList.remove('active');
    if (e.key === 'ArrowLeft' && lightboxPrevBtn) lightboxPrevBtn.click();
    if (e.key === 'ArrowRight' && lightboxNextBtn) lightboxNextBtn.click();
  });

  /* =========================================================================
     6. Section 4: Xotiralar (Memories Timeline)
     ========================================================================= */
  function renderMemories(searchTerm = '') {
    const timeline = document.getElementById('memoriesTimeline');
    if (!timeline) return;

    let memories = window.familyStore.getMemories();

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      memories = memories.filter(m => 
        (m.title && m.title.toLowerCase().includes(term)) ||
        (m.text && m.text.toLowerCase().includes(term)) ||
        (m.author && m.author.toLowerCase().includes(term)) ||
        (m.tag && m.tag.toLowerCase().includes(term))
      );
    }

    timeline.innerHTML = '';

    if (memories.length === 0) {
      timeline.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
          Bunday so‘rov bo‘yicha xotiralar topilmadi.
        </div>
      `;
      return;
    }

    memories.forEach((mem) => {
      const item = document.createElement('div');
      item.className = 'timeline-item';

      const snippet = mem.text.length > 130 ? mem.text.substring(0, 130) + '...' : mem.text;

      item.innerHTML = `
        <div class="timeline-node"></div>
        <div class="memory-card">
          ${mem.image ? `<img src="${mem.image}" class="memory-card-image" alt="${escapeHtml(mem.title)}" loading="lazy">` : ''}
          <div class="memory-card-content">
            <div class="memory-tag-row">
              <span class="memory-tag">${escapeHtml(mem.tag || 'Xotira')}</span>
              <span class="memory-date">📅 ${formatDateUz(mem.date)}</span>
            </div>
            
            <h3 class="memory-title">${escapeHtml(mem.title)}</h3>
            <p class="memory-snippet">${escapeHtml(snippet)}</p>

            <div class="memory-footer">
              <div class="memory-author">
                <span>✍️</span> ${escapeHtml(mem.author || 'Oila')}
              </div>
              <div class="memory-actions">
                <button class="gallery-like-pill" data-id="${mem.id}" style="color: var(--text-primary); background: var(--bg-secondary);">
                  <span>❤️</span> <span class="like-num">${mem.likes || 0}</span>
                </button>
                <button class="btn-read-memory" data-id="${mem.id}">
                  To‘liq o‘qish ➔
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Read full memory button
      const readBtn = item.querySelector('.btn-read-memory');
      readBtn.addEventListener('click', () => openMemoryReader(mem.id));

      // Like memory button
      const likeBtn = item.querySelector('.gallery-like-pill');
      likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const likes = window.familyStore.toggleLikeMemory(mem.id);
        likeBtn.querySelector('.like-num').textContent = likes;
        showToast(`"${mem.title}" xotirasi sizga yoqdi ❤️`);
      });

      timeline.appendChild(item);
    });
  }

  // Memory search input
  const memorySearchInput = document.getElementById('memorySearchInput');
  if (memorySearchInput) {
    memorySearchInput.addEventListener('input', (e) => {
      renderMemories(e.target.value.trim());
    });
  }

  // Open Full Memory Reader Modal
  function openMemoryReader(memoryId) {
    const memory = window.familyStore.getMemories().find(m => m.id === memoryId);
    if (!memory) return;

    const modal = document.getElementById('memoryReaderModal');
    const body = document.getElementById('memoryReaderBody');
    if (!modal || !body) return;

    body.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <span class="section-badge">${escapeHtml(memory.tag || 'Xotira')}</span>
        <h2 style="font-size: 2rem; margin-top: 0.5rem; margin-bottom: 0.5rem;">${escapeHtml(memory.title)}</h2>
        <div style="display: flex; gap: 1rem; color: var(--text-muted); font-size: 0.9rem;">
          <span>📅 ${formatDateUz(memory.date)}</span>
          <span>✍️ Muallif: <strong>${escapeHtml(memory.author)}</strong></span>
          ${memory.location ? `<span>📍 ${escapeHtml(memory.location)}</span>` : ''}
        </div>
      </div>

      ${memory.image ? `
        <div style="margin-bottom: 1.5rem; border-radius: var(--radius-md); overflow: hidden; max-height: 380px;">
          <img src="${memory.image}" style="width: 100%; height: 380px; object-fit: cover;" alt="${escapeHtml(memory.title)}">
        </div>
      ` : ''}

      <div style="font-size: 1.05rem; line-height: 1.8; color: var(--text-secondary); white-space: pre-line; margin-bottom: 2rem;">
        ${escapeHtml(memory.text)}
      </div>

      <div style="padding-top: 1rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 0.85rem; color: var(--text-muted);">Aliyevlar oilaviy xotiralari daftari</div>
        <button class="btn-primary" id="modalMemoryLikeBtn" style="font-size: 0.9rem; padding: 0.5rem 1.2rem;">
          ❤️ Yoqdi (${memory.likes || 0})
        </button>
      </div>
    `;

    const likeBtn = body.querySelector('#modalMemoryLikeBtn');
    likeBtn.addEventListener('click', () => {
      const likes = window.familyStore.toggleLikeMemory(memory.id);
      likeBtn.textContent = `❤️ Yoqdi (${likes})`;
      renderMemories(memorySearchInput ? memorySearchInput.value.trim() : '');
      showToast('Xotiraga samimiy yurakcha qo‘shildi! ❤️');
    });

    modal.classList.add('active');
  }

  // Close Memory Reader modal
  const memoryReaderClose = document.getElementById('memoryReaderCloseBtn');
  const memoryReaderModal = document.getElementById('memoryReaderModal');
  if (memoryReaderClose && memoryReaderModal) {
    memoryReaderClose.addEventListener('click', () => memoryReaderModal.classList.remove('active'));
    memoryReaderModal.addEventListener('click', (e) => {
      if (e.target === memoryReaderModal) memoryReaderModal.classList.remove('active');
    });
  }

  /* =========================================================================
     7. Section 5: Oilaviy Kalendar & Live Birthday Countdown
     ========================================================================= */
  function initCalendar() {
    renderCalendarDays();
    renderUpcomingEventsList();
    startBirthdayCountdown();

    const prevBtn = document.getElementById('calPrevMonth');
    const nextBtn = document.getElementById('calNextMonth');
    const quickAddBtn = document.getElementById('quickAddEventBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentCalDate.setMonth(currentCalDate.getMonth() - 1);
        renderCalendarDays();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentCalDate.setMonth(currentCalDate.getMonth() + 1);
        renderCalendarDays();
      });
    }

    if (quickAddBtn) {
      quickAddBtn.addEventListener('click', () => {
        // Scroll to admin portal and activate events tab
        document.getElementById('kabinet').scrollIntoView({ behavior: 'smooth' });
        if (window.familyStore.isAuthenticated()) {
          switchAdminTab('tab-events');
        } else {
          showToast('Yangi sana kiritish uchun parolni kiriting 🔐');
        }
      });
    }
  }

  function renderCalendarDays() {
    const daysGrid = document.getElementById('calendarDaysGrid');
    const monthTitle = document.getElementById('calendarMonthTitle');
    if (!daysGrid || !monthTitle) return;

    const year = currentCalDate.getFullYear();
    const month = currentCalDate.getMonth();

    const monthNamesUz = [
      'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
      'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
    ];

    monthTitle.textContent = `${monthNamesUz[month]} ${year}`;

    // Get first day of month (0 = Sun, 1 = Mon ... 6 = Sat)
    // Convert to Monday = 0, Sunday = 6
    const firstDayIndex = new Date(year, month, 1).getDay();
    const startOffset = (firstDayIndex + 6) % 7; 

    // Days in current month
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Events in this month
    const events = window.familyStore.getEvents();

    daysGrid.innerHTML = '';

    // Empty lead cells
    for (let i = 0; i < startOffset; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'cal-day empty';
      daysGrid.appendChild(emptyCell);
    }

    const today = new Date();

    for (let day = 1; day <= totalDays; day++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day';
      cell.textContent = day;

      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Check if today
      if (
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === day
      ) {
        cell.classList.add('today');
      }

      // Check if has event (match MM-DD for recurring or full YYYY-MM-DD)
      const hasEvent = events.some(e => {
        if (!e.date) return false;
        const eMonthDay = e.date.substring(5); // MM-DD
        const curMonthDay = dateStr.substring(5);
        return e.date === dateStr || eMonthDay === curMonthDay;
      });

      if (hasEvent) {
        cell.classList.add('has-event');
      }

      // Day click
      cell.addEventListener('click', () => {
        document.querySelectorAll('.cal-day').forEach(c => c.classList.remove('selected'));
        cell.classList.add('selected');
        selectedCalDay = dateStr;
        filterEventsByDay(dateStr);
      });

      daysGrid.appendChild(cell);
    }
  }

  function filterEventsByDay(dateStr) {
    const list = document.getElementById('calendarEventsList');
    if (!list) return;

    const events = window.familyStore.getEvents();
    const curMonthDay = dateStr.substring(5);

    const matching = events.filter(e => e.date === dateStr || (e.date && e.date.substring(5) === curMonthDay));

    if (matching.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.9rem;">
          ${formatDateUz(dateStr)} sanasida hech qanday rejalashtirilgan tadbir yo‘q.
        </div>
      `;
    } else {
      renderEventsListHtml(matching);
    }
  }

  function renderUpcomingEventsList() {
    const list = document.getElementById('calendarEventsList');
    if (!list) return;

    const events = window.familyStore.getEvents();
    renderEventsListHtml(events);
  }

  function renderEventsListHtml(events) {
    const list = document.getElementById('calendarEventsList');
    list.innerHTML = '';

    if (events.length === 0) {
      list.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-muted);">Rejalashtirilgan voqealar mavjud emas.</div>`;
      return;
    }

    events.forEach(ev => {
      const card = document.createElement('div');
      card.className = 'event-item-card';

      const parts = ev.date ? ev.date.split('-') : ['2026', '01', '01'];
      const dayNum = parts[2] || '01';
      const monthNum = parseInt(parts[1] || '1', 10);
      const shortMonths = ['YAN', 'FEV', 'MAR', 'APR', 'MAY', 'IYUN', 'IYUL', 'AVG', 'SEN', 'OKT', 'NOY', 'DEK'];

      card.innerHTML = `
        <div class="event-date-badge">
          <span class="event-date-num">${dayNum}</span>
          <span class="event-date-month">${shortMonths[monthNum - 1]}</span>
        </div>
        <div class="event-details">
          <div class="event-name">${escapeHtml(ev.title)}</div>
          <div class="event-sub">${escapeHtml(ev.member ? ev.member + ' • ' : '')}${escapeHtml(ev.description || '')}</div>
        </div>
      `;

      list.appendChild(card);
    });
  }

  // Live Birthday Countdown to next birthday/anniversary
  function startBirthdayCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);

    const members = window.familyStore.getMembers();
    const events = window.familyStore.getEvents();
    
    // Find upcoming event
    const now = new Date();
    let nextTarget = null;
    let minDiff = Infinity;

    // Check all family members birthdays
    members.forEach(m => {
      if (!m.birthDate) return;
      const bParts = m.birthDate.split('-');
      const bMonth = parseInt(bParts[1], 10) - 1;
      const bDay = parseInt(bParts[2], 10);

      let targetDate = new Date(now.getFullYear(), bMonth, bDay, 0, 0, 0);
      if (targetDate.getTime() < now.getTime()) {
        targetDate = new Date(now.getFullYear() + 1, bMonth, bDay, 0, 0, 0);
      }

      const diff = targetDate.getTime() - now.getTime();
      if (diff < minDiff) {
        minDiff = diff;
        nextTarget = {
          memberId: m.id,
          name: `${m.name}ning tavallud kuni (${m.role})`,
          date: targetDate
        };
      }
    });

    const targetEl = document.getElementById('countdownTargetName');
    const daysEl = document.getElementById('timerDays');
    const hoursEl = document.getElementById('timerHours');
    const minEl = document.getElementById('timerMinutes');
    const secEl = document.getElementById('timerSeconds');

    if (!nextTarget || !targetEl) return;
    targetEl.textContent = nextTarget.name;

    // Attach recipient to countdown gift button
    const cdGiftBtn = document.getElementById('countdownSendGiftBtn');
    if (cdGiftBtn && nextTarget.memberId) {
      cdGiftBtn.onclick = () => openGiftModal(nextTarget.memberId);
    }

    function update() {
      const cur = new Date().getTime();
      const distance = nextTarget.date.getTime() - cur;

      if (distance < 0) {
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minEl) minEl.textContent = '00';
        if (secEl) secEl.textContent = '00';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minEl) minEl.textContent = String(minutes).padStart(2, '0');
      if (secEl) secEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    countdownInterval = setInterval(update, 1000);
  }

  /* =========================================================================
     7b. Birthday Gift & Wishes System Logic
     ========================================================================= */
  let currentGiftRecipientId = 'mother';
  let currentSelectedGift = {
    icon: '💐',
    title: 'Nafis gul dastalari'
  };

  const AVAILABLE_GIFTS = [
    { icon: '🎂', title: 'Katta bayramona tort', desc: 'Shirin tilaklar bilan' },
    { icon: '💐', title: 'Nafis gul dastalari', desc: 'Mehr va ehtirom gullari' },
    { icon: '🎁', title: 'Maxsus sirli quti', desc: 'Syurpriz va quvonch' },
    { icon: '🪕', title: 'Milliy naqshli dombra', desc: 'Qozoq kuyi va ohanglari' },
    { icon: '⌚', title: 'Qimmatbaho esdalik soati', desc: 'Har bir lahzangiz baxtli bo‘lsin' },
    { icon: '📚', title: 'Ziyoli kitoblar to‘plami', desc: 'Ziyo va tafakkur xazinasi' },
    { icon: '🏔️', title: 'Olmaota & Tog‘ sayohati', desc: 'Unutilmas sayr yo‘llanmasi' },
    { icon: '💝', title: 'Cheksiz mehr-oqibat', desc: 'Eng samimiy niyatlar' }
  ];

  const PRESET_WISHES = [
    'Tavallud ayyomingiz qutlug‘ bo‘lsin! Umringiz uzoq, taningiz doimo sog‘-omon, baxtingiz butun bo‘lsin!',
    'Tugan kúninizben quttıqtaymız! Xonadonimiz fayzi, doim baxtimizga kulib, sog‘-salomat yuring!',
    'Dunyodagi eng suyukli va mehribon insonimiz, har bir yangi yoshingiz ulkan quvonch va baraka keltirsin!',
    'Siz bizning eng buyuk suyanchimiz va ilhom manbaimizsiz. Har bir orzuingiz ijobat bo‘lsin!'
  ];

  function initGiftSystem() {
    renderGiftsWall();
    setupGiftModal();

    // Direct button
    const directBtn = document.getElementById('openGiftModalDirectBtn');
    if (directBtn) {
      directBtn.addEventListener('click', () => {
        openGiftModal(currentGiftRecipientId);
      });
    }

    // Countdown gift button
    const countdownGiftBtn = document.getElementById('countdownSendGiftBtn');
    if (countdownGiftBtn) {
      countdownGiftBtn.addEventListener('click', () => {
        openGiftModal(currentGiftRecipientId);
      });
    }
  }

  function openGiftModal(recipientId) {
    const members = window.familyStore.getMembers();
    const targetMember = members.find(m => m.id === recipientId) || members[0];
    currentGiftRecipientId = targetMember.id;

    const modal = document.getElementById('giftModal');
    if (!modal) return;

    updateRecipientPreview(targetMember);
    renderRecipientPills();
    renderGiftOptions();
    renderPresetWishes();

    modal.classList.add('active');
  }

  function updateRecipientPreview(member) {
    const previewEl = document.getElementById('recipientPreviewCard');
    if (!previewEl || !member) return;

    previewEl.innerHTML = `
      <img src="${member.image}" alt="${escapeHtml(member.name)}" style="width: 55px; height: 55px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary);">
      <div style="flex-grow: 1;">
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.2rem;">
          <h4 style="font-size: 1.05rem; margin: 0;">${escapeHtml(member.name)}</h4>
          <span class="hobby-pill" style="margin: 0; font-size: 0.75rem;">${escapeHtml(member.role)}</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-secondary);">
          🎂 Tavallud kuni: <strong>${formatDateUz(member.birthDate)}</strong>
        </div>
        <div style="font-size: 0.82rem; color: var(--primary);">
          💬 Aloqa: ${escapeHtml(member.telegram || member.phone || '')}
        </div>
      </div>
    `;
  }

  function renderRecipientPills() {
    const container = document.getElementById('giftRecipientPills');
    if (!container) return;

    const members = window.familyStore.getMembers();
    container.innerHTML = '';

    members.forEach(m => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `recipient-pill ${m.id === currentGiftRecipientId ? 'active' : ''}`;
      pill.innerHTML = `<span>${m.role.split(' ')[1] || '👤'}</span> <span>${m.role.split(' ')[0] || m.name}</span>`;
      pill.addEventListener('click', () => {
        currentGiftRecipientId = m.id;
        updateRecipientPreview(m);
        renderRecipientPills();
      });
      container.appendChild(pill);
    });
  }

  function renderGiftOptions() {
    const container = document.getElementById('giftOptionsGrid');
    if (!container) return;

    container.innerHTML = '';
    AVAILABLE_GIFTS.forEach(gift => {
      const card = document.createElement('div');
      const isSelected = currentSelectedGift.title === gift.title;
      card.className = `gift-option-card ${isSelected ? 'active' : ''}`;
      card.innerHTML = `
        <span class="gift-option-icon">${gift.icon}</span>
        <span class="gift-option-title">${escapeHtml(gift.title)}</span>
      `;
      card.addEventListener('click', () => {
        currentSelectedGift = gift;
        renderGiftOptions();
      });
      container.appendChild(card);
    });
  }

  function renderPresetWishes() {
    const container = document.getElementById('presetWishesChips');
    const textarea = document.getElementById('giftCustomMessage');
    if (!container || !textarea) return;

    container.innerHTML = '';
    PRESET_WISHES.forEach(wish => {
      const chip = document.createElement('div');
      chip.className = 'preset-wish-chip';
      chip.textContent = `✨ "${wish}"`;
      chip.addEventListener('click', () => {
        textarea.value = wish;
        textarea.focus();
        showToast('Tilak matnga qo‘yildi! ✨');
      });
      container.appendChild(chip);
    });
  }

  function setupGiftModal() {
    const modal = document.getElementById('giftModal');
    const closeBtn = document.getElementById('giftModalCloseBtn');
    const form = document.getElementById('giftSendForm');
    const telegramBtn = document.getElementById('giftSendTelegramBtn');

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = document.getElementById('giftCustomMessage').value.trim();
        const sender = document.getElementById('giftSenderName').value.trim();
        const member = window.familyStore.getMember(currentGiftRecipientId);

        if (!msg || !sender || !member) return;

        window.familyStore.addGift({
          recipientId: member.id,
          recipientName: `${member.name} (${member.role})`,
          senderName: sender,
          giftIcon: currentSelectedGift.icon,
          giftTitle: currentSelectedGift.title,
          message: msg
        });

        triggerCelebrationConfetti();
        showToast(`🎉 Sovg‘a va tabrigingiz ${member.name} uchun taqdim etildi!`);
        modal.classList.remove('active');
        form.reset();
        renderGiftsWall();
      });
    }

    if (telegramBtn) {
      telegramBtn.addEventListener('click', () => {
        const member = window.familyStore.getMember(currentGiftRecipientId);
        const msg = document.getElementById('giftCustomMessage').value.trim();
        const sender = document.getElementById('giftSenderName').value.trim();

        if (!member) return;

        const text = `🎁 *Tavallud ayyomingiz qutlug‘ bo‘lsin!* 🎂\n\n` +
          `Assalomu alaykum, qadrli ${member.name}!\n\n` +
          `🎁 *Taqdim etilgan sovg‘a:* ${currentSelectedGift.icon} ${currentSelectedGift.title}\n\n` +
          `💌 *Samimiy tilak:* "${msg || 'Tavallud ayyomingiz muborak bo‘lsin!'}"\n\n` +
          `✨ *Hurmat bilan:* ${sender || 'Ahil oilangiz'}\n\n` +
          `🏡 *MyFamily — Anarboyevlar qozoq xonadoni*`;

        const encoded = encodeURIComponent(text);
        let tgHandle = member.telegram ? member.telegram.replace('@', '') : '';
        let url = tgHandle ? `https://t.me/${tgHandle}?text=${encoded}` : `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encoded}`;
        window.open(url, '_blank');
      });
    }
  }

  function renderGiftsWall() {
    const grid = document.getElementById('giftsWallGrid');
    if (!grid) return;

    const gifts = window.familyStore.getGifts();
    if (!gifts || gifts.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; background: var(--surface-card); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎁</div>
          <p style="color: var(--text-secondary); margin: 0;">Hozircha sovg‘alar yo‘q. Birinchi bo‘lib oila a'zomizga sovg‘a yo‘llang!</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = '';
    gifts.forEach(g => {
      const card = document.createElement('div');
      card.className = 'gift-wall-card';
      card.innerHTML = `
        <div>
          <div class="gift-wall-header">
            <div class="gift-wall-icon">${g.giftIcon || '🎁'}</div>
            <div>
              <div class="gift-wall-recipient">Kimga: ${escapeHtml(g.recipientName)}</div>
              <div class="gift-wall-title">${escapeHtml(g.giftTitle || 'Sovg‘a')}</div>
            </div>
          </div>
          <div class="gift-wall-message">
            "${escapeHtml(g.message)}"
          </div>
        </div>
        <div class="gift-wall-footer">
          <span>💖 Kimdan: <strong>${escapeHtml(g.senderName)}</strong></span>
          <span>📅 ${formatDateUz(g.date)}</span>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // Celebratory confetti particles
  function triggerCelebrationConfetti() {
    try {
      const colors = ['#c86b3e', '#f39c12', '#2a9d8f', '#e76f51', '#f7b731', '#9b59b6'];
      for (let i = 0; i < 40; i++) {
        const piece = document.createElement('div');
        piece.style.position = 'fixed';
        piece.style.top = `${Math.random() * 40 + 20}%`;
        piece.style.left = `${Math.random() * 80 + 10}%`;
        piece.style.width = `${Math.random() * 10 + 6}px`;
        piece.style.height = `${Math.random() * 10 + 6}px`;
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.zIndex = '99999';
        piece.style.pointerEvents = 'none';
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;
        piece.style.transition = 'all 1.2s cubic-bezier(0.25, 1, 0.5, 1)';

        document.body.appendChild(piece);

        setTimeout(() => {
          piece.style.top = `${parseFloat(piece.style.top) + Math.random() * 30 + 15}%`;
          piece.style.opacity = '0';
          piece.style.transform = `scale(0.3) rotate(${Math.random() * 720}deg)`;
        }, 30);

        setTimeout(() => piece.remove(), 1300);
      }
    } catch {}
  }

  /* =========================================================================
     8. Section 6: Shaxsiy Kabinet (Admin Portal)
     ========================================================================= */
  function initAdminPortal() {
    const lockedState = document.getElementById('adminLockedState');
    const unlockedState = document.getElementById('adminUnlockedState');
    const loginForm = document.getElementById('adminLoginForm');
    const passwordInput = document.getElementById('adminPasswordInput');
    const logoutBtn = document.getElementById('adminLogoutBtn');
    const resetDataBtn = document.getElementById('resetDataBtn');
    const demoChip = document.getElementById('demoPassChip');

    function checkAuth() {
      const isAuth = window.familyStore.isAuthenticated();
      if (isAuth) {
        lockedState.style.display = 'none';
        unlockedState.style.display = 'block';
        loadAdminData();
      } else {
        lockedState.style.display = 'block';
        unlockedState.style.display = 'none';
      }
    }

    // Login Form Submit
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pass = passwordInput.value.trim();
        if (window.familyStore.login(pass)) {
          showToast('Shaxsiy kabinetga xush kelibsiz! 🎉');
          passwordInput.value = '';
          checkAuth();
        } else {
          showToast('Parol noto‘g‘ri! Demo: oilam2026', 'error');
        }
      });
    }

    // Demo chip one-click login
    if (demoChip) {
      demoChip.addEventListener('click', () => {
        if (passwordInput) passwordInput.value = 'oilam2026';
        if (window.familyStore.login('oilam2026')) {
          showToast('Demo hisob orqali muvaffaqiyatli kirildi! 🔑');
          checkAuth();
        }
      });
    }

    // Logout
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        window.familyStore.logout();
        showToast('Kabinetdan chiqildi.');
        checkAuth();
      });
    }

    // Reset data
    if (resetDataBtn) {
      resetDataBtn.addEventListener('click', () => {
        if (confirm('Barcha ma\'lumotlarni asl demo holatiga qaytarishni xohlaysizmi?')) {
          window.familyStore.resetDefaults();
          showToast('Barcha ma\'lumotlar tiklandi 🔄');
          renderHeroStats();
          renderFamilyMembers();
          renderGallery();
          renderMemories();
          renderCalendarDays();
          renderUpcomingEventsList();
          startBirthdayCountdown();
          loadAdminData();
        }
      });
    }

    // Admin Tab Switching
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        switchAdminTab(targetTab);
      });
    });

    // Form handlers
    setupMemberEditForm();
    setupAddPhotoForm();
    setupAddMemoryForm();
    setupAddEventForm();

    // Check initial auth state
    checkAuth();
  }

  function switchAdminTab(targetTab) {
    document.querySelectorAll('.admin-tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === targetTab);
    });
    document.querySelectorAll('.admin-pane').forEach(p => {
      p.classList.toggle('active', p.id === targetTab);
    });
  }

  function loadAdminData() {
    loadMemberToEdit();
    loadAdminGalleryList();
    loadAdminMemoriesList();
    loadAdminEventsList();
  }

  // --- Member Edit in Admin ---
  function setupMemberEditForm() {
    const select = document.getElementById('editMemberSelect');
    const form = document.getElementById('editMemberForm');

    if (select) {
      select.addEventListener('change', () => loadMemberToEdit());
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = select.value;
        const hobbiesStr = document.getElementById('memberFormHobbies').value;
        const hobbies = hobbiesStr.split(',').map(h => h.trim()).filter(Boolean);

        const updated = {
          name: document.getElementById('memberFormName').value.trim(),
          role: document.getElementById('memberFormRole').value.trim(),
          profession: document.getElementById('memberFormProfession').value.trim(),
          birthDate: document.getElementById('memberFormBirthDate').value,
          hobbies: hobbies,
          quote: document.getElementById('memberFormQuote').value.trim(),
          favoriteDish: document.getElementById('memberFormFood').value.trim(),
          telegram: document.getElementById('memberFormContact').value.trim(),
          character: document.getElementById('memberFormCharacter').value.trim()
        };

        window.familyStore.updateMember(id, updated);
        renderFamilyMembers();
        startBirthdayCountdown();
        showToast('Oila a\'zosi ma\'lumotlari yangilandi! 💾');
      });
    }
  }

  function loadMemberToEdit() {
    const select = document.getElementById('editMemberSelect');
    if (!select) return;
    const member = window.familyStore.getMember(select.value);
    if (!member) return;

    document.getElementById('memberFormName').value = member.name || '';
    document.getElementById('memberFormRole').value = member.role || '';
    document.getElementById('memberFormProfession').value = member.profession || '';
    document.getElementById('memberFormBirthDate').value = member.birthDate || '';
    document.getElementById('memberFormHobbies').value = (member.hobbies || []).join(', ');
    document.getElementById('memberFormQuote').value = member.quote || '';
    document.getElementById('memberFormFood').value = member.favoriteDish || '';
    document.getElementById('memberFormContact').value = member.telegram || member.phone || '';
    document.getElementById('memberFormCharacter').value = member.character || '';
  }

  // --- Add Photo in Admin ---
  let selectedPhotoBase64 = '';

  function setupAddPhotoForm() {
    const dropzone = document.getElementById('photoDropzone');
    const fileInput = document.getElementById('photoFileInput');
    const previewBox = document.getElementById('photoPreviewBox');
    const previewImg = document.getElementById('photoPreviewImg');
    const urlInput = document.getElementById('photoUrlInput');
    const form = document.getElementById('addPhotoForm');

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());
      
      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            selectedPhotoBase64 = e.target.result;
            previewImg.src = selectedPhotoBase64;
            previewBox.style.display = 'block';
            if (urlInput) urlInput.value = '';
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (urlInput) {
      urlInput.addEventListener('input', () => {
        if (urlInput.value.trim()) {
          selectedPhotoBase64 = urlInput.value.trim();
          previewImg.src = selectedPhotoBase64;
          previewBox.style.display = 'block';
        }
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const imageSrc = selectedPhotoBase64 || urlInput.value.trim() || 'assets/images/hero_family_cover.jpg';
        
        const newItem = {
          title: document.getElementById('photoTitleInput').value.trim(),
          category: document.getElementById('photoCategorySelect').value,
          location: document.getElementById('photoLocationInput').value.trim(),
          date: document.getElementById('photoDateInput').value || new Date().toISOString().split('T')[0],
          description: document.getElementById('photoDescInput').value.trim(),
          image: imageSrc
        };

        window.familyStore.addGalleryItem(newItem);
        renderGallery();
        renderHeroStats();
        loadAdminGalleryList();
        
        form.reset();
        selectedPhotoBase64 = '';
        previewBox.style.display = 'none';
        showToast('Fotoalbomga yangi rasm muvaffaqiyatli qo‘shildi! 📸');
      });
    }
  }

  function loadAdminGalleryList() {
    const list = document.getElementById('adminGalleryManageList');
    if (!list) return;

    const gallery = window.familyStore.getGallery();
    list.innerHTML = '';

    gallery.forEach(item => {
      const card = document.createElement('div');
      card.className = 'admin-mini-card';
      card.innerHTML = `
        <img src="${item.image}" class="admin-mini-img" alt="${escapeHtml(item.title)}">
        <div class="admin-mini-info">
          <div class="admin-mini-title">${escapeHtml(item.title)}</div>
          <div class="admin-mini-meta">${formatDateUz(item.date)} • ${item.likes || 0} ❤️</div>
        </div>
        <div class="admin-mini-actions">
          <button class="btn-mini-del" data-id="${item.id}" title="O‘chirish">🗑️</button>
        </div>
      `;

      card.querySelector('.btn-mini-del').addEventListener('click', () => {
        if (confirm(`"${item.title}" rasmini o‘chirishni xohlaysizmi?`)) {
          window.familyStore.deleteGalleryItem(item.id);
          renderGallery();
          renderHeroStats();
          loadAdminGalleryList();
          showToast('Rasm o‘chirildi 🗑️');
        }
      });

      list.appendChild(card);
    });
  }

  // --- Add Memory in Admin ---
  function setupAddMemoryForm() {
    const form = document.getElementById('addMemoryForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const newMem = {
        title: document.getElementById('memoryTitleInput').value.trim(),
        author: document.getElementById('memoryAuthorSelect').value,
        date: document.getElementById('memoryDateInput').value,
        tag: document.getElementById('memoryTagInput').value.trim(),
        image: document.getElementById('memoryImageInput').value.trim() || 'assets/images/gallery_travel.jpg',
        text: document.getElementById('memoryTextInput').value.trim()
      };

      window.familyStore.addMemory(newMem);
      renderMemories();
      renderHeroStats();
      loadAdminMemoriesList();
      
      form.reset();
      showToast('Yangi oilaviy xotira muvaffaqiyatli kiritildi! 📖');
    });
  }

  function loadAdminMemoriesList() {
    const list = document.getElementById('adminMemoriesManageList');
    if (!list) return;

    const memories = window.familyStore.getMemories();
    list.innerHTML = '';

    memories.forEach(m => {
      const card = document.createElement('div');
      card.className = 'admin-mini-card';
      card.innerHTML = `
        <div class="admin-mini-info">
          <div class="admin-mini-title">${escapeHtml(m.title)}</div>
          <div class="admin-mini-meta">${m.author} • ${formatDateUz(m.date)}</div>
        </div>
        <div class="admin-mini-actions">
          <button class="btn-mini-del" data-id="${m.id}" title="O‘chirish">🗑️</button>
        </div>
      `;

      card.querySelector('.btn-mini-del').addEventListener('click', () => {
        if (confirm(`"${m.title}" xotirasini o‘chirishni tasdiqlaysizmi?`)) {
          window.familyStore.deleteMemory(m.id);
          renderMemories();
          renderHeroStats();
          loadAdminMemoriesList();
          showToast('Xotira o‘chirildi 🗑️');
        }
      });

      list.appendChild(card);
    });
  }

  // --- Add Event in Admin ---
  function setupAddEventForm() {
    const form = document.getElementById('addEventForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const newEv = {
        title: document.getElementById('eventTitleInput').value.trim(),
        category: document.getElementById('eventCategorySelect').value,
        date: document.getElementById('eventDateInput').value,
        member: document.getElementById('eventMemberInput').value.trim() || 'Barchamiz',
        description: document.getElementById('eventDescInput').value.trim()
      };

      window.familyStore.addEvent(newEv);
      renderCalendarDays();
      renderUpcomingEventsList();
      startBirthdayCountdown();
      loadAdminEventsList();

      form.reset();
      showToast('Yangi sana kalendarga muvaffaqiyatli kiritildi! 📅');
    });
  }

  function loadAdminEventsList() {
    const list = document.getElementById('adminEventsManageList');
    if (!list) return;

    const events = window.familyStore.getEvents();
    list.innerHTML = '';

    events.forEach(e => {
      const card = document.createElement('div');
      card.className = 'admin-mini-card';
      card.innerHTML = `
        <div class="admin-mini-info">
          <div class="admin-mini-title">${escapeHtml(e.title)}</div>
          <div class="admin-mini-meta">${formatDateUz(e.date)} • ${escapeHtml(e.member || '')}</div>
        </div>
        <div class="admin-mini-actions">
          <button class="btn-mini-del" data-id="${e.id}" title="O‘chirish">🗑️</button>
        </div>
      `;

      card.querySelector('.btn-mini-del').addEventListener('click', () => {
        if (confirm(`"${e.title}" voqeasini kalendardan o‘chirishni xohlaysizmi?`)) {
          window.familyStore.deleteEvent(e.id);
          renderCalendarDays();
          renderUpcomingEventsList();
          startBirthdayCountdown();
          loadAdminEventsList();
          showToast('Sana o‘chirildi 🗑️');
        }
      });

      list.appendChild(card);
    });
  }

  /* =========================================================================
     9. Floating Ambient Audio Synthesizer (Zero External Dependencies)
     Lofi Acoustic Peaceful Chords
     ========================================================================= */
  let audioCtx = null;
  let isAudioPlaying = false;
  let audioTimer = null;

  function initAmbientAudio() {
    const btn = document.getElementById('ambientAudioBtn');
    const label = document.getElementById('audioLabel');
    if (!btn) return;

    btn.addEventListener('click', () => {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      if (isAudioPlaying) {
        stopAmbientSound();
        btn.classList.remove('playing');
        label.textContent = 'Fon musiqasi';
        showToast('Musiqa to‘xtatildi ⏸️');
      } else {
        startAmbientSound();
        btn.classList.add('playing');
        label.textContent = 'Musiqa yangramoqda';
        showToast('Sokin oilaviy ohang yoqildi 🎶');
      }
    });
  }

  function startAmbientSound() {
    isAudioPlaying = true;
    // Play warm melodic arpeggios (C - G - Am - F gentle bell-harp tones)
    const chordProgressions = [
      [261.63, 329.63, 392.00, 523.25], // C maj
      [196.00, 246.94, 293.66, 392.00], // G maj
      [220.00, 261.63, 329.63, 440.00], // A min
      [174.61, 220.00, 261.63, 349.23]  // F maj
    ];

    let chordIndex = 0;

    function playChord() {
      if (!isAudioPlaying || !audioCtx) return;
      const notes = chordProgressions[chordIndex % chordProgressions.length];
      chordIndex++;

      notes.forEach((freq, i) => {
        setTimeout(() => {
          if (!isAudioPlaying) return;
          playSoftTone(freq, 2.2);
        }, i * 400);
      });

      audioTimer = setTimeout(playChord, 3600);
    }

    playChord();
  }

  function playSoftTone(freq, duration) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Smooth attack and release envelope
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone error', e);
    }
  }

  function stopAmbientSound() {
    isAudioPlaying = false;
    if (audioTimer) clearTimeout(audioTimer);
  }

  /* =========================================================================
     10. Toast Notification System & Utility Helpers
     ========================================================================= */
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span>${type === 'error' ? '⚠️' : '✨'}</span>
      <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  function formatDateUz(dateString) {
    if (!dateString) return '';
    try {
      const parts = dateString.split('-');
      if (parts.length < 3) return dateString;
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const monthsUz = [
        'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
        'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
      ];
      return `${day}-${monthsUz[monthIndex]} ${year}-yil`;
    } catch {
      return dateString;
    }
  }

  function calculateAge(birthDateString) {
    if (!birthDateString) return 0;
    const birth = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  function getCategoryLabel(cat) {
    switch (cat) {
      case 'family': return '👨‍👩‍👦‍👦 Oilaviy';
      case 'celebration': return '🎂 Bayram';
      case 'travel': return '✈️ Sayohat';
      case 'daily': return '🏡 Kundalik';
      default: return '📸 Rasm';
    }
  }

  /* =========================================================================
     Ambient Audio Generator (Dombra & Lute Inspired Relaxing Melody)
     ========================================================================= */
  function initAmbientAudio() {
    const btn = document.getElementById('ambientAudioBtn');
    const label = document.getElementById('audioLabel');
    if (!btn) return;

    let isPlaying = false;
    let audioCtx = null;
    let timerId = null;

    // Dombra / pentatonic harmony notes (D4, G4, A4, C5, D5, E5)
    const notes = [293.66, 392.00, 440.00, 523.25, 587.33, 659.25];
    let noteIdx = 0;

    function playPluck(freq) {
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle'; // Soft acoustic string-like timbre
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        // Exponential decay envelope (pluck sound)
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
      } catch (e) {
        console.error(e);
      }
    }

    function step() {
      if (!isPlaying) return;
      playPluck(notes[noteIdx % notes.length]);
      noteIdx++;
      timerId = setTimeout(step, 900);
    }

    btn.addEventListener('click', () => {
      if (!isPlaying) {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        isPlaying = true;
        btn.classList.add('playing');
        if (label) label.textContent = 'Musiqa yangramoqda';
        showToast('Sokin milliy fon musiqasi yoqildi 🎵');
        step();
      } else {
        isPlaying = false;
        if (timerId) clearTimeout(timerId);
        btn.classList.remove('playing');
        if (label) label.textContent = 'Fon musiqasi';
        showToast('Fon musiqasi to‘xtatildi 🔇');
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
