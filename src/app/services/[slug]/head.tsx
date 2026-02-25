type ServiceHeadProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Head({ params }: ServiceHeadProps) {
  const { slug } = await params;

  if (slug !== "ring-sizing") {
    return null;
  }

  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/images/services/ring-sizing-hero-mobile.avif"
        fetchPriority="high"
      />
    </>
  );
}
