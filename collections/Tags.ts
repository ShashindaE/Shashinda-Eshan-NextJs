import type { CollectionConfig } from 'payload'

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const Tags: CollectionConfig = {
  slug: 'tags',
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        const raw = (data.slug || '').trim()
        if (!raw && data.name) {
          data.slug = toSlug(data.name)
        } else if (raw) {
          data.slug = toSlug(raw)
        }
        return data
      },
    ],
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      unique: true,
      admin: {
        description: 'Leave blank to auto-generate from name.',
      },
    },
  ],
}
