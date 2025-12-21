import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'サイト設定',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '設定名',
      type: 'string',
      initialValue: 'サイト設定',
      readOnly: true,
    }),
    defineField({
      name: 'heroPosts',
      title: 'ヒーローエリア記事',
      description: 'TOPページのヒーローエリアに表示する記事を最大3つ選択してください',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'post' }],
        },
      ],
      validation: (Rule) => Rule.max(3).unique(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
