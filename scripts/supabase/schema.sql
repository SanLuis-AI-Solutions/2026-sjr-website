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

-- Lead capture tables (operational)

create table if not exists quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  details text not null,
  -- Array of uploaded assets: [{ bucket, path, original_name, mime, size, object_url, public_url }]
  attachments jsonb,
  status text not null default 'new',
  source text,
  page_url text,
  user_agent text,
  ip text
);

create index if not exists quote_requests_created_at_idx on quote_requests(created_at desc);
create index if not exists quote_requests_status_idx on quote_requests(status);

create table if not exists booking_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  date date not null,
  time time not null,
  details text,
  status text not null default 'new',
  source text,
  page_url text,
  user_agent text,
  ip text,
  calendar_event jsonb,
  error text
);

create index if not exists booking_requests_created_at_idx on booking_requests(created_at desc);
create index if not exists booking_requests_status_idx on booking_requests(status);

create table if not exists contact_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  preferred_contact text,
  message text not null,
  status text not null default 'new',
  source text,
  page_url text,
  user_agent text,
  ip text
);

create index if not exists contact_requests_created_at_idx on contact_requests(created_at desc);
create index if not exists contact_requests_status_idx on contact_requests(status);

-- Content Nexus dedupe and review-loop safety tables

create table if not exists shared_slugs (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  platform text not null check (platform in ('gbp', 'meta', 'pinterest', 'linkedin')),
  status text not null default 'shared' check (status in ('shared', 'failed', 'skipped')),
  shared_at timestamptz not null default now(),
  external_post_id text,
  external_post_url text,
  error text,
  payload jsonb
);

create unique index if not exists shared_slugs_slug_platform_unique on shared_slugs(slug, platform);
create index if not exists shared_slugs_shared_at_idx on shared_slugs(shared_at desc);

create table if not exists review_request_status (
  id uuid primary key default gen_random_uuid(),
  customer_key text not null,
  job_reference text,
  channel text not null default 'sms' check (channel in ('sms', 'email')),
  status text not null default 'queued' check (status in ('queued', 'sent', 'delivered', 'reviewed', 'reminder_sent', 'suppressed', 'failed')),
  first_sent_at timestamptz,
  last_sent_at timestamptz,
  reminder_sent_at timestamptz,
  review_received_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  notes text,
  payload jsonb
);

create unique index if not exists review_request_status_customer_job_unique
  on review_request_status(customer_key, coalesce(job_reference, ''));
create index if not exists review_request_status_last_sent_at_idx on review_request_status(last_sent_at desc);
create index if not exists review_request_status_status_idx on review_request_status(status);
