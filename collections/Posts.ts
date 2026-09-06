import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedDate'],
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
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the title. E.g. "why-brands-start-with-a-question"',
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
  ],
}
