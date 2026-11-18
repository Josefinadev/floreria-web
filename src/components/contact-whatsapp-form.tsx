"use client";

import { useState } from "react";
import { Icon } from "@/components/brand";
import { OCCASIONS, whatsappLink } from "@/lib/brand";

export function ContactWhatsAppForm() {
  const [name, setName] = useState("");
  const [occasion, setOccasion] = useState<string>(OCCASIONS[0]);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  const text = [
    "🌸 *Consulta desde la web de Floréa*",
    name ? `Nombre: ${name}` : "",
    `Ocasión: ${occasion}`,
    date ? `Fecha especial: ${date}` : "",
    message ? `Mensaje: ${message}` : "",
    "¿Me ayudan a elegir el arreglo perfecto?",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="rounded-[24px] border border-cocoa/12 bg-white/70 p-6 sm:p-7">
      <p className="eyebrow text-[9px]">Escríbenos</p>
      <h2 className="mt-2 font-serif text-[24px] text-forest">
        Cuéntanos qué quieres regalar
      </h2>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-cocoa">
        Completa estos datos y te llevamos directo a WhatsApp con tu consulta
        lista. Respondemos en menos de 1 hora.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="label">Tu nombre</label>
          <input
            id="contact-name"
            className="field"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Camila Rojas"
          />
        </div>
        <div>
          <label htmlFor="contact-occasion" className="label">Ocasión</label>
          <select
            id="contact-occasion"
            className="field"
            value={occasion}
            onChange={(event) => setOccasion(event.target.value)}
          >
            {OCCASIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="contact-date" className="label">Fecha de entrega</label>
          <input
            id="contact-date"
            type="date"
            className="field"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="contact-message" className="label">Mensaje</label>
          <textarea
            id="contact-message"
            className="field min-h-[90px] resize-y"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Busco un ramo con peonías y rosas blancas para un aniversario…"
          />
        </div>
      </div>

      <a
        href={whatsappLink(text)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-dark mt-5 w-full"
      >
        <Icon name="whatsapp" className="h-4 w-4" /> Enviar por WhatsApp
      </a>
      <p className="mt-2 text-center text-[10.5px] text-cocoa/60">
        Se abrirá WhatsApp con tu mensaje listo para enviar.
      </p>
    </div>
  );
}
