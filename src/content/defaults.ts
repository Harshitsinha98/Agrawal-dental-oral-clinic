/**
 * Starting content. The website shows this until the same document is published
 * in Sanity, and `npm run seed` copies it into Sanity so the doctor starts from
 * filled-in forms instead of empty ones.
 *
 * Facts taken from the clinic's Google Business Profile (Nov 2026): name, address,
 * category (implants, periodontist), services, 4.7 rating, 180 reviews, closed
 * Sunday, opens 10 am. Everything marked CONFIRM still needs checking with the clinic.
 */

import type { AboutPage, Doctor, Faqs, Gallery, Homepage, Reviews, Settings, Treatment } from "@/lib/types";
import type { PortableTextBlock } from "next-sanity";

let k = 0;
const key = () => `d${(++k).toString(36)}`;

/** Plain paragraphs → Portable Text, so defaults render with the same component as Sanity content. */
export function blocks(...paragraphs: string[]): PortableTextBlock[] {
  return paragraphs.map((text) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  }));
}

export const defaultSettings: Settings = {
  clinicName: "Agrawal Dental & Oral Care",
  shortName: "Agrawal Dental",
  tagline: "Implants, gum care and family dentistry in Bhopal",
  address: "New Minal Residency, A-13, Bhopal, Madhya Pradesh 462023",
  landmark: null,
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Agrawal+Dental+%26+Oral+Care+New+Minal+Residency+Bhopal",
  notice: { enabled: false, text: null },
  phone: null, // CONFIRM: full number (GMB banner shows "…246 19777")
  whatsapp: null, // CONFIRM: booking WhatsApp number
  email: null,
  // CONFIRM: only "closed Sunday, opens 10 am Monday" is known from Google.
  hours: [
    ...(["mon", "tue", "wed", "thu", "fri", "sat"] as const).map((day) => ({
      _key: key(),
      day,
      closed: false,
      sessions: [
        { from: "10:00", to: "14:00" },
        { from: "17:00", to: "21:00" },
      ],
    })),
    { _key: key(), day: "sun" as const, closed: true, sessions: [] },
  ],
  hoursNote: "In pain? Call before you come and we'll fit you in.",
  googleRating: 4.7,
  googleReviewCount: 180,
  googleReviewsUrl: "https://www.google.com/maps/search/?api=1&query=Agrawal+Dental+%26+Oral+Care+New+Minal+Residency+Bhopal",
  instagram: null,
  facebook: null,
  youtube: null,
  seo: {
    title: "Agrawal Dental & Oral Care | Dentist in Minal Residency, Bhopal",
    description: "Dental implants, gum treatment, root canals, crowns, dentures and children's dentistry at New Minal Residency, Bhopal. Book your visit on WhatsApp.",
  },
};

export const defaultTreatments: Treatment[] = [
  {
    title: "Dental Implants",
    slug: "dental-implants",
    icon: "implant",
    summary: "A fixed replacement for a missing tooth. A small titanium post takes the place of the root, and a crown goes on top.",
    featured: true,
    order: 1,
    body: blocks(
      "An implant is a small titanium post placed in the jawbone where a tooth is missing. Over a few months the bone grows around it and holds it firmly, the way it held the natural root. A crown is then fixed on top, so the new tooth looks and works like the others.",
      "Unlike a bridge, the teeth on either side are not cut down. Unlike a denture, nothing comes out at night. Implants can also hold a full set of teeth in place for people who find their dentures loose.",
      "Before planning an implant we check your gums and the amount of bone with an X-ray, and ask about health conditions such as diabetes and about smoking, because these affect healing.",
    ),
    duration: "About 1 hour to place the implant",
    visits: "3–4 visits over 3–6 months",
    steps: [
      { _key: key(), title: "Check-up and X-ray", text: "We look at the gap, your gums and the bone, and explain the plan and cost before anything starts." },
      { _key: key(), title: "Placing the implant", text: "Done under local anaesthesia. Most people compare it to having a tooth taken out." },
      { _key: key(), title: "Healing", text: "The bone bonds with the implant over roughly 3 months. A temporary tooth can be given if the gap shows." },
      { _key: key(), title: "Fixing the crown", text: "A crown matched to your other teeth is fixed on the implant." },
    ],
    aftercare: [
      "Eat soft food and chew on the other side for the first few days.",
      "Avoid smoking. It is the most common reason implants fail to heal.",
      "Brush and clean around the implant like a natural tooth.",
      "Come for check-ups so we can keep an eye on the gum around it.",
    ],
    faqs: [
      { _key: key(), question: "Is getting an implant painful?", answer: "The area is numbed, so you feel pressure but not pain during the procedure. Mild soreness for two or three days afterwards is normal and settles with the medicines we prescribe." },
      { _key: key(), question: "Can I get an implant if I have diabetes?", answer: "Often yes, if the sugar is well controlled. We'll ask for a recent report and plan around it." },
    ],
  },
  {
    title: "Gum Treatment",
    slug: "gum-treatment",
    icon: "gums",
    summary: "For bleeding or swollen gums, bad breath, and teeth that feel loose. Treating gums early can save teeth.",
    featured: true,
    order: 2,
    body: blocks(
      "Gums that bleed when you brush, look red or swollen, or have started to pull back from the teeth are usually a sign of gum disease. It starts with plaque and tartar along the gum line. Left alone, it slowly destroys the bone that holds the teeth, which is why teeth become loose.",
      "Early gum disease (gingivitis) clears up with a professional cleaning and better brushing. When the bone is already affected (periodontitis), we clean below the gum line, and in some cases do minor gum surgery to reach deep pockets.",
      "Gum health also matters for implants, crowns and bridges. Any of these lasts longer on healthy gums.",
    ),
    duration: "45–60 minutes per session",
    visits: "1–4 sessions, then regular maintenance",
    steps: [
      { _key: key(), title: "Gum check", text: "We measure the space between gum and tooth at several points and take X-rays to see the bone." },
      { _key: key(), title: "Deep cleaning", text: "Tartar is removed from above and below the gum line, usually under local anaesthesia." },
      { _key: key(), title: "Review", text: "After 4–6 weeks we measure again to see how the gums have healed." },
      { _key: key(), title: "Maintenance", text: "A cleaning every 3–6 months keeps the problem from coming back." },
    ],
    aftercare: [
      "Some sensitivity to cold for a week or two is common after deep cleaning.",
      "Keep brushing gently twice a day, even if the gums bleed at first.",
      "Clean between the teeth with floss or an interdental brush as shown.",
    ],
    faqs: [
      { _key: key(), question: "My gums bleed when I brush. Should I stop brushing there?", answer: "No. Bleeding means the gums are inflamed, and stopping makes it worse. Keep brushing gently and get your gums checked." },
      { _key: key(), question: "Can loose teeth be saved?", answer: "Often, if treatment starts before too much bone is lost. The X-ray tells us how much support is left." },
    ],
  },
  {
    title: "Root Canal Treatment",
    slug: "root-canal-treatment",
    icon: "rootCanal",
    summary: "Saves a tooth with deep decay or infection, and stops the pain, instead of taking the tooth out.",
    featured: true,
    order: 3,
    body: blocks(
      "Inside every tooth is soft tissue with nerves and blood vessels, called the pulp. Deep decay, a crack or an old large filling can let bacteria reach it. The result is often throbbing pain, pain at night, long sensitivity to hot food, or a swelling near the tooth.",
      "In a root canal treatment the infected pulp is removed, the canals are cleaned and shaped, and then sealed. The tooth stays in your mouth and keeps working.",
      "A tooth that has had a root canal, especially a back tooth, becomes more brittle, so we usually advise a crown on it.",
    ),
    duration: "45–90 minutes per visit",
    visits: "1–3 visits",
    steps: [
      { _key: key(), title: "X-ray and numbing", text: "We confirm the problem on an X-ray and numb the tooth completely." },
      { _key: key(), title: "Cleaning the canals", text: "The infected pulp is removed and the canals are cleaned and disinfected." },
      { _key: key(), title: "Sealing", text: "The canals are filled and sealed so bacteria cannot get back in." },
      { _key: key(), title: "Crown", text: "A crown protects the tooth from breaking when you chew." },
    ],
    aftercare: [
      "Don't chew hard food on the tooth until the final filling or crown is done.",
      "Mild tenderness for a few days is normal.",
      "Call us if swelling increases or the pain gets worse instead of better.",
    ],
    faqs: [
      { _key: key(), question: "Does a root canal hurt?", answer: "With the tooth numbed, most people say it feels like getting a filling. The treatment removes the cause of the pain, so it usually feels better afterwards, not worse." },
      { _key: key(), question: "Isn't it simpler to remove the tooth?", answer: "Removing it is quicker, but the gap then needs a bridge or an implant to stop the other teeth from shifting. Keeping your own tooth is usually the better choice." },
    ],
  },
  {
    title: "Crowns & Bridges",
    slug: "crowns-and-bridges",
    icon: "crown",
    summary: "A crown covers and protects a weak or broken tooth. A bridge replaces a missing tooth using the teeth next to it.",
    featured: true,
    order: 4,
    body: blocks(
      "A crown, or cap, fits over the whole tooth. It is used after a root canal, on a tooth that is cracked or heavily filled, or to improve the shape and colour of a front tooth.",
      "A bridge replaces one or more missing teeth. The teeth on either side of the gap get crowns, and the new tooth is joined between them, all in one piece that is cemented in place.",
      "We'll talk you through the materials, such as metal-ceramic, zirconia or all-ceramic, and how they differ in look, strength and cost.",
    ),
    duration: "45–60 minutes per visit",
    visits: "2–3 visits",
    steps: [
      { _key: key(), title: "Preparing the tooth", text: "The tooth is shaped under local anaesthesia so the crown fits over it." },
      { _key: key(), title: "Measurement", text: "An impression is taken and the shade is matched to your teeth." },
      { _key: key(), title: "Temporary cap", text: "You wear a temporary crown while the final one is made." },
      { _key: key(), title: "Fitting", text: "We check the bite and fix the final crown or bridge." },
    ],
    aftercare: [
      "Avoid sticky food on the temporary crown.",
      "Clean under a bridge with floss threaders or a water flosser.",
    ],
    faqs: [
      { _key: key(), question: "How long does a crown last?", answer: "Many last 10 years or more. Gum health, grinding and how well the area is cleaned make the biggest difference." },
    ],
  },
  {
    title: "Dentures",
    slug: "dentures",
    icon: "denture",
    summary: "Full or partial removable teeth, made to fit comfortably. Can also be held in place with implants.",
    featured: true,
    order: 5,
    body: blocks(
      "Dentures replace missing teeth with a removable set. A complete denture replaces all the teeth in a jaw. A partial denture fills the gaps between your remaining teeth.",
      "A denture that fits well makes chewing and speaking easier and supports the cheeks and lips. If an old denture has become loose, it can often be relined. Two implants in the lower jaw can also make a denture far more stable.",
    ),
    duration: "30–45 minutes per visit",
    visits: "4–5 visits",
    steps: [
      { _key: key(), title: "Impressions", text: "We take measurements of both jaws." },
      { _key: key(), title: "Bite record", text: "We record how your jaws meet and choose the tooth shade and shape." },
      { _key: key(), title: "Trial", text: "You try the teeth set in wax, so changes can be made before the final denture." },
      { _key: key(), title: "Fitting and adjustment", text: "The denture is fitted, then adjusted over the next few days if any spot is sore." },
    ],
    aftercare: [
      "Take the denture out at night and keep it in water.",
      "Clean it every day with a soft brush. Don't use hot water, it can warp the denture.",
      "Come back if any area becomes sore. Small adjustments are normal.",
    ],
    faqs: [
      { _key: key(), question: "How long does it take to get used to a new denture?", answer: "Usually a few weeks. Speaking clearly comes first, and chewing harder food takes a little longer." },
    ],
  },
  {
    title: "Children's Dentistry",
    slug: "childrens-dentistry",
    icon: "child",
    summary: "Gentle check-ups, fillings and preventive care for milk teeth and growing smiles.",
    featured: true,
    order: 6,
    body: blocks(
      "A child's first dental visit should be around the first birthday, or when the first tooth comes in. Early visits are short and relaxed, so the clinic becomes a familiar place before any treatment is needed.",
      "We check for decay, apply fluoride and pit-and-fissure sealants to protect the chewing surfaces, treat decay in milk teeth, and keep an eye on how the adult teeth are coming in. We also talk to parents about thumb-sucking, bottle feeding at night and brushing.",
    ),
    duration: "15–30 minutes",
    visits: "A check-up every 6 months",
    steps: [
      { _key: key(), title: "Getting comfortable", text: "We show the chair and instruments first, and go at the child's pace." },
      { _key: key(), title: "Check-up", text: "We look at every tooth and the bite, and take an X-ray only if needed." },
      { _key: key(), title: "Protection", text: "Fluoride and sealants help prevent cavities." },
      { _key: key(), title: "Treatment if needed", text: "Fillings or other care for milk teeth, explained to the parent first." },
    ],
    faqs: [
      { _key: key(), question: "Milk teeth will fall out anyway. Why treat them?", answer: "They hold space for the adult teeth and help children chew and speak. A decayed milk tooth can cause pain and infection that can affect the adult tooth underneath." },
      { _key: key(), question: "When should my child start brushing with toothpaste?", answer: "From the first tooth, with a smear of fluoride toothpaste the size of a grain of rice. From age 3, a pea-sized amount." },
    ],
  },
  {
    title: "Scaling & Cleaning",
    slug: "scaling-and-cleaning",
    icon: "cleaning",
    summary: "Removes tartar and stains that brushing can't, keeps gums healthy and breath fresh.",
    featured: true,
    order: 7,
    body: blocks(
      "Even with good brushing, plaque hardens into tartar in places the brush misses. Tartar can only be removed at the clinic. Scaling uses an ultrasonic instrument and fine hand tools to remove it, and polishing smooths the teeth so plaque sticks less.",
      "For most people a cleaning every six months is enough. People with gum disease, diabetes, braces or a smoking habit may need it more often.",
    ),
    duration: "30–45 minutes",
    visits: "1 visit",
    aftercare: [
      "Teeth may feel sensitive for a few days. A sensitivity toothpaste helps.",
      "Avoid tea, coffee and tobacco for a few hours after polishing.",
    ],
    faqs: [
      { _key: key(), question: "Does cleaning damage the enamel or loosen teeth?", answer: "No. Sometimes gaps that were filled with tartar become visible after cleaning, which can feel strange, but the teeth are not loosened by it." },
    ],
  },
  {
    title: "Tooth Extraction",
    slug: "tooth-extraction",
    icon: "extraction",
    summary: "Careful removal of a tooth that can't be saved, including wisdom teeth.",
    featured: false,
    order: 8,
    body: blocks(
      "We always try to save a tooth first. When that isn't possible, because of severe decay, a broken root, advanced gum disease or a wisdom tooth with no room to come out, the tooth is removed under local anaesthesia.",
      "Before removing a tooth we talk about how the gap will be replaced, if it needs to be.",
    ),
    duration: "20–60 minutes",
    visits: "1 visit, plus a follow-up if stitches are placed",
    aftercare: [
      "Bite on the gauze for 30–45 minutes.",
      "For 24 hours, don't spit, rinse hard or use a straw, so the clot stays in place.",
      "Have cold, soft food for the first day.",
      "Don't smoke for at least 48 hours.",
    ],
    faqs: [
      { _key: key(), question: "Do all wisdom teeth need to come out?", answer: "No. Only those that cause pain, repeated swelling, decay, or damage the tooth next to them." },
    ],
  },
  {
    title: "Fillings",
    slug: "fillings",
    icon: "filling",
    summary: "Tooth-coloured fillings that repair cavities and small chips in a single visit.",
    featured: false,
    order: 9,
    body: blocks(
      "When decay is caught early, the damaged part is removed and the tooth is rebuilt with a tooth-coloured composite filling, matched to the shade of your tooth.",
      "Small cavities often don't hurt, which is why regular check-ups matter. A cavity that is left grows towards the nerve and may then need a root canal.",
    ),
    duration: "20–40 minutes",
    visits: "1 visit",
    faqs: [
      { _key: key(), question: "Can I eat right after a filling?", answer: "Yes, once the numbness wears off, so you don't bite your cheek or lip." },
    ],
  },
  {
    title: "Oral Medicine & Mouth Ulcers",
    slug: "oral-medicine",
    icon: "mouth",
    summary: "Diagnosis and care for mouth ulcers, burning mouth, dry mouth and white or red patches.",
    featured: false,
    order: 10,
    body: blocks(
      "Not every mouth problem is about the teeth. Recurring ulcers, a burning feeling in the tongue or mouth (burning mouth syndrome), dry mouth, and white or red patches need a careful examination to find the cause.",
      "Any ulcer or patch that has not healed in two to three weeks should be checked. If you use tobacco, gutkha or areca nut, a regular mouth check is important even when nothing hurts.",
    ),
    duration: "20–30 minutes",
    visits: "1 visit, with follow-up as needed",
    faqs: [
      { _key: key(), question: "What causes a burning feeling in the mouth?", answer: "It can be linked to dry mouth, vitamin deficiencies, acid reflux, some medicines, diabetes or hormonal changes, and sometimes no single cause is found. We look for causes we can treat first." },
    ],
  },
];

export const defaultDoctors: Doctor[] = [
  {
    name: "Dr. Agrawal", // CONFIRM: full name
    role: "Periodontist & implant dentist", // from the Google category; CONFIRM
    qualifications: null,
    experienceYears: null,
    registration: null,
    bio: blocks(
      "Add the doctor's background here from the Studio: where they studied, their speciality and what patients can expect at their first visit.",
    ),
    highlights: [],
  },
];

export const defaultHomepage: Homepage = {
  hero: {
    eyebrow: "Dentist at New Minal Residency, Bhopal",
    title: "Dental care that takes the time to explain.",
    highlight: "explain",
    text: "Implants, gum treatment, root canals and care for children. Tell us what's bothering you and send a booking request on WhatsApp.",
    bookLabel: "Book on WhatsApp",
  },
  sections: [
    {
      _type: "concernsSection",
      _key: key(),
      enabled: true,
      heading: "What brings you in?",
      intro: "Pick the closest one. We'll fill it in on the booking form for you.",
      items: [
        { _key: key(), label: "Tooth pain", icon: "pain", treatmentSlug: "root-canal-treatment" },
        { _key: key(), label: "Bleeding gums", icon: "gums", treatmentSlug: "gum-treatment" },
        { _key: key(), label: "Missing tooth", icon: "implant", treatmentSlug: "dental-implants" },
        { _key: key(), label: "Cleaning & check-up", icon: "cleaning", treatmentSlug: "scaling-and-cleaning" },
        { _key: key(), label: "My child's teeth", icon: "child", treatmentSlug: "childrens-dentistry" },
        { _key: key(), label: "Broken tooth", icon: "crown", treatmentSlug: "crowns-and-bridges" },
        { _key: key(), label: "Loose denture", icon: "denture", treatmentSlug: "dentures" },
        { _key: key(), label: "Mouth ulcer or burning", icon: "mouth", treatmentSlug: "oral-medicine" },
      ],
    },
    { _type: "statsSection", _key: key(), enabled: true, showGoogle: true, items: [] },
    {
      _type: "treatmentsSection",
      _key: key(),
      enabled: true,
      heading: "Treatments",
      intro: "From a routine cleaning to replacing missing teeth. Each page explains how it's done, how long it takes and how to look after it.",
      onlyFeatured: true,
    },
    { _type: "doctorsSection", _key: key(), enabled: true, heading: "Your dentist", intro: null },
    {
      _type: "safetySection",
      _key: key(),
      enabled: true,
      heading: "Every instrument, sterilised for every patient",
      intro: "This is the part of a dental visit people worry about most, so here is exactly what happens.", // CONFIRM steps with the clinic
      steps: [
        { _key: key(), title: "Cleaned", text: "Used instruments are scrubbed and cleaned to remove every trace of the last use.", icon: "hygiene" },
        { _key: key(), title: "Sealed", text: "They are packed into sealed sterilisation pouches.", icon: "sealed" },
        { _key: key(), title: "Steam sterilised", text: "The pouches go into an autoclave, which uses high-pressure steam to kill bacteria and viruses.", icon: "steam" },
        { _key: key(), title: "Opened in front of you", text: "Gloves, masks, needles and suction tips are single-use, and fresh pouches are opened at your appointment.", icon: "shield" },
      ],
    },
    { _type: "clinicSection", _key: key(), enabled: true, heading: "Inside the clinic", intro: "Clean, bright, and calm. Have a look before your first visit.", photos: [] },
    { _type: "beforeAfterSection", _key: key(), enabled: true, heading: "Before and after", intro: null, note: "Photos shared with the patient's permission. Results differ from person to person." },
    { _type: "reviewsSection", _key: key(), enabled: true, heading: "What patients say", intro: null },
    { _type: "faqSection", _key: key(), enabled: true, heading: "Questions people ask us", intro: null, limit: 6 },
    { _type: "visitSection", _key: key(), enabled: true, heading: "Visit us", intro: null },
    {
      _type: "ctaSection",
      _key: key(),
      enabled: true,
      heading: "Not sure what you need?",
      intro: "Send a request with your problem in a line or two. We'll reply on WhatsApp with a time.",
      buttonLabel: "Send a booking request",
    },
  ],
};

export const defaultAbout: AboutPage = {
  heading: "About the clinic",
  intro: "A neighbourhood dental clinic at New Minal Residency, with a special focus on gums and dental implants.",
  body: blocks(
    "Agrawal Dental & Oral Care looks after families from across Bhopal, from a child's first check-up to implants for grandparents. Edit this text in the Studio to tell the clinic's own story: when it opened, what the doctor believes in, and what patients can expect.",
  ),
  highlights: [
    { _key: key(), title: "Gum and implant care", text: "Healthy gums come first, because every other treatment depends on them." },
    { _key: key(), title: "Explained before it starts", text: "You'll know the plan, the number of visits and the cost before treatment begins." },
    { _key: key(), title: "The whole family", text: "Children, adults and older patients, all under one roof." },
  ],
};

export const defaultGallery: Gallery = {
  heading: "Gallery",
  intro: "The clinic, the team and our work.",
  photos: [],
  beforeAfter: [],
};

export const defaultReviews: Reviews = {
  heading: "Patient reviews",
  intro: "Real reviews from patients on Google.",
  items: [],
};

export const defaultFaqs: Faqs = {
  heading: "Questions",
  items: [
    { _key: key(), question: "How do I book an appointment?", answer: "Fill in the booking form on this website and press \"Send on WhatsApp\". Your request reaches the clinic on WhatsApp and we reply to confirm a time. You can also call us." },
    { _key: key(), question: "What should I bring to my first visit?", answer: "Any old dental X-rays or reports, a list of medicines you take, and details of conditions like diabetes, blood pressure or heart problems, or a pregnancy." },
    { _key: key(), question: "Will the treatment hurt?", answer: "Anything that could hurt is done under local anaesthesia. Tell us if you are nervous. We explain each step and you can raise a hand to pause at any time." },
    { _key: key(), question: "How often should I get my teeth checked?", answer: "Every six months for most people. If you have gum problems, diabetes or braces we may suggest more frequent visits." },
    { _key: key(), question: "Will I know the cost before treatment?", answer: "Yes. After the check-up we explain the options and their costs, and treatment starts only once you agree." },
    { _key: key(), question: "I have a toothache right now. What should I do?", answer: "Call the clinic and tell us. We try to see patients in pain the same day. Until then, take a painkiller you normally use and avoid very hot or cold food." },
    { _key: key(), question: "At what age should a child first see a dentist?", answer: "Around the first birthday, or when the first tooth appears." },
  ],
};
