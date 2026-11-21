# Agrawal Dental & Oral Care

Website for Agrawal Dental & Oral Care, New Minal Residency, A-13, Bhopal, with a Sanity CMS so the clinic can edit every text, photo and timing itself.

Next.js 16 · React 19 · Tailwind CSS v4 · Motion · Sanity (Studio at `/studio`)

```bash
npm install
cp .env.example .env.local   # works as is; the Sanity project ID is already filled in
npm run dev                  # http://localhost:3000, Studio at http://localhost:3000/studio
npm run build
```

## How content works

- All content comes from Sanity project `7sqg0qba`, dataset `production`.
- Until a document is published in Sanity, the site shows the starting content from `src/content/defaults.ts`, so it never renders empty.
- `npm run seed` copies that starting content into Sanity once, so the doctor opens the Studio to filled-in forms. It needs an Editor token (see below). It never overwrites existing documents unless you pass `--replace`. Use `npm run seed -- --dry` to print the documents without writing anything.
- Photos are uploaded in the Studio and served from Sanity's image CDN, cropped around the focus point the editor sets. Until a slot is filled in Sanity, the clinic's own photos bundled in `public/images/clinic/` (converted from `/images`) are shown, and patient videos come from `public/videos/`.
- `npm run seed` uploads those bundled photos and videos to Sanity too. The dataset currently holds test content from setup (a placeholder "Dr. Agrawal", placeholder timings, two test photos in the gallery). To replace it with the real content in one go: `SANITY_API_WRITE_TOKEN=… npm run seed -- --replace`. This overwrites any edits made in the Studio.

| Studio section | Controls |
|---|---|
| Home page | Top banner (heading, highlighted words, rotating "Specialists in …" words, photos, small video card), and the order / visibility of every home section, including video reviews, awards & honours, and camps & community |
| Clinic details, timings & WhatsApp | Name, logo, address, phone, **booking WhatsApp number**, weekly timings, notice bar, Google rating, social links |
| Treatments | One document per treatment page: summary, photo, steps, aftercare, FAQs, SEO |
| Doctors | Photo, degrees, speciality, experience, bio |
| Gallery & before/after | Photos with categories (drag to reorder), before/after pairs (only shown when "patient has given permission" is ticked) |
| Patient reviews, Questions | As named |
| About page | Story, highlights and the "Our journey" timeline |

## Booking

`/book` is a form that opens WhatsApp with a ready message to the number in **Clinic details → Phone & WhatsApp**. Nothing is stored on the server. The form validates the mobile number, blocks past dates and days the clinic is closed, and pre-selects the treatment from `/book?treatment=<slug>`. Until a WhatsApp number is set, the page shows a "call the clinic" message instead of the form.

## Where things are

| Path | Purpose |
|---|---|
| `sanity.config.ts` | Studio setup, sidebar structure, singletons |
| `src/sanity/schemas/` | CMS fields |
| `src/sanity/queries.ts` | GROQ queries |
| `src/lib/content.ts` | Fetches content and falls back to the defaults |
| `src/content/defaults.ts` | Starting content (also used by the seed script) |
| `src/app/(site)/` | Website pages |
| `src/app/studio/` | Embedded Studio |
| `src/app/api/revalidate/` | Webhook that refreshes the site on publish |
| `src/components/ui/` | Buttons, icons, motion helpers, image component |
| `src/components/fx/` | Animated effects (aurora, word rotate, marquee, tilt card, timeline, text reveal, border beam), adapted from 21st.dev / Aceternity UI / Magic UI patterns and built on Motion |
| `src/content/photos.ts` | The bundled clinic photo library with descriptions and blur placeholders |
| `.kiro/steering/ui-ux-pro-max/` | UI/UX Pro Max design skill (installed with `npx uipro-cli init --ai kiro`) |

## Setup checklist

1. **CORS:** sanity.io/manage → project → API → CORS origins → add `http://localhost:3000` and later the live domain, both with **Allow credentials**.
2. **Seed (optional, once):** API → Tokens → add an **Editor** token, then `SANITY_API_WRITE_TOKEN=… npm run seed`. Delete the token afterwards.
3. **Deploy** to Vercel (Pro plan for a commercial site) or Netlify. Environment variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SITE_URL`, `SANITY_REVALIDATE_SECRET`.
4. **Instant updates on publish:** sanity.io/manage → API → Webhooks → Create webhook
   - URL: `https://<domain>/api/revalidate`
   - Dataset: `production`, Trigger on: Create, Update, Delete
   - HTTP method: POST, Secret: same value as `SANITY_REVALIDATE_SECRET`

   Without the webhook, pages still refresh on their own every 10 minutes.
5. **Invite the doctor:** sanity.io/manage → Members → Invite, role Administrator. She logs in at `/studio` with Google or email + password.

## Still to confirm with the clinic

Search for `CONFIRM` in `src/content/defaults.ts`. Doctors, degrees, phone numbers, email, address and timings come from the clinic's signboard and "Know your doctor" brochure.

- Which number takes **WhatsApp bookings** (9424619777 is used for now)
- Dr. Kavita Agrawal's current years of experience (the brochure says "more than 12")
- Dental council registration numbers
- The sterilisation steps shown on the home page
- Patient permission for the video reviews before going live
- Logo file (a typeset wordmark with a red tooth mark is used until then)
- Final domain for `NEXT_PUBLIC_SITE_URL`
