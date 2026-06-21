document.addEventListener('DOMContentLoaded', () => {
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

  const filterButtons = document.querySelectorAll('[data-filter]');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      updateProjectDescription(filter);
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      galleryItems.forEach((item) => {
        const category = item.getAttribute('data-category');
        item.hidden = filter !== 'all' && category !== filter;
      });
    });
  });

  const modalElement = document.getElementById('galleryModal');
  const modalImage = document.getElementById('galleryModalImage');
  const modalTitle = document.getElementById('galleryModalTitle');
  if (modalElement && modalImage && window.bootstrap) {
    const modal = new bootstrap.Modal(modalElement);
    document.querySelectorAll('.gallery-link').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        modalImage.src = link.getAttribute('href');
        modalImage.alt = link.dataset.title || 'Project photo';
        if (modalTitle) {
          modalTitle.textContent = link.dataset.title || '';
        }
        modal.show();
      });
    });

    modalElement.addEventListener('hidden.bs.modal', () => {
      modalImage.src = '';
    });
  }


  const reviewsCarousel = document.getElementById('staticReviewsCarousel');
  const reviewsTrack = document.getElementById('staticReviewsTrack');
  if (reviewsCarousel && reviewsTrack) {
    const originalCards = Array.from(reviewsTrack.children);
    originalCards.forEach((card) => reviewsTrack.appendChild(card.cloneNode(true)));

    const getScrollStep = () => {
      const firstCard = reviewsTrack.querySelector('.review-card');
      if (!firstCard) return 360;
      const styles = window.getComputedStyle(reviewsTrack);
      const gap = parseFloat(styles.columnGap || styles.gap || 0) || 0;
      return firstCard.getBoundingClientRect().width + gap;
    };

    const normalizeScroll = () => {
      const halfway = reviewsTrack.scrollWidth / 2;
      if (reviewsCarousel.scrollLeft >= halfway) {
        reviewsCarousel.scrollLeft = reviewsCarousel.scrollLeft - halfway;
      }
      if (reviewsCarousel.scrollLeft < 0) {
        reviewsCarousel.scrollLeft = 0;
      }
    };

    const moveReviews = (direction = 1) => {
      normalizeScroll();
      reviewsCarousel.scrollBy({ left: getScrollStep() * direction, behavior: 'smooth' });
    };

    let reviewTimer = window.setInterval(() => moveReviews(1), 3500);
    const restartReviewTimer = () => {
      window.clearInterval(reviewTimer);
      reviewTimer = window.setInterval(() => moveReviews(1), 3500);
    };

    const nextBtn = document.querySelector('[data-review-next]');
    const prevBtn = document.querySelector('[data-review-prev]');
    if (nextBtn) nextBtn.addEventListener('click', () => { moveReviews(1); restartReviewTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { moveReviews(-1); restartReviewTimer(); });
    reviewsCarousel.addEventListener('scroll', () => window.requestAnimationFrame(normalizeScroll), { passive: true });
    reviewsCarousel.addEventListener('mouseenter', () => window.clearInterval(reviewTimer));
    reviewsCarousel.addEventListener('mouseleave', restartReviewTimer);
  }


  const projectDescription = document.getElementById('projectCategoryDescription');
  const projectDescriptions = {
    all: {
      title: 'All project examples',
      text: 'Browse our recent fencing, balustrades, gates, privacy screens and custom work. Select a category above to view examples and a short description for that service.'
    },
    Fencing: {
      title: 'Fencing projects',
      text: 'Durable fencing solutions for residential and commercial properties, including boundary fencing, pool fencing, security fencing and custom styles to suit your site.'
    },
    Balustrades: {
      title: 'Balustrades projects',
      text: 'Stylish and safe balustrades for balconies, stairs, decks, pool areas and outdoor spaces, installed with careful workmanship and attention to safety standards.'
    },
    Gates: {
      title: 'Gate projects',
      text: 'Custom swing gates, double gates, sliding gates, side access gates and security gates designed for easy access, privacy and a clean finish.'
    },
    'Privacy Screens': {
      title: 'Privacy screen projects',
      text: 'Modern privacy screens for balconies, front yards, side areas and outdoor spaces, helping improve privacy while enhancing the look of your property.'
    },
    'Custom Work': {
      title: 'Custom work projects',
      text: 'Made-to-measure solutions for unique spaces, including custom doors, feature panels, special finishes and tailored metal or timber work.'
    }
  };

  const updateProjectDescription = (filter) => {
    if (!projectDescription) return;
    const details = projectDescriptions[filter] || projectDescriptions.all;
    projectDescription.innerHTML = `<h2>${details.title}</h2><p>${details.text}</p>`;
  };

  if (projectDescription) {
    updateProjectDescription('all');
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
