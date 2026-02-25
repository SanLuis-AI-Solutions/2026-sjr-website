type BlogHeadProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Head({ params }: BlogHeadProps) {
  const { slug } = await params;

  if (slug !== "ring-sizing-guide") {
    return null;
  }

  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/images/blog/ring-sizing-guide-cover-mobile.avif"
        fetchPriority="high"
      />
    </>
  );
}
