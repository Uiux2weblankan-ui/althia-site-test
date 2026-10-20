# ALTHIA website — v4 (client change round, October 2026)

Static HTML site. Upload **everything in this folder** (all `.html` files and the `assets/` folder) to the web root. `index.html` is the homepage. No build step is needed.

## What's new
| Area | Change |
|---|---|
| All pages | White header with the colour ALTHIA logo · white ALTHIA logo in the footer · floating WhatsApp button (+94 76 330 6603) · chatbot (placeholder assistant) · every "Apply Now" now opens the SLIIT online application (https://apply.sliit.lk/) · LinkedIn added to the footer |
| Homepage | Hero banner is now a slightly taller 3-slide slider, with small SLIIT × Hemas logos above the two buttons on each slide · countdown banner for the upcoming Open Day · Programmes section now comes before About Us (cards A–Z) · new YouTube video reviews section |
| About Us | Senior Management cards open a popup profile with email and LinkedIn (Board of Directors cards show name and role only) · "Our lecturers" is now 4 programme cards (A–Z), each linking to that programme's Faculty section |
| Programmes landing | Numbers removed · programmes in alphabetical order · Short Courses added as section 5 |
| Programme pages (×4) | Course numbers replaced with icons · SLIIT + Deakin University logos above "Apply now" on every course card · student testimonials under the courses · USP section replaces the careers list · academic staff (faculty) section before Research, in alphabetical order, with popup and SLIIT profile link · research topic selector · FAQ |
| Short Courses | New filter: All, Biomedical Science, Health Science, Nursing, Psychology, General · the course popup's left panel is filled with a course image under a dark overlay |
| Campus | Gallery has two tabs: Images and Videos |
| Admissions | Entry requirements and apply form sections hidden (still in the HTML with `hidden`; remove it to show them again) · new CTA band to the SLIIT apply page |
| Contact | FAQ section added |
| Insights | Gallery section added (photos + videos, with a filter) · article pages: photo gallery carousel for the post (news and events) · share buttons removed from the end of articles |

All new styling is in `assets/v4.css` and all new behaviour is in `assets/v4.js`. Each page's original CSS and JS are unchanged apart from the edits listed above.

## Placeholder content: replace before launch
Real details from althia.netlify.app: phone numbers, WhatsApp, email, address, LinkedIn, and the SLIIT course pages. The Open Day date in the countdown comes from the site's own Insights data.

**Dummy, to be supplied by the client:**
- **Video IDs:** all video tiles show "Video coming soon" until a YouTube ID is added.
  - Homepage: `data-v4-yt=""` on each `.v4-vcard` in `index.html`
  - Insights: `data-v4-yt=""` on each `.v4-gi` video tile in `insights.html`
  - Campus: `v:''` in the `GAL` list in `campus-facilities.html`
  - Use the part after `v=` in the YouTube URL.
- **People:** names, roles, bios, emails (`firstname.x@althia.lk`), LinkedIn URLs (currently linkedin.com) and SLIIT profile URLs (currently sliit.lk). These are on the About Us team cards and the four programme Faculty sections. The data sits in the `data-*` attributes of each card.
- **Photos:** the article galleries reuse the site's existing placeholder photos. Replace them with real event photos.
- **Content:** student testimonials and video titles, programme FAQs and contact FAQs, USP texts, and the research topic labels.
- **Chatbot:** this is a placeholder with canned answers. When a provider is chosen, replace the "floating WhatsApp + chatbot" block in `assets/v4.js` with their embed code.

## How to…
- **Article photo galleries (carousel):** in `insights-detail.html`, edit `ARTICLE_GALLERY` near the top of the scripts. Each post ID maps to a list of photos: image keys from `IMG`, or full image URLs. Remove a post's entry to hide its gallery.
- **Hide a research paper:** on the programme page, set `data-showcase="no"` on that paper's `<a class="rc …">`. Use `"yes"` to show it.
- **Change the countdown event:** in `index.html`, search for `data-v4-countdown` and edit the date (ISO format with `+05:30`), the title and the link.
- **Show the hidden admissions sections:** in `admissions.html`, remove `hidden` and the `v4-hidden` class from `#requirements` and `#apply`.
