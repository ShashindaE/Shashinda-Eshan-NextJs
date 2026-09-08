import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // remove special chars except hyphens
    .replace(/[\s_]+/g, '-')    // spaces/underscores → hyphens
    .replace(/-+/g, '-')        // collapse multiple hyphens
    .replace(/^-+|-+$/g, '')    // trim leading/trailing hyphens
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        // Always sanitise slug; if empty/whitespace-only, derive from title
        const raw = (data.slug || '').trim()
        if (!raw && data.title) {
          data.slug = toSlug(data.title)
        } else if (raw) {
          data.slug = toSlug(raw)
        }
        return data
      },
    ],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'featured', 'status', 'publishedDate'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      unique: true,
      admin: {
        description: 'Leave blank to auto-generate from title. Will be lowercased with hyphens.',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      required: true,
    },
    {
      name: 'publishedDate',
      type: 'date',
      label: 'Published Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd MMM yyyy',
        },
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Excerpt',
      admin: {
        description: 'Short summary shown in blog listing (1-2 sentences)',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover Image',
      admin: {
        description: 'Used for social sharing previews (Facebook, LinkedIn, WhatsApp). Also shown as thumbnail in the blog list.',
      },
    },
    {
      name: 'showCoverInArticle',
      type: 'checkbox',
      label: 'Show cover image in article',
      defaultValue: false,
      admin: {
        description: 'If checked, the cover image will be displayed at the top of the blog post for readers. If unchecked, it is only used for social sharing previews — readers will not see it in the article.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      editor: lexicalEditor({}),
      required: true,
    },
    {
      name: 'readingTime',
      type: 'text',
      label: 'Reading Time',
      admin: {
        description: 'E.g. "5 min read"',
      },
    },
    // ── Organisation ──────────────────────────────────────────────
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured',
      defaultValue: false,
      admin: {
        description: 'Mark this post as featured. Useful for highlighting on the site later.',
        position: 'sidebar',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'Categories',
      admin: {
        description: 'Assign one or more categories to this post.',
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      label: 'Tags',
      admin: {
        description: 'Add topic tags to this post.',
        position: 'sidebar',
      },
    },
  ],
}
