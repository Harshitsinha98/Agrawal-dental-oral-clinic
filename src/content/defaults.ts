/**
 * Starting content. The website shows this until the same document is published
 * in Sanity, and `npm run seed` copies it (photos included) into Sanity so the doctors
 * start from filled-in forms instead of empty ones.
 *
 * Facts come from the clinic's own signboard and "Know your doctor" brochure (photos in
 * /images) and its Google Business Profile (4.7 rating, 180 reviews). Anything marked
 * CONFIRM still needs checking with the clinic.
 */

import type { AboutPage, Doctor, Faqs, Gallery, Homepage, Reviews, Settings, Treatment } from "@/lib/types";
import type { PortableTextBlock } from "next-sanity";
import { photo, photos } from "./photos";

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

const morning = { from: "10:00", to: "13:00" };
const evening = { from: "17:00", to: "21:00" };

export const defaultSettings: Settings = {
  clinicName: "Agrawal Dental & Oral Care",
  shortName: "Agrawal Dental",
  tagline: "Specialist gum, implant and oral medicine care in Bhopal, from two MDS doctors trained at KGMC Lucknow.",
  address: "A-13, New Minal Residency, Gate No. 3 Main Road, Ayodhya Bypass Road, Bhopal, Madhya Pradesh 462023",
  landmark: "Near Gate No. 3, New Minal Residency",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Agrawal+Dental+%26+Oral+Care+New+Minal+Residency+Bhopal",
  notice: { enabled: false, text: null },
  phone: "9424619777", // from the signboard and brochure
  otherPhones: ["07552682870", "7869935125"],
  whatsapp: "9424619777", // CONFIRM: which number takes WhatsApp bookings
  email: "dna7kgmc@gmail.com",
  // From the brochure: mornings 10 am – 1 pm every day, evenings 5 – 9 pm, Sunday evening closed.
  hours: [
    ...(["mon", "tue", "wed", "thu", "fri", "sat"] as const).map((day) => ({ _key: key(), day, closed: false, sessions: [morning, evening] })),
    { _key: key(), day: "sun" as const, closed: false, sessions: [morning] },
  ],
  hoursNote: "In pain? Call before you come and we'll fit you in.",
  googleRating: 4.7,
  googleReviewCount: 180,
  googleReviewsUrl: "https://www.google.com/maps/search/?api=1&query=Agrawal+Dental+%26+Oral+Care+New+Minal+Residency+Bhopal",
  instagram: null,
  facebook: "https://www.facebook.com/dentalgumsandulcerspecialist/",
  youtube: null,
  footerHeading: "Specialist care for every smile in the family.",
  footerHighlight: "smile",
  pageImages: {
    treatments: photo("treatment-hall"),
    gallery: photo("corridor-awards-wall"),
    reviews: photo("dr-kavita-child-patient"),
    contact: photo("clinic-exterior-night"),
    book: photo("reception-lounge"),
  },
  seo: {
    title: "Agrawal Dental & Oral Care | Implant, Gum & Oral Medicine Specialists, Bhopal",
    description: "Dr. Neeraj Agrawal (MDS, periodontist & implantologist) and Dr. Kavita Agrawal (MDS, oral medicine) at New Minal Residency, Bhopal. Implants, gum treatment, laser dentistry and more.",
  },
};

const treatmentList: Treatment[] = [
  {
    title: "Dental Implants",
    slug: "dental-implants",
    image: photo("dr-neeraj-procedure"),
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
    title: "Gum Treatment (Pyorrhea)",
    slug: "gum-treatment",
    image: photo("procedure-with-assistant"),
    icon: "gums",
    summary: "For bleeding or swollen gums, bad breath and loose teeth. Deep cleaning and flap surgery by a periodontist can save teeth.",
    featured: true,
    order: 2,
    body: blocks(
      "Gums that bleed when you brush, look red or swollen, or have started to pull back from the teeth are usually a sign of gum disease. It starts with plaque and tartar along the gum line. Left alone, it slowly destroys the bone that holds the teeth, which is why teeth become loose.",
      "Early gum disease (gingivitis) clears up with a professional cleaning and better brushing. When the bone is already affected (periodontitis), we clean below the gum line, and in some cases do minor gum surgery to reach deep pockets.",
      "Gum health also matters for implants, crowns and bridges. Any of these lasts longer on healthy gums.",
      "Dr. Neeraj Agrawal is a periodontist (MDS, Periodontology & Implantology) and has headed the periodontology department at a dental college in Bhopal. Gum surgery, including flap surgery for advanced pyorrhea, is his speciality.",
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
    image: photo("dr-neeraj-treatment"),
    icon: "rootCanal",
    summary: "Saves a tooth with deep decay or infection, and stops the pain, instead of taking the tooth out.",
    featured: true,
    order: 5,
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
    image: photo("operatory-chair"),
    icon: "crown",
    summary: "A crown covers and protects a weak or broken tooth. A bridge replaces a missing tooth using the teeth next to it.",
    featured: true,
    order: 6,
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
    image: photo("treatment-hall-patient"),
    icon: "denture",
    summary: "Full or partial removable teeth, made to fit comfortably. Can also be held in place with implants.",
    featured: true,
    order: 7,
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
    image: photo("dr-kavita-child-patient"),
    icon: "child",
    summary: "Gentle check-ups, fillings and preventive care for milk teeth and growing smiles.",
    featured: true,
    order: 8,
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
    image: photo("procedure-examination"),
    icon: "cleaning",
    summary: "Removes tartar and stains that brushing can't, keeps gums healthy and breath fresh.",
    featured: false,
    order: 9,
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
    image: photo("operatory-tooth-mural"),
    icon: "extraction",
    summary: "Careful removal of a tooth that can't be saved, including wisdom teeth.",
    featured: false,
    order: 11,
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
    image: photo("treatment-room-wide"),
    icon: "filling",
    summary: "Tooth-coloured fillings that repair cavities and small chips in a single visit.",
    featured: false,
    order: 12,
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
    title: "Mouth Ulcers & Oral Cancer Screening",
    slug: "oral-medicine",
    image: photo("dr-kavita-portrait"),
    icon: "mouth",
    summary: "Diagnosis of non-healing ulcers, burning mouth and white or red patches, with early oral cancer detection by an oral medicine specialist.",
    featured: true,
    order: 3,
    body: blocks(
      "Not every mouth problem is about the teeth. Recurring ulcers, a burning feeling in the tongue or mouth (burning mouth syndrome), dry mouth, and white or red patches need a careful examination to find the cause.",
      "Any ulcer or patch that has not healed in two to three weeks should be checked. If you use tobacco, gutkha or areca nut, a regular mouth check is important even when nothing hurts.",
      "Dr. Kavita Agrawal holds an MDS in Oral Medicine, Diagnosis & Radiology and trained at Tata Memorial Cancer Hospital, Mumbai, in diagnosing unhealed ulcers, oral cancer and pre-malignant lesions. Caught early, most of these conditions are far simpler to treat.",
    ),
    duration: "20–30 minutes",
    visits: "1 visit, with follow-up as needed",
    faqs: [
      { _key: key(), question: "What causes a burning feeling in the mouth?", answer: "It can be linked to dry mouth, vitamin deficiencies, acid reflux, some medicines, diabetes or hormonal changes, and sometimes no single cause is found. We look for causes we can treat first." },
    ],
  },
  {
    title: "Laser Dentistry",
    slug: "laser-dentistry",
    image: photo("laser-treatment"),
    icon: "laser",
    summary: "Dental laser treatment for gums and soft tissue, with less bleeding, little or no stitching and quicker healing.",
    featured: true,
    order: 4,
    body: blocks(
      "A dental laser is a focused beam of light that can cut, seal or disinfect soft tissue very precisely. Because the laser seals small blood vessels as it works, there is usually less bleeding and swelling, and stitches are often not needed.",
      "We use it for gum treatment and gum reshaping, disinfecting deep gum pockets, treating painful mouth ulcers, and minor soft-tissue procedures. You and the team wear protective glasses during the treatment.",
    ),
    duration: "15–45 minutes",
    visits: "Usually 1 visit",
    steps: [
      { _key: key(), title: "Examination", text: "We check whether laser treatment suits your problem and explain what it will feel like." },
      { _key: key(), title: "Protective glasses", text: "Everyone in the room wears glasses that protect the eyes from the laser light." },
      { _key: key(), title: "Treatment", text: "The area is numbed if needed and the laser is used in short, precise passes." },
      { _key: key(), title: "Quick recovery", text: "Most people go back to normal routine the same day." },
    ],
    aftercare: ["Avoid very hot or spicy food for a day.", "Rinse gently with warm salt water if advised."],
    faqs: [
      { _key: key(), question: "Is laser treatment safe?", answer: "Yes. Dental lasers are designed for use in the mouth, and protective glasses are worn by everyone in the room." },
    ],
  },
  {
    title: "Braces & Aligners",
    slug: "braces-and-aligners",
    image: photo("reception-smile-wall"),
    icon: "braces",
    summary: "Straighten crowded or gapped teeth with fixed braces or clear aligners, planned from start to finish.",
    featured: false,
    order: 10,
    body: blocks(
      "Crooked, crowded or gapped teeth are harder to clean and can affect the bite. Braces move them into place gradually with gentle, steady pressure. Clear aligners do the same with a series of almost invisible trays you change every couple of weeks.",
      "Treatment usually takes 12–24 months. Children are best checked around age 7–8, but adults can straighten their teeth at any age if the gums are healthy.",
    ),
    duration: "30–45 minutes per visit",
    visits: "A check every 4–6 weeks",
    faqs: [
      { _key: key(), question: "Am I too old for braces?", answer: "No. Teeth can be moved at any age as long as the gums and bone around them are healthy, which is why we check the gums first." },
    ],
  },
];

export const defaultTreatments: Treatment[] = [...treatmentList].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

export const defaultDoctors: Doctor[] = [
  {
    name: "Dr. Neeraj Agrawal",
    photo: photo("dr-neeraj-office"),
    role: "Periodontist & Implantologist",
    qualifications: "BDS (KGMC, Lucknow) · MDS (Govt. Dental College, Kolkata) · MNAMS",
    experienceYears: 24,
    registration: null, // CONFIRM: dental council registration number
    bio: blocks(
      "Dr. Neeraj Agrawal graduated in 2003 from King George's Medical College, Lucknow, one of India's most respected government dental colleges. He completed his MDS in Periodontology and Implantology in 2007 at Dr. R. Ahmed Dental College, Kolkata, the first dental college in India.",
      "He combines clinical expertise, modern dental techniques and a patient-first approach: understanding each patient's concern first, then planning the treatment that suits them.",
      "He has worked as a professor at People's Dental Academy and as Head of the Department of Periodontology & Implantology at Rishiraj College of Dental Sciences, Bhopal. His expertise is dental implants and gum surgery, including flap surgery for the treatment of pyorrhea.",
    ),
    highlights: [
      "Certificate of Honour from the Governor of Uttar Pradesh, Prof. Vishnu Kant Shastri (2000)",
      "Member of the National Academy of Medical Sciences (MNAMS)",
      "Former Head of Periodontology, Rishiraj College of Dental Sciences",
      "Dental implants and flap surgery for pyorrhea",
    ],
  },
  {
    name: "Dr. Kavita Agrawal",
    photo: photo("dr-kavita-desk"),
    role: "Oral Medicine & Radiology Specialist",
    qualifications: "BDS (KGMC, Lucknow) · MDS (Govt. Dental College, Mumbai)",
    experienceYears: 18,
    registration: null,
    bio: blocks(
      "Dr. Kavita Agrawal graduated in 2006 from King George's Medical College & Hospital, Lucknow, and completed her MDS in Oral Medicine, Diagnosis & Radiology in 2010 at the Government Dental College (St. George Hospital), Mumbai.",
      "She believes in a reassuring environment where patients can talk openly about their concerns and understand their options, so that every visit feels comfortable and stress-free.",
      "She trained at Tata Memorial Cancer Hospital, Mumbai, in diagnosing unhealed ulcers, oral cancer and pre-malignant lesions, and was formerly a professor at Rishiraj College of Dental Sciences and Research Centre, Bhopal. She treats mouth ulcers and burning mouth, screens for oral cancer, diagnoses jaw fractures and tumours of the bone and glands on X-ray, and does cosmetic dentistry.",
    ),
    highlights: [
      "Trained at Tata Memorial Cancer Hospital, Mumbai",
      "Mouth ulcers, burning mouth and pre-cancer detection",
      "Former professor, Rishiraj College of Dental Sciences",
      "Oral radiology and cosmetic dentistry",
    ],
  },
];

export const defaultHomepage: Homepage = {
  hero: {
    eyebrow: "New Minal Residency, Bhopal",
    title: "Specialist dental care, with the gentleness of family.",
    highlight: "gentleness of family",
    text: "Two MDS specialists from KGMC Lucknow under one roof: Dr. Neeraj Agrawal for gums and implants, Dr. Kavita Agrawal for oral medicine and oral cancer detection.",
    image: photo("doctors-consultation-desk"),
    video: { url: "/videos/laser-treatment.mp4", poster: photo("laser-treatment"), caption: "Laser dentistry" },
    bookLabel: "Book on WhatsApp",
    slides: [
      {
        _key: key(),
        eyebrow: "Since 2013 · New Minal Residency, Bhopal",
        title: "Specialist dental care, with the gentleness of family.",
        highlight: "gentleness of family",
        text: "Two MDS specialists from KGMC Lucknow under one roof: Dr. Neeraj Agrawal for gums and implants, Dr. Kavita Agrawal for oral medicine and oral cancer detection.",
        image: photo("doctors-consultation-desk"),
        badge: "24+",
        badgeText: "years of care",
      },
      {
        _key: key(),
        eyebrow: "Dental implants & gum care",
        title: "Missing teeth or bleeding gums? See a periodontist.",
        highlight: "periodontist",
        text: "Dr. Neeraj Agrawal, MDS in Periodontology & Implantology, places implants and treats pyorrhea with deep cleaning and flap surgery.",
        image: photo("dr-neeraj-office"),
        buttonLabel: "Explore implants",
        buttonLink: "/treatments/dental-implants",
        badge: "MDS",
        badgeText: "periodontist",
      },
      {
        _key: key(),
        eyebrow: "Mouth ulcers & oral cancer screening",
        title: "An ulcer that won't heal deserves a specialist's eye.",
        highlight: "specialist's eye",
        text: "Dr. Kavita Agrawal, MDS in Oral Medicine & Radiology, trained at Tata Memorial Cancer Hospital, Mumbai, in detecting oral cancer early.",
        image: photo("dr-kavita-desk"),
        buttonLabel: "Get it checked",
        buttonLink: "/treatments/oral-medicine",
        badge: "18+",
        badgeText: "years of practice",
      },
      {
        _key: key(),
        eyebrow: "Laser dentistry",
        title: "Gentler gum treatment with a dental laser.",
        highlight: "dental laser",
        text: "Less bleeding, little or no stitching and quicker healing for gum and soft-tissue treatment.",
        image: photo("laser-treatment"),
        buttonLabel: "About laser treatment",
        buttonLink: "/treatments/laser-dentistry",
      },
    ],
    counters: [
      { _key: key(), value: "24+", label: "Years of experience", icon: "graduation" },
      { _key: key(), value: "2", label: "MDS specialists", icon: "users" },
      { _key: key(), value: "4.7", label: "Google rating", icon: "star" },
      { _key: key(), value: "180+", label: "Google reviews", icon: "smile" },
      { _key: key(), value: "7", label: "Days open", icon: "calendar" },
      { _key: key(), value: "2013", label: "Serving Bhopal since", icon: "building" },
    ],
  },
  sections: [
    {
      _type: "quickCardsSection",
      _key: key(),
      enabled: true,
      items: [
        { _key: key(), kind: "rating", title: "Rated by our patients", text: "Google verified reviews", buttonLabel: "Read reviews", link: null },
        { _key: key(), kind: "visit", title: "Open 7 days a week", text: "Mornings every day, evenings Monday to Saturday", buttonLabel: "Get directions", link: null },
        { _key: key(), kind: "link", title: "2 MDS specialists", text: "Gums & implants, oral medicine & oral cancer detection", buttonLabel: "Meet the doctors", link: "/about" },
      ],
    },
    {
      _type: "concernsSection",
      _key: key(),
      enabled: true,
      heading: "How can we help you today?",
      intro: "Pick the option that best describes your need. We'll fill it in on the booking form for you.",
      items: [
        { _key: key(), label: "Tooth pain", icon: "pain", treatmentSlug: "root-canal-treatment" },
        { _key: key(), label: "Bleeding gums", icon: "gums", treatmentSlug: "gum-treatment" },
        { _key: key(), label: "Missing tooth", icon: "implant", treatmentSlug: "dental-implants" },
        { _key: key(), label: "Mouth ulcer or burning", icon: "mouth", treatmentSlug: "oral-medicine" },
        { _key: key(), label: "My child's teeth", icon: "child", treatmentSlug: "childrens-dentistry" },
        { _key: key(), label: "Broken tooth", icon: "crown", treatmentSlug: "crowns-and-bridges" },
        { _key: key(), label: "Loose denture", icon: "denture", treatmentSlug: "dentures" },
        { _key: key(), label: "Cleaning & check-up", icon: "cleaning", treatmentSlug: "scaling-and-cleaning" },
      ],
    },
    {
      _type: "videoReviewsSection",
      _key: key(),
      enabled: true,
      heading: "Patient speaks",
      intro: "Hear what our patients have to say, filmed at the clinic, in their own words.",
      videos: [1, 2, 3, 4, 5].map((n) => ({ _key: key(), url: `/videos/testimonial-${n}.mp4`, poster: { local: { src: `/videos/testimonial-${n}.webp`, width: 478, height: 850 } }, name: null, caption: null })),
    },
    {
      _type: "whyTrustSection",
      _key: key(),
      enabled: true,
      heading: "Why patients trust Agrawal Dental",
      intro: null,
      image: photo("dr-kavita-child-patient"),
      boxes: [
        { _key: key(), title: "Specialist doctors", icon: "graduation", points: ["MDS periodontist & implantologist", "MDS in oral medicine & radiology", "Both studied at KGMC, Lucknow", "Both have taught at dental colleges in Bhopal"] },
        { _key: key(), title: "24+ years of experience", icon: "award", points: ["Dr. Neeraj Agrawal: 24+ years", "Dr. Kavita Agrawal: 18+ years", "Clinic serving Bhopal since 2013", "Patients from across India and abroad"] },
        { _key: key(), title: "Modern dentistry", icon: "sparkles", points: ["Laser dentistry for gums and soft tissue", "Dental implants and flap surgery", "Oral cancer screening by a trained specialist", "Modern chairs and instruments"] },
        { _key: key(), title: "Safety you can see", icon: "shield", points: ["Instruments steam-sterilised in an autoclave", "Sealed pouches opened in front of you", "Single-use gloves, masks and needles", "Plan and cost explained before treatment"] },
      ],
    },
    { _type: "bookingStripSection", _key: key(), enabled: true, heading: "Book an appointment at Agrawal Dental", intro: "Leave your name and number. The request opens on WhatsApp, and we reply with a time.", buttonLabel: "Book now" },
    {
      _type: "treatmentsSection",
      _key: key(),
      enabled: true,
      heading: "Treatments at Agrawal Dental",
      intro: null,
      onlyFeatured: false,
      layout: "tiles",
      buttonLabel: "All treatments",
    },
    {
      _type: "doctorsSection",
      _key: key(),
      enabled: true,
      heading: "Meet our specialists",
      intro: "Skilled, qualified and caring. Both doctors studied at King George's Medical College, Lucknow, and completed their masters at government dental colleges.",
      points: [
        { _key: key(), value: "2 MDS", title: "Specialist doctors", text: "Periodontology & implantology, oral medicine & radiology" },
        { _key: key(), value: "42+", title: "Years of combined experience", text: "24+ years and 18+ years in practice" },
        { _key: key(), value: "KGMC", title: "Lucknow alumni", text: "One of India's most respected government dental colleges" },
      ],
      buttonLabel: "Meet our doctors",
    },
    { _type: "statsSection", _key: key(), enabled: false, showGoogle: true, items: [] },
    { _type: "clinicSection", _key: key(), enabled: true, heading: "Step inside the clinic", intro: "Bright treatment rooms, a calm lounge and an awards wall that tells its own story. Have a look before your first visit.", photos: photos("reception-lounge", "treatment-hall", "operatory-tooth-mural", "corridor-awards-wall", "consultation-room", "smile-therapy-wall", "clinic-exterior-night", "operatory-chair") },
    {
      _type: "awardsSection",
      _key: key(),
      enabled: true,
      heading: "Recognised by peers and the community",
      intro: "Honours from dental associations, colleges and community bodies, on display in the clinic.",
      honours: [
        "Certificate of Honour from the Governor of Uttar Pradesh",
        "Academic Excellence award, 2012",
        "Indian Dental Association, Bhopal branch",
        "Future Dental Professionals Program, People's University",
        "Honoured by the Madhya Pradesh Agrawal Mahasabha",
        "Member, National Academy of Medical Sciences (MNAMS)",
      ],
      photos: photos("awards-cabinet-academic", "awards-cabinet-honours", "awards-plaques", "awards-cabinet-ida", "honour-agrawal-mahasabha"),
    },
    {
      _type: "safetySection",
      _key: key(),
      enabled: false,
      heading: "Every instrument, sterilised for every patient",
      intro: "This is the part of a dental visit people worry about most, so here is exactly what happens.", // CONFIRM steps with the clinic
      steps: [
        { _key: key(), title: "Cleaned", text: "Used instruments are scrubbed and cleaned to remove every trace of the last use.", icon: "hygiene" },
        { _key: key(), title: "Sealed", text: "They are packed into sealed sterilisation pouches.", icon: "sealed" },
        { _key: key(), title: "Steam sterilised", text: "The pouches go into an autoclave, which uses high-pressure steam to kill bacteria and viruses.", icon: "steam" },
        { _key: key(), title: "Opened in front of you", text: "Gloves, masks, needles and suction tips are single-use, and fresh pouches are opened at your appointment.", icon: "shield" },
      ],
    },
    {
      _type: "communitySection",
      _key: key(),
      enabled: true,
      heading: "Care that reaches beyond the clinic",
      intro: "Free dental check-up and awareness camps for school children, anganwadi mothers and senior citizens across Bhopal.",
      points: [
        { _key: key(), title: "School camps", text: "Brushing lessons and check-ups for hundreds of children." },
        { _key: key(), title: "Anganwadi camps", text: "Check-ups for mothers and toddlers in their own neighbourhood." },
        { _key: key(), title: "Senior citizens", text: "Free camps for elders, including survivors of the Bhopal gas tragedy." },
      ],
      photos: photos("camp-school-children", "camp-anganwadi", "camp-senior-citizens", "camp-kids-cheering", "school-visit", "camp-school-teaching"),
      video: { url: "/videos/school-camp.mp4", poster: { local: { src: "/videos/school-camp.webp", width: 1024, height: 576 } } },
      formHeading: "Bring a dental camp to your school, society or workplace",
      formText: "Free check-ups and expert advice from our doctors.",
      buttonLabel: "Request a camp",
    },
    {
      _type: "moreLinksSection",
      _key: key(),
      enabled: true,
      heading: "More than a dental clinic",
      intro: "Our commitment doesn't end at treatment. It begins with care.",
      items: [
        { _key: key(), label: "Patient videos", icon: "video", link: "/reviews" },
        { _key: key(), label: "Gallery", icon: "camera", link: "/gallery" },
        { _key: key(), label: "Awards", icon: "award", link: "/about#awards" },
        { _key: key(), label: "Dental camps", icon: "heart", link: "/gallery" },
        { _key: key(), label: "Our doctors", icon: "users", link: "/about" },
        { _key: key(), label: "Timings & map", icon: "map", link: "/contact" },
      ],
    },
    { _type: "beforeAfterSection", _key: key(), enabled: true, heading: "Before and after", intro: null, note: "Photos shared with the patient's permission. Results differ from person to person." },
    { _type: "reviewsSection", _key: key(), enabled: true, heading: "What patients say", intro: null },
    { _type: "faqSection", _key: key(), enabled: true, heading: "Frequently asked questions", intro: null, limit: 8 },
    { _type: "visitSection", _key: key(), enabled: true, heading: "Visit us", intro: null },
    {
      _type: "ctaSection",
      _key: key(),
      enabled: false,
      heading: "Your smile deserves a specialist.",
      intro: "Send a request with your problem in a line or two. We'll reply on WhatsApp with a time.",
      buttonLabel: "Send a booking request",
    },
  ],
};

const milestones = [
  { _key: key(), year: "2003", title: "Dr. Neeraj graduates from KGMC, Lucknow", text: "BDS from King George's Medical College, one of India's top government dental colleges." },
  { _key: key(), year: "2006", title: "Dr. Kavita graduates from KGMC, Lucknow", text: "BDS from King George's Medical College & Hospital." },
  { _key: key(), year: "2007", title: "MDS in Periodontology & Implantology", text: "Dr. Neeraj completes his masters at Dr. R. Ahmed Dental College, Kolkata, the first dental college in India." },
  { _key: key(), year: "2010", title: "MDS in Oral Medicine & Radiology", text: "Dr. Kavita completes her masters at the Government Dental College (St. George Hospital), Mumbai, and trains at Tata Memorial Cancer Hospital." },
  { _key: key(), year: "2013", title: "The clinic opens at Minal Residency", text: "Dr. Neeraj Agrawal's clinic opens in Bhopal, near Ayodhya Bypass Road on J.K. Road." },
  { _key: key(), year: "Bhopal", title: "Teaching the next generation", text: "Both doctors teach at dental colleges in Bhopal; Dr. Neeraj heads the Periodontology department at Rishiraj College of Dental Sciences." },
  { _key: key(), year: "Today", title: "Patients from Bhopal, across India and abroad", text: "A modern specialist clinic at New Minal Residency, rated 4.7 by 180+ patients on Google." },
];

export const defaultAbout: AboutPage = {
  heading: "A specialist clinic with a family's warmth",
  intro: "Established in 2013 at Minal Residency, Bhopal, and run by a husband-and-wife team of MDS specialists. We care for your smile, every step of the way.",
  image: photo("team-lobby"),
  body: blocks(
    "Dr. Neeraj Agrawal and Dr. Kavita Agrawal both studied at King George's Medical College, Lucknow, and went on to masters degrees at government dental colleges in Kolkata and Mumbai. Between them they bring specialist training in gums, implants, oral medicine, radiology and oral cancer detection.",
    "Both have taught at dental colleges in Bhopal, and that habit of explaining carries into every appointment: you'll see your X-ray, understand the options and know the cost before any treatment starts.",
    "Since opening in 2013, the clinic has cared for patients from Bhopal, from across India and from abroad. It is equipped with modern dental technology and instruments for safe, efficient treatment, and is easy to reach on J.K. Road, near Ayodhya Bypass Road.",
    "Outside the clinic the team runs free check-up and awareness camps for school children, anganwadi mothers and senior citizens.",
  ),
  highlights: [
    { _key: key(), title: "Gum and implant specialist", text: "Healthy gums come first, because every other treatment depends on them." },
    { _key: key(), title: "Oral medicine & cancer detection", text: "Non-healing ulcers and white or red patches are examined by a trained specialist." },
    { _key: key(), title: "Explained before it starts", text: "You'll know the plan, the number of visits and the cost before treatment begins." },
    { _key: key(), title: "The whole family", text: "Children, adults and grandparents, all under one roof." },
  ],
  milestones,
  doctorsHeading: "Meet our specialists",
  journeyHeading: "Two decades of learning, teaching and caring",
  ctaHeading: "Come and see the clinic",
  ctaText: "Send a booking request on WhatsApp and we'll reply with a time that suits you.",
};

export const defaultGallery: Gallery = {
  heading: "Gallery",
  intro: "The clinic, the doctors, our awards and the camps we run across Bhopal.",
  photos: photos(
    "doctors-consultation-desk", "reception-lounge", "treatment-hall", "dr-neeraj-portrait", "dr-kavita-portrait", "corridor-awards-wall",
    "operatory-tooth-mural", "dr-kavita-child-patient", "team-lobby", "awards-cabinet-academic", "consultation-room", "camp-school-children",
    "dr-neeraj-treatment", "smile-therapy-wall", "clinic-exterior-night", "awards-cabinet-honours", "camp-anganwadi", "treatment-hall-patient",
    "entrance-signboard", "dr-neeraj-procedure", "team-reception", "awards-plaques", "camp-senior-citizens", "operatory-chair",
    "child-thumbs-up", "reception-smile-wall", "awards-shelf-entrance", "camp-kids-cheering", "dr-kavita-desk", "front-desk",
    "procedure-with-assistant", "honour-agrawal-mahasabha", "waiting-area", "school-visit", "dr-neeraj-office", "clinic-facade-lights",
    "procedure-examination", "awards-cabinet-ida", "camp-school-teaching", "treatment-room-wide", "dental-association-meet", "felicitation",
  ),
  beforeAfter: [],
};

export const defaultReviews: Reviews = {
  heading: "Patient reviews",
  intro: "Rated 4.7 by more than 180 patients on Google. Here are a few of them, in their own words.",
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
