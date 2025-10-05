import React from 'react'

/**
 * Responsive card grid that displays images without stretching or cropping important edges.
 * - Images are centered and use object-cover so they fill the frame while keeping aspect ratio
 * - The card container has overflow-hidden so images never bleed over the border
 * - Bottom border remains visible (no image overlap)
 */
const CardList = ({
  items = [
    {
      title: 'Modern Bedroom Design',
      description:
        'Transform your bedroom into a serene sanctuary with contemporary design elements and calming aesthetics.',
      image: '/assets/itsolution/1.png',
      href: '#',
    },
    {
      title: 'Elegant Living Room',
      description:
        'Create a sophisticated living space that combines comfort with style for the perfect family gathering area.',
      image: '/assets/itsolution/2.png',
      href: '#',
    },
    {
      title: 'Modern Kitchen Design',
      description:
        'Discover how to elevate your kitchen with premium materials and thoughtful design details.',
      image: '/assets/itsolution/3.png',
      href: '#',
    },
  ],
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item, idx) => (
        <article
          key={idx}
          className="group rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md"
        >
          {/* Image wrapper: keeps a consistent aspect ratio and prevents bleed over the border */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
            <img
              src={item.image}
              alt={item.title}
           
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              priority={idx === 0}
              className="object-cover object-center"
            />
            {/* Optional subtle overlay for better text contrast on hover */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-3 p-6">
            <h3 className="text-xl font-semibold text-zinc-900">{item.title}</h3>
            <p className="text-zinc-600">{item.description}</p>
            <a
              href={item.href}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              View Design
              <span aria-hidden>→</span>
            </a>
          </div>
        </article>
      ))}
    </div>
  )
}

export default CardList
