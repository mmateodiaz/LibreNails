export const BUSINESS_INFO = {
  name: "Libre Nails",
  instagram: "@libre.nails",
  instagramUrl: "https://www.instagram.com/libre.nails",
  address: "Mario Dario Grandi 4288, X5009 Córdoba",
  mapsUrl: "https://maps.app.goo.gl/LRZZX83xkcQ4a2UT6",
  whatsappNumber: "5493517381755",
  whatsappDisplay: "0351 738-1755",
  depositAmount: 5000,
  toleranceMinutes: 15,
  cancellationHours: 24,
  paymentMethods: ["Débito", "Transferencias", "Efectivo"],
};

export const SERVICES = [
  {
    id: "semipermanente",
    name: "Semipermanente",
    price: 21000,
    duration: 60,
    description: "Esmaltado de larga duración con acabado brillante y prolijo.",
  },
  {
    id: "capping",
    name: "Capping",
    price: 23000,
    duration: 90,
    description: "Capa protectora sobre uña natural para aportar resistencia y evitar quiebres.",
  },
  {
    id: "soft-gel",
    name: "Soft Gel",
    price: 25000,
    duration: 90,
    description: "Extensiones livianas y naturales adheridas con gel.",
  },
  {
    id: "esculpidas",
    name: "Esculpidas",
    price: 26000,
    duration: 120,
    description: "Construcción y extensión personalizada desde cero.",
  },
  {
    id: "semi-pies",
    name: "Semi p/ pies",
    price: 18000,
    duration: 60,
    description: "Esmaltado semipermanente para pies.",
  },
  {
    id: "nail-art-french",
    name: "Full nail art & french",
    price: 1000,
    duration: 30,
    description: "Diseño artístico personalizado o terminación francesita.",
  },
];

export const EXTRAS = [
  { id: "remocion-semi", name: "Remoción Semi", price: 4500, extraDuration: 20 },
  { id: "remocion-capping", name: "Remoción capping/esculpidas", price: 5000, extraDuration: 30 },
  { id: "reconstruccion", name: "Reconstrucción de uña (c/u)", price: 1000, extraDuration: 15 },
  { id: "dijes", name: "Dijes (unidad)", price: 1000, extraDuration: 5 },
];

export const WEEKLY_SCHEDULE = {
  0: null,
  1: { open: "09:00", close: "20:00" },
  2: { open: "10:00", close: "20:00" },
  3: { open: "09:00", close: "20:00" },
  4: { open: "12:00", close: "20:30" },
  5: { open: "09:00", close: "20:30" },
  6: { open: "09:30", close: "19:00" },
};

export const BOOKING_RULES = [
  {
    title: "Anticipo / Seña",
    text: "Se pide un anticipo de $5.000 hasta 24 hs antes de tu cita para asegurar tu lugar y darla por confirmada.",
  },
  {
    title: "Tolerancia",
    text: "Tiempo máximo de tolerancia de 15 minutos. Pasado ese tiempo la cita queda cancelada y el anticipo no es reembolsable.",
  },
  {
    title: "Cancelar o Reagendar",
    text: "Avisar con un máximo de 24 hs de anticipación si necesitás cancelar o reprogramar tu turno.",
  },
];

export const NAIL_CARE_TIPS = [
  "No morder las uñas ni cutículas.",
  "Retocar cada 2 a 3 semanas.",
  "No arrancar el producto manualmente.",
  "Usar guantes al limpiar o manipular químicos para proteger tus uñas.",
  "No usarlas como herramientas (abrir latas, raspar, etc.).",
  "En caso de desprendimiento, acudir a tu manicurista.",
];