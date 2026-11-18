# FLORÉA · Emociones que florecen

Tienda online de florería boutique (Lima, Perú) construida con Next.js App Router,
PostgreSQL y Drizzle ORM. Incluye catálogo, configurador de arreglos personalizados,
carrito, fechas/horarios de entrega, checkout con formulario de pago y panel
administrativo.

## Rutas principales

| Ruta | Descripción |
| --- | --- |
| `/` | Home: hero, colecciones, favoritos, proceso, testimonios |
| `/catalogo` | Catálogo con filtros por categoría, búsqueda y orden |
| `/catalogo/[slug]` | Detalle del arreglo, tamaños y añadir al carrito |
| `/personalizar` | Configurador: flores, paleta, tamaño, presupuesto, fecha y dedicatoria |
| `/carrito` | Carrito + entrega + pago online |
| `/pedido/[code]` | Confirmación, estado del pago y seguimiento por WhatsApp |
| `/nosotros` · `/contacto` | Marca, valores, zonas de envío, medios de pago |
| `/admin` | Panel privado: pedidos, solicitudes, precios y visibilidad |

## Variables de entorno (`.env`)

```bash
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
NEXT_PUBLIC_WHATSAPP_NUMBER=51987654321   # número real de la florería (formato wa.me)
ADMIN_PASSWORD=florea2026                 # clave del panel /admin
```

## WhatsApp

Todos los botones de pedido usan `https://wa.me/<NEXT_PUBLIC_WHATSAPP_NUMBER>` con
mensajes precargados (producto, tamaño, total y datos de entrega). Cambia el número
en `.env` o en `src/lib/brand.ts` para producción.

## Conectar la pasarela de pagos (checkout ya listo)

El checkout valida tarjeta (Luhn, vencimiento, CVV), crea el pedido en la base de
datos y registra el intento de pago. Mientras no existan credenciales, `src/lib/payments.ts`
funciona en **modo demostración** (`paymentStatus = "simulado"`, sin cargos reales).

Para cobrar de verdad:

1. Crea la cuenta en **Culqi**, **Mercado Pago** o **Stripe**.
2. Agrega la llave secreta al `.env`:
   - `CULQI_SECRET_KEY=...`
   - `MERCADOPAGO_ACCESS_TOKEN=...`
   - `STRIPE_SECRET_KEY=...`
3. En `src/lib/payments.ts`, dentro del bloque marcado `PASARELA REAL`, reemplaza el
   `console.info` por la llamada al API del proveedor. Recomendado: generar el token
   de tarjeta en el navegador (Culqi Checkout / Mercado Pago Brick) y enviar solo el
   `source_id` al backend; nunca guardar número completo ni CVV.
4. Crea el webhook `/api/payments/webhook` para confirmar el pago y actualizar
   `paymentStatus` (`aprobado` / `rechazado`). La función `updateOrderPayment` en
   `src/lib/data.ts` ya permite persistir el resultado.
5. Prueba con tarjetas de test del proveedor (en modo demo, cualquier tarjeta válida
   se aprueba y las terminadas en `0000` se rechazan).

## Base de datos

```bash
npx drizzle-kit push   # aplica el esquema (src/db/schema.ts)
```

Tablas: `products`, `orders`, `order_items`, `custom_requests`,
`newsletter_subscribers`. El catálogo inicial se siembra automáticamente la primera
vez que se consulta.

## Panel administrativo

`/admin` → clave `ADMIN_PASSWORD` (por defecto `florea2026`). Permite revisar pedidos
y pagos, cambiar estados, contactar clientes de pedidos personalizados y editar
precios, visibilidad y destacados del catálogo.
