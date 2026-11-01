/** Shared option lists used by several schemas. Values are stable keys the website understands. */

export const iconOptions = [
  { title: "Tooth", value: "tooth" },
  { title: "Implant", value: "implant" },
  { title: "Gums", value: "gums" },
  { title: "Root canal", value: "rootCanal" },
  { title: "Crown / cap", value: "crown" },
  { title: "Denture", value: "denture" },
  { title: "Child's tooth", value: "child" },
  { title: "Cleaning", value: "cleaning" },
  { title: "Extraction", value: "extraction" },
  { title: "Filling", value: "filling" },
  { title: "Whitening", value: "whitening" },
  { title: "Braces", value: "braces" },
  { title: "Mouth / oral care", value: "mouth" },
  { title: "Check-up (mirror)", value: "checkup" },
  { title: "Tooth pain", value: "pain" },
  { title: "Shield (safety)", value: "shield" },
  { title: "Sterilisation (steam)", value: "steam" },
  { title: "Gloves / hygiene", value: "hygiene" },
  { title: "Package / sealed", value: "sealed" },
];

function label(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** 7:00 am to 11:30 pm in 30-minute steps, stored as "HH:MM" (24 hour). */
export const timeOptions = Array.from({ length: 34 }, (_, i) => {
  const minutes = 7 * 60 + i * 30;
  const value = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  return { title: label(value), value };
});

export const dayOptions = [
  { title: "Monday", value: "mon" },
  { title: "Tuesday", value: "tue" },
  { title: "Wednesday", value: "wed" },
  { title: "Thursday", value: "thu" },
  { title: "Friday", value: "fri" },
  { title: "Saturday", value: "sat" },
  { title: "Sunday", value: "sun" },
];

export const galleryCategories = [
  { title: "Clinic", value: "clinic" },
  { title: "Team", value: "team" },
  { title: "Treatment", value: "treatment" },
  { title: "Events & camps", value: "events" },
];
