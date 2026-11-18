import { pexels } from "@/lib/brand";

/** Videos optimizados (renditions HD de Pexels, libres de uso). */
export const VIDEOS = {
  hero: {
    src: "https://videos.pexels.com/video-files/6649769/6649769-hd_2048_1080_25fps.mp4",
    poster: pexels(5894085, 1600, 900),
    label: "Florista arreglando un ramo en el atelier",
  },
  atelier: {
    src: "https://videos.pexels.com/video-files/6763321/6763321-hd_1080_1920_25fps.mp4",
    poster: pexels(6912875, 900, 1200),
    label: "Manos de florista preparando flores frescas",
  },
  roses: {
    src: "https://videos.pexels.com/video-files/6911344/6911344-hd_1080_1920_24fps.mp4",
    poster: pexels(12775959, 900, 1200),
    label: "Rosas blancas y rosadas en primer plano",
  },
} as const;

export type Occasion = {
  id: string;
  label: string;
  copy: string;
  image: string;
  href: string;
  video?: string;
  poster?: string;
};

/** Momentos reales: imágenes de flores en ocasiones especiales. */
export const OCCASIONS: Occasion[] = [
  {
    id: "amor",
    label: "Amor",
    copy: "Rosas garden para decir todo",
    image: pexels(15457219, 900, 1200),
    href: "/catalogo?categoria=romanticos",
    video: VIDEOS.roses.src,
    poster: VIDEOS.roses.poster,
  },
  {
    id: "cumpleanos",
    label: "Cumpleaños",
    copy: "Sorpresas que florecen",
    image: pexels(7911051, 900, 1200),
    href: "/catalogo?categoria=primaverales",
  },
  {
    id: "aniversario",
    label: "Aniversario",
    copy: "Celebrar lo que ya es historia",
    image: pexels(5713323, 900, 1200),
    href: "/catalogo?categoria=cajas",
  },
  {
    id: "boda",
    label: "Bodas",
    copy: "Ramos que acompañan el sí",
    image: pexels(30190595, 900, 1200),
    href: "/personalizar",
  },
  {
    id: "gracias",
    label: "Gracias",
    copy: "Detalles que hablan por ti",
    image: pexels(33109472, 900, 1200),
    href: "/catalogo?categoria=personalizados",
  },
  {
    id: "hogar",
    label: "En casa",
    copy: "Flores frescas para tu espacio",
    image: pexels(35325741, 900, 1200),
    href: "/catalogo",
  },
  {
    id: "acompanar",
    label: "Acompañar",
    copy: "Un abrazo en forma de flores",
    image: pexels(8015629, 900, 1200),
    href: "/catalogo?categoria=condolencias",
  },
];

export const ATELIER_GALLERY = [
  pexels(16536584, 700, 900),
  pexels(12775959, 700, 900),
  pexels(16536447, 700, 900),
  pexels(28855241, 700, 900),
  pexels(7243273, 700, 900),
];

export const INSTAGRAM_STRIP = [
  pexels(27670859, 600, 600),
  pexels(18057437, 600, 600),
  pexels(8933376, 600, 600),
  pexels(27515446, 600, 600),
  pexels(26628920, 600, 600),
];
