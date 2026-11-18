import Link from "next/link";
import { FlowerMark, Icon } from "@/components/brand";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[62vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full border border-gold/40 bg-cream">
        <FlowerMark className="h-12 w-12 text-sage-deep" />
      </span>
      <p className="eyebrow mt-6">Error 404</p>
      <h1 className="display mt-3 max-w-[30rem] text-[clamp(2.1rem,4.6vw,3.2rem)]">
        Esta flor aún no ha florecido
      </h1>
      <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-cocoa">
        La página que buscas no existe o el arreglo ya no está disponible. Vuelve al
        catálogo o escríbenos y lo creamos especialmente para ti.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/catalogo" className="btn btn-dark">
          Ver catálogo <Icon name="arrow" className="h-4 w-4" />
        </Link>
        <Link href="/" className="btn btn-outline">Volver al inicio</Link>
        <Link href="/personalizar" className="btn btn-primary">Diseñar a medida</Link>
      </div>
    </section>
  );
}
