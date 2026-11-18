export const BRAND = {
  name: "FLORÉA",
  slogan: "Emociones que florecen",
  tagline: "Flores que hablan por ti.",
  city: "Lima, Perú",
  email: "hola@florea.pe",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "51987654321",
  whatsappDisplay: "+51 987 654 321",
  instagram: "@florea.floral",
  facebook: "Floréa Floral Boutique",
  tiktok: "@florea.flores",
  address: "Av. La Mar 1234, Miraflores · Lima",
  hours: "Lun a sáb · 9:00 a 20:00",
  freeShippingFromCents: 24900,
} as const;

export function formatPrice(cents: number): string {
  const soles = cents / 100;
  const hasDecimals = Math.round(soles * 100) % 100 !== 0;
  return `S/ ${soles.toLocaleString("es-PE", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

export function pexels(id: number, width = 900, height = 1200): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${width}&h=${height}`;
}

export const IMAGES = {
  hero: pexels(20440297, 1000, 1300),
  heroDetail: pexels(12775959, 600, 600),
  atelier: pexels(5894085, 1100, 900),
  custom: pexels(6912875, 1100, 900),
  editorial: pexels(3933975, 1400, 900),
  story: pexels(5496147, 900, 1100),
} as const;

export type Category = {
  slug: string;
  name: string;
  short: string;
  description: string;
  image: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: "romanticos",
    name: "Arreglos románticos",
    short: "Rosas de amor",
    description:
      "Rosas garden, peonías y tonos empolvados para decir lo que a veces no sale en palabras.",
    image: pexels(36188440, 900, 1100),
  },
  {
    slug: "primaverales",
    name: "Flores variadas",
    short: "Dulce primavera",
    description:
      "Mezcla fresca de estación, texturas naturales y ese aire de jardín recién cortado.",
    image: pexels(27670859, 900, 1100),
  },
  {
    slug: "cajas",
    name: "Cajas florales",
    short: "Cajas florales",
    description:
      "Nuestras cajas forradas a mano: el regalo que se abre y se queda en la memoria.",
    image: pexels(26628920, 900, 1100),
  },
  {
    slug: "personalizados",
    name: "Detalles personalizados",
    short: "Detalles eternos",
    description:
      "Diseños a medida inspirados en su historia, su paleta y su momento.",
    image: pexels(18057437, 900, 1100),
  },
  {
    slug: "condolencias",
    name: "Acompañamiento",
    short: "Serenidad",
    description:
      "Arreglos serenos y elegantes para acompañar con respeto y cariño.",
    image: pexels(9342923, 900, 1100),
  },
];

export const SIZES = [
  {
    id: "clasico",
    label: "Clásico",
    description: "Elaborado con 12–15 tallos",
    extraCents: 0,
  },
  {
    id: "deluxe",
    label: "Deluxe",
    description: "Más volumen, 20–25 tallos",
    extraCents: 4000,
  },
  {
    id: "gran-diva",
    label: "Gran Diva",
    description: "Nuestro diseño más generoso",
    extraCents: 9000,
  },
] as const;

export type SizeId = (typeof SIZES)[number]["id"];

export const DELIVERY_SLOTS = [
  "09:00 – 12:00",
  "12:00 – 15:00",
  "15:00 – 18:00",
  "18:00 – 20:00",
] as const;

export type District = { name: string; feeCents: number };

export const DISTRICTS: District[] = [
  { name: "Miraflores", feeCents: 1200 },
  { name: "San Isidro", feeCents: 1200 },
  { name: "Barranco", feeCents: 1200 },
  { name: "Surquillo", feeCents: 1200 },
  { name: "San Borja", feeCents: 1200 },
  { name: "Santiago de Surco", feeCents: 1200 },
  { name: "Lince", feeCents: 1200 },
  { name: "Jesús María", feeCents: 1200 },
  { name: "Magdalena del Mar", feeCents: 1500 },
  { name: "Pueblo Libre", feeCents: 1500 },
  { name: "San Miguel", feeCents: 1500 },
  { name: "La Molina", feeCents: 1800 },
  { name: "Cercado de Lima", feeCents: 1800 },
  { name: "Chorrillos", feeCents: 1800 },
  { name: "La Victoria", feeCents: 1800 },
  { name: "Callao", feeCents: 2200 },
  { name: "Los Olivos", feeCents: 2200 },
  { name: "San Martín de Porres", feeCents: 2200 },
  { name: "Ate", feeCents: 2500 },
  { name: "San Juan de Lurigancho", feeCents: 2800 },
  { name: "Comas", feeCents: 2800 },
  { name: "Villa El Salvador", feeCents: 2800 },
  { name: "Villa María del Triunfo", feeCents: 2800 },
  { name: "Lurín", feeCents: 3200 },
];

export function deliveryFeeCents(district: string, subtotalCents: number): number {
  if (!district) return 0;
  const found = DISTRICTS.find((d) => d.name === district);
  if (!found) return 2500;
  if (subtotalCents >= BRAND.freeShippingFromCents) return 0;
  return found.feeCents;
}

export function categoryName(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? "Arreglos florales";
}

export const OCCASIONS = [
  "Amor y romance",
  "Aniversario",
  "Cumpleaños",
  "Agradecimiento",
  "Condolencias",
  "Corporativo",
  "Solo porque sí",
] as const;

export const CUSTOM_STYLES = [
  { id: "ramo", label: "Ramo envuelto", from: 9900 },
  { id: "caja", label: "Caja floral", from: 18900 },
  { id: "jarron", label: "Jarrón de cerámica", from: 21900 },
  { id: "cesta", label: "Cesta de mimbre", from: 23900 },
] as const;

export const CUSTOM_PALETTES = [
  { id: "marfil", label: "Marfil & salvia", colors: ["#F7F1E9", "#A8B5A0", "#FFFFFF"] },
  { id: "romantica", label: "Rosa empolvado", colors: ["#D9A6A9", "#F7F1E9", "#C58B8F"] },
  { id: "jardin", label: "Jardín silvestre", colors: ["#A8B5A0", "#795B50", "#E9D8C3"] },
  { id: "vibrante", label: "Vibrante & tropical", colors: ["#D9A6A9", "#C9A96A", "#A8B5A0"] },
  { id: "blanca", label: "Blanco absoluto", colors: ["#FFFFFF", "#E9E4DA", "#A8B5A0"] },
] as const;

export const FLOWER_OPTIONS = [
  "Rosas garden",
  "Peonías",
  "Tulipanes",
  "Claveles",
  "Girasoles",
  "Lavanda",
  "Eucalipto",
  "Orquídeas",
  "Hortensias",
] as const;

export const BUDGETS = [
  { value: 12000, label: "Hasta S/ 120" },
  { value: 20000, label: "S/ 120 – 200" },
  { value: 30000, label: "S/ 200 – 300" },
  { value: 45000, label: "S/ 300 – 450" },
  { value: 60000, label: "Más de S/ 450" },
] as const;

export const PAYMENT_METHODS = [
  {
    id: "tarjeta",
    label: "Tarjeta de crédito / débito",
    hint: "Visa, Mastercard y Amex · cobro online seguro",
  },
  {
    id: "yape",
    label: "Yape",
    hint: "Te enviamos el QR de Floréa por WhatsApp",
  },
  {
    id: "plin",
    label: "Plin",
    hint: "Coordinamos el número desde tu confirmación",
  },
  {
    id: "transferencia",
    label: "Transferencia BCP / Interbank",
    hint: "Enviamos los datos al confirmar tu pedido",
  },
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number]["id"];

export function paymentMethodLabel(id: string): string {
  return PAYMENT_METHODS.find((method) => method.id === id)?.label ?? id;
}

export function whatsappLink(message: string): string {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function tomorrowISO(offsetDays = 1): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export function formatDateLong(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
