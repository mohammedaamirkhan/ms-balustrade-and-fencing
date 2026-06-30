# MS Balustrade and Fencing Static Website

This is a responsive static website built with HTML, CSS, JavaScript, and Bootstrap 5.

## Pages
- `index.html` - Home
- `about.html` - AboutUs
- `services.html` - Services
- `project.html` - Project gallery
- `contact.html` - Contact form

## Contact form email setup
A purely static website cannot send email by itself without a form service or backend. The form is already prepared for Formspree.

To make the form send submissions to your email:
1. Create a free or paid Formspree form at https://formspree.io/
2. Copy your form endpoint. It will look like: `https://formspree.io/f/yourFormId`
3. Open `contact.html`
4. Replace `https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID` with your real endpoint
5. Upload the files to your hosting provider

Alternative options: Netlify Forms, EmailJS, PHP mail script, or a custom backend API.

## Customisation
Search for these placeholders and replace them:
- `MS Balustrade and Fencing`
- `info@msbalustradeandfencing.com.au`
- `0400 000 000`
- `Lidcombe NSW 2141`
- `Sydney and surrounding areas`

## Run locally
Open `index.html` directly in your browser, or serve the folder with any static web server.


## Business details used in this version
- Business name: MS Balustrade and Fencing
- Domain: msbalustradeandfencing.com.au
- Placeholder email: info@msbalustradeandfencing.com.au
- Location: Lidcombe NSW 2141
- Service area: Sydney and surrounding areas
- ABN: 61 292 621 504
- Contractor Licence: 493985C

Update the phone number and email address if you use different contact details.


Logo and photo section updates
------------------------------
- The logo file is saved at `assets/ms-logo.jpeg` and is used in the website header and footer.
- The Home page now has an "Our work photos" section.
- To add your real photos, replace these files in the `assets` folder with your own images, keeping the same names where possible:
  - `gallery-1.svg`
  - `gallery-2.svg`
  - `gallery-3.svg`
  - `gallery-4.svg`
  - `gallery-5.svg`
  - `gallery-6.svg`
- You can also edit the image paths directly in `index.html`.


## Project photo gallery

The website now includes your real project photos. To keep the website efficient:

- Home page shows selected photos only.
- Project page shows the full gallery with category filters.
- Images are saved as optimized WebP files.
- Small thumbnails load first for speed.
- Larger images open only when a visitor clicks a photo.
- All gallery images use lazy loading.

Photo folders:

- `assets/photos/thumbs/` - small thumbnails used on the page
- `assets/photos/full/` - larger click-to-view images

To add more photos later, create both a thumbnail and a full image, then add another gallery item in `index.html` or `project.html`.


## Home page photos

The Home page gallery has been updated with the latest 9 selected project photos. Optimized WebP versions are stored in `assets/photos/full/` and `assets/photos/thumbs/`.


## Home hero logo overlay
The Home page work photos show the company logo as a small overlay on each photo. To adjust its size or position, edit `.photo-logo-overlay` in `style.css`.


## Company description update
The website now describes MS Balustrade and Fencing as a provider of high-quality, durable and stylish fencing and balustrade solutions for residential and commercial properties. It mentions custom balustrades, pool fencing, fencing, security fencing, swing gates, double gates, sliding gates and free quotation.


## Latest updates
- Added AboutUs page with company information.
- Moved enlarged image popup title inside the popup above the image.
- Added AboutUs navigation link.
- Reduced header/navigation font weight for clearer reading.
- Updated wording to use Balustrades and free quotation messaging.


## Scroll-to-top and project descriptions

- A floating Back to Top button appears after visitors scroll down the page.
- On the Project page, clicking a gallery category such as Fencing, Balustrades, Gates, Privacy Screens or Custom Work updates the short description above the gallery.


## Static customer reviews section

The Home page now uses static customer review cards instead of live Google Reviews.

To add a new review:
1. Open `index.html`.
2. Search for `id="staticReviewsTrack"`.
3. Copy one complete `<article class="review-card"> ... </article>` block.
4. Paste it below the existing review cards.
5. Change the title, review text, customer name and service label.

The review slider moves automatically from right to left. Visitors can also use the left and right arrows to move faster.
