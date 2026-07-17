import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	// ブログ記事。src/content/blog/{lang}/{slug}.md に配置し、
	// 同じ slug を持つ言語同士が翻訳ペアとして hreflang で相互リンクされる。
	// 公開待ち記事は リポジトリ直下の content-queue/ に置く（ビルド対象外）。
	blog: defineCollection({
		loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			// キュー投入時は仮の日付でよい。scripts/publish-queue.mjs が
			// 公開時に実際の公開日（Asia/Tokyo）へ書き換える。
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			tags: z.array(z.string()).default([]),
			// 一覧カード・記事ヘッダーに表示するアイコン絵文字
			emoji: z.string().optional(),
			// 記事末尾CTAのサブコピー。その記事を読み終えた人に刺さる一文を記事ごとに書く。
			// 未設定なら lp.ts の cta.sub（「無料・登録不要。」）にフォールバックする。
			ctaSub: z.string().optional(),
		}),
	}),
};
