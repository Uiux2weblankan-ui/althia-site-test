# ALTHIA: test backend on Netlify

This build adds two things to the static site:

1. **A content manager at `/admin/` (Decap CMS).** Editors can change Insights posts (news, events and research, including the event photo-gallery carousels) and the homepage (countdown banner and video reviews) without touching code. Every save is committed to the site's Git repository, and Netlify redeploys automatically in about 30 seconds.
2. **Netlify Forms.** The Contact page enquiry form and the event "Register now" popup now send real submissions. They appear under **Netlify › Forms**, with email notifications if you switch them on.

There's no database or server to maintain. The editable content is stored in `content/insights.json` and `content/home.json`, and uploaded images go to `assets/uploads/`.

> **Important:** the content manager only works when the Netlify site is deployed from a **Git repository** (GitHub, GitLab or Bitbucket). Drag-and-drop or zip deploys can show the site and collect forms, but `/admin/` can't save changes.

---

## One-time setup (about 15 minutes)

### 1. Put the site in a GitHub repository
- Create a **private** repo, e.g. `althia-site`.
- Upload the contents of this folder to the repo root, so that `index.html` sits at the top level. GitHub's "Add file › Upload files" works, as does GitHub Desktop.
- Commit to the `main` branch.

### 2. Connect the Netlify site to the repo
In Netlify, open the test site (`leafy-custard-ca18a3`):
- **Site configuration › Build & deploy › Continuous deployment › Link repository**, then choose the repo.
- Branch: `main` · Build command: *(leave empty)* · Publish directory: `/` *(root)*.
- Deploy. The site should look exactly as before.

### 3. Turn on login for editors
- **Site configuration › Identity › Enable Identity**.
- **Registration:** set to **Invite only**.
- **Services › Git Gateway › Enable Git Gateway.** This lets the CMS save to the repo on the editor's behalf.
- **Identity tab › Invite users:** enter your email.

### 4. Accept the invite
- Open the email and click the link. It opens the site, where you set a password, and then sends you to **/admin/**.
- From then on, log in at `https://leafy-custard-ca18a3.netlify.app/admin/`.

### 5. Turn on forms
- **Forms › Enable form detection**, then trigger a new deploy (Deploys › Trigger deploy).
- After the deploy, two forms appear: **enquiry** and **event-registration**.
- **Site configuration › Forms › Form notifications › Add notification › Email notification**: send each form to the admissions inbox.

---

## Using the content manager
- **Insights › News, events & research:** add, edit, reorder or delete posts.
  - **Type** (News / Event / Research) controls which fields are used. Events need Time and Venue; research needs Researchers and Findings.
  - **Page ID** becomes the link: `insights-detail.html?p=<page-id>`. Don't change it after publishing.
  - **Photo gallery (carousel):** upload event photos and add captions. They appear as the carousel at the end of the article.
  - **Featured story:** switch it on for one post, which becomes the big story on the Insights page.
  - Upcoming events show in the "Upcoming events" box automatically, based on their date.
- **Homepage › Countdown & video reviews:**
  - Change the countdown event (title, start time, texts and link) or hide the banner.
  - Videos: paste a YouTube link. With no link, the tile shows "Video coming soon".
- Click **Publish** to go live. Changes appear about 30 seconds later, after Netlify redeploys.

## Built-in safety
- The news list and the video list can never be saved empty.
- If a save would remove more than one post or video at once, the editor asks "Are you sure?" first. Cancel stops the save.
- Every save is a Git commit, so any change can be undone from GitHub's history.

## How it works
- `admin/index.html` and `admin/config.yml` define the CMS and its fields.
- `assets/cms-content.js` loads `content/*.json` into the pages. Each page still contains its original content as a **fallback**, so the site never shows an empty page if the JSON can't load.
- The forms use Netlify's built-in handling, with a hidden honeypot field against spam bots.

## Notes for going live
- **Git Gateway:** it's officially deprecated by Netlify (it still works, but gets security fixes only). For production you can switch editors to GitHub login. The commented `backend: github` block in `admin/config.yml` shows how; each editor then needs a GitHub account with access to the repo.
- **Netlify Identity:** Netlify reversed its deprecation in February 2026, and it's included on credit-based plans.
- **Limits:** check your Netlify plan's limits for form submissions and Identity users.
- **Not yet in the CMS:** staff profiles, short courses, testimonials and FAQs are still edited in the HTML. They can be moved into the CMS the same way if this test works well.

## Run the CMS on your own computer (optional)
From the site folder, run these two commands in separate terminals:
```
npx decap-server            # local Git proxy, port 8081
npx serve -l 8080 .         # any static server
```
Open `http://localhost:8080/admin/`. Saves are written directly to your local files, with no login needed.
