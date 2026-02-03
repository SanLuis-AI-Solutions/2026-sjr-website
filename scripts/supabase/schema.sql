-- Supabase content tables

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text,
  short_summary text,
  image_url text,
  long_description jsonb,
  includes jsonb,
  common_requests jsonb,
  price_note text,
  priority integer default 0,
  active boolean default true,
  meta_title text,
  meta_description text,
  geo_city text,
  geo_state text,
  geo_area text,
  updated_at timestamptz
);

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  service_slug text references services(slug) on delete cascade,
  question text not null,
  answer text,
  priority integer default 0,
  active boolean default true
);

create unique index if not exists faqs_service_question_unique on faqs(service_slug, question);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  quote text,
  rating integer,
  service_slug text references services(slug) on delete set null,
  location text,
  active boolean default true,
  sort integer default 0
);

create unique index if not exists testimonials_unique on testimonials(customer_name, quote);

create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text,
  alt_text text,
  service_slug text references services(slug) on delete set null,
  category text,
  active boolean default true,
  sort integer default 0
);

create unique index if not exists gallery_unique on gallery(title, image_url);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text,
  slug text unique not null,
  excerpt text,
  body text,
  hero_image_url text,
  tags jsonb,
  publish_date date,
  status text,
  meta_title text,
  meta_description text
);

create table if not exists site_settings (
  key text primary key,
  value text,
  notes text
);
