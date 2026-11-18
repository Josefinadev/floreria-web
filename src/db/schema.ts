import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull().default(""),
  category: text("category").notNull().default("romanticos"),
  priceCents: integer("price_cents").notNull(),
  imageUrl: text("image_url").notNull(),
  badge: text("badge"),
  stems: text("stems").notNull().default(""),
  featured: boolean("featured").notNull().default(false),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryMethod: text("delivery_method").notNull().default("envio"),
  deliveryDate: date("delivery_date", { mode: "string" }).notNull(),
  deliverySlot: text("delivery_slot").notNull(),
  district: text("district").notNull().default(""),
  address: text("address").notNull().default(""),
  addressReference: text("address_reference").notNull().default(""),
  recipientName: text("recipient_name").notNull().default(""),
  recipientPhone: text("recipient_phone").notNull().default(""),
  cardMessage: text("card_message").notNull().default(""),
  notes: text("notes").notNull().default(""),
  subtotalCents: integer("subtotal_cents").notNull(),
  deliveryFeeCents: integer("delivery_fee_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull(),
  paymentMethod: text("payment_method").notNull().default("tarjeta"),
  paymentStatus: text("payment_status").notNull().default("pendiente"),
  paymentProvider: text("payment_provider").notNull().default("demo"),
  paymentReference: text("payment_reference").notNull().default(""),
  cardLast4: text("card_last4").notNull().default(""),
  status: text("status").notNull().default("nuevo"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productSlug: text("product_slug").notNull(),
  name: text("name").notNull(),
  sizeLabel: text("size_label").notNull().default("Clásico"),
  unitPriceCents: integer("unit_price_cents").notNull(),
  quantity: integer("quantity").notNull().default(1),
  note: text("note").notNull().default(""),
});

export const customRequests = pgTable("custom_requests", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull().default(""),
  occasion: text("occasion").notNull().default(""),
  style: text("style").notNull().default(""),
  size: text("size").notNull().default(""),
  palette: text("palette").notNull().default(""),
  flowers: text("flowers").notNull().default(""),
  budgetCents: integer("budget_cents").notNull().default(0),
  dedication: text("dedication").notNull().default(""),
  deliveryDate: text("delivery_date").notNull().default(""),
  deliverySlot: text("delivery_slot").notNull().default(""),
  district: text("district").notNull().default(""),
  notes: text("notes").notNull().default(""),
  status: text("status").notNull().default("nuevo"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  source: text("source").notNull().default("web"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type CustomRequest = typeof customRequests.$inferSelect;
