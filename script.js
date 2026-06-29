document.addEventListener('DOMContentLoaded', async () => {
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  const forms = document.querySelectorAll('form[data-contact-form]');
  forms.forEach((form) => {
    form.addEventListener('submit', () => {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending...';
      }
    });
  });

  // Load gallery data and render items from gallery-data.json
  const buildGallery = async () => {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    try {
      const res = await fetch('gallery-data.json');
      if (!res.ok) throw new Error('Failed to load gallery-data.json');
      const data = await res.json();
      data.forEach((item) => {
        // normalize category names used by filters
        let category = item.category || '';
        if (category === 'Balustrading') category = 'Balustrades';

        const col = document.createElement('div');
        col.className = 'col-sm-6 col-lg-4 gallery-item';
        col.setAttribute('data-category', category);

        const a = document.createElement('a');
        a.className = 'photo-card gallery-link';
        a.href = `assets/photos/full/${item.slug}`;
        a.setAttribute('data-title', item.title || '');
        a.setAttribute('data-category', category);

        const img = document.createElement('img');
        img.src = `assets/photos/full/${item.slug}`;
        img.alt = `${item.title || ''} by MS Balustrade and Fencing`;
        img.loading = 'lazy';
        img.width = 700;
        img.height = 520;

        const caption = document.createElement('div');
        caption.className = 'photo-caption';
        caption.innerHTML = `<span>${category}</span>${item.title || ''}`;

        a.appendChild(img);
        a.appendChild(caption);
        col.appendChild(a);
        grid.appendChild(col);
      });
    } catch (err) {
      // if gallery fails to load, leave grid empty
      // console.error(err);
    }
  };

  await buildGallery();

  const filterButtons = document.querySelectorAll('[data-filter]');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const setGalleryFilter = (filter) => {
    updateProjectDescription(filter);
    filterButtons.forEach((btn) => btn.classList.toggle('active', btn.getAttribute('data-filter') === filter));
    galleryItems.forEach((item) => {
      item.hidden = item.getAttribute('data-category') !== filter;
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setGalleryFilter(button.getAttribute('data-filter'));
    });
  });

  const modalElement = document.getElementById('galleryModal');
  const modalImage = document.getElementById('galleryModalImage');
  const modalTitle = document.getElementById('galleryModalTitle');
  if (modalElement && modalImage && window.bootstrap) {
    const modal = new bootstrap.Modal(modalElement);
    const modalPrev = modalElement.querySelector('[data-gallery-prev]');
    const modalNext = modalElement.querySelector('[data-gallery-next]');
    const galleryLinks = Array.from(document.querySelectorAll('.gallery-link'));
    let activeGalleryLinks = [];
    let activeGalleryIndex = 0;

    const setModalNavVisibility = () => {
      const showNav = activeGalleryLinks.length > 1;
      if (modalPrev) modalPrev.hidden = !showNav;
      if (modalNext) modalNext.hidden = !showNav;
    };

    const showGalleryImage = (index) => {
      if (!activeGalleryLinks.length) return;
      activeGalleryIndex = (index + activeGalleryLinks.length) % activeGalleryLinks.length;
      const activeLink = activeGalleryLinks[activeGalleryIndex];
      modalImage.src = activeLink.getAttribute('href');
      modalImage.alt = activeLink.dataset.title || 'Project photo';
      modalImage.classList.remove('is-zooming');
      void modalImage.offsetWidth;
      modalImage.classList.add('is-zooming');
      if (modalTitle) {
        modalTitle.textContent = activeLink.dataset.title || '';
      }
      setModalNavVisibility();
    };

    const openGalleryModal = (link) => {
      const category = link.dataset.category || '';
      activeGalleryLinks = galleryLinks.filter((item) => item.dataset.category === category);
      if (!activeGalleryLinks.length) activeGalleryLinks = [link];
      activeGalleryIndex = Math.max(0, activeGalleryLinks.indexOf(link));
      showGalleryImage(activeGalleryIndex);
      modal.show();
    };

    galleryLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        openGalleryModal(link);
      });
    });

    if (modalPrev) modalPrev.addEventListener('click', () => showGalleryImage(activeGalleryIndex - 1));
    if (modalNext) modalNext.addEventListener('click', () => showGalleryImage(activeGalleryIndex + 1));
    modalElement.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') showGalleryImage(activeGalleryIndex - 1);
      if (event.key === 'ArrowRight') showGalleryImage(activeGalleryIndex + 1);
    });
    modalElement.addEventListener('hidden.bs.modal', () => {
      modalImage.src = '';
      modalImage.classList.remove('is-zooming');
    });
  }


  const reviewsCarousel = document.getElementById('staticReviewsCarousel');
  const reviewsTrack = document.getElementById('staticReviewsTrack');
  if (reviewsCarousel && reviewsTrack) {
    const reviewCards = Array.from(reviewsTrack.querySelectorAll('.review-card'));
    const nextBtn = document.querySelector('[data-review-next]');
    const prevBtn = document.querySelector('[data-review-prev]');
    let activeReviewIndex = 0;
    let pendingReviewFrame = null;
    let reviewTimer = null;

    const getMaxScroll = () => Math.max(0, reviewsCarousel.scrollWidth - reviewsCarousel.clientWidth);

    const setReviewControlState = () => {
      if (prevBtn) prevBtn.disabled = reviewsCarousel.scrollLeft <= 2;
      if (nextBtn) nextBtn.disabled = reviewsCarousel.scrollLeft >= getMaxScroll() - 2;
    };

    const updateActiveReview = () => {
      const scrollLeft = reviewsCarousel.scrollLeft;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      reviewCards.forEach((card, index) => {
        const distance = Math.abs(card.offsetLeft - scrollLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      activeReviewIndex = closestIndex;
      if (scrollLeft >= getMaxScroll() - 2) {
        activeReviewIndex = reviewCards.length - 1;
      }
      setReviewControlState();
    };

    const scrollToReview = (index) => {
      if (!reviewCards.length) return;
      activeReviewIndex = Math.max(0, Math.min(index, reviewCards.length - 1));
      const card = reviewCards[activeReviewIndex];
      const cardRight = card.offsetLeft + card.offsetWidth;
      const target = activeReviewIndex === reviewCards.length - 1
        ? cardRight - reviewsCarousel.clientWidth
        : card.offsetLeft;
      reviewsCarousel.scrollTo({
        left: Math.max(0, Math.min(target, getMaxScroll())),
        behavior: 'smooth'
      });
    };

    const stopReviewAutoplay = () => {
      window.clearInterval(reviewTimer);
      reviewTimer = null;
    };

    const startReviewAutoplay = () => {
      if (reviewCards.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      stopReviewAutoplay();
      reviewTimer = window.setInterval(() => {
        if (activeReviewIndex >= reviewCards.length - 1 || reviewsCarousel.scrollLeft >= getMaxScroll() - 2) {
          activeReviewIndex = 0;
          reviewsCarousel.scrollTo({ left: 0, behavior: 'auto' });
          setReviewControlState();
          return;
        }
        scrollToReview(activeReviewIndex + 1);
      }, 3500);
    };

    const restartReviewAutoplay = () => {
      stopReviewAutoplay();
      startReviewAutoplay();
    };

    if (nextBtn) nextBtn.addEventListener('click', () => {
      scrollToReview(activeReviewIndex + 1);
      restartReviewAutoplay();
    });
    if (prevBtn) prevBtn.addEventListener('click', () => {
      scrollToReview(activeReviewIndex - 1);
      restartReviewAutoplay();
    });
    reviewsCarousel.addEventListener('scroll', () => {
      if (pendingReviewFrame) return;
      pendingReviewFrame = window.requestAnimationFrame(() => {
        pendingReviewFrame = null;
        updateActiveReview();
      });
    }, { passive: true });
    reviewsCarousel.addEventListener('mouseenter', stopReviewAutoplay);
    reviewsCarousel.addEventListener('mouseleave', startReviewAutoplay);
    reviewsCarousel.addEventListener('focusin', stopReviewAutoplay);
    reviewsCarousel.addEventListener('focusout', startReviewAutoplay);
    window.addEventListener('resize', setReviewControlState);
    setReviewControlState();
    startReviewAutoplay();
  }


  const projectDescription = document.getElementById('projectCategoryDescription');
  const projectDescriptions = {
    Fencing: {
      title: 'Fence builds',
      text: 'Boundary, Colorbond, pool and security fencing examples with clean lines, strong materials and site-specific layouts.'
    },
    Balustrades: {
      title: 'Balustrade installs',
      text: 'Glass and metal balustrade work for balconies, stairs, decks and outdoor areas where safety and presentation both matter.'
    },
    Gates: {
      title: 'Gate installations',
      text: 'Side access, driveway, swing, double and sliding gate examples designed for smooth movement and secure everyday use.'
    },
    'Privacy Screens': {
      title: 'Screening details',
      text: 'Slat and privacy screen examples for balconies, side paths, front yards and outdoor living spaces.'
    },
    'Custom Work': {
      title: 'Custom fabrication',
      text: 'Made-to-measure doors, panels, pool glass and special finishes shaped around unusual spaces or design requirements.'
    }
  };

  const updateProjectDescription = (filter) => {
    if (!projectDescription) return;
    const details = projectDescriptions[filter] || projectDescriptions.Fencing;
    projectDescription.innerHTML = `<h2>${details.title}</h2><p>${details.text}</p>`;
  };

  if (projectDescription) {
    const activeFilter = document.querySelector('[data-filter].active')?.getAttribute('data-filter') || 'Fencing';
    setGalleryFilter(activeFilter);
  }

  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    const toggleBackToTop = () => {
      backToTopBtn.classList.toggle('show', window.scrollY > 260);
    };
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
