// ブログ（/{lang}/blog/）用の翻訳辞書。
// LP辞書（lp.ts）と分離し、ブログ関連の文言はここに集約する。

import { HTML_LANG, type LpLocale } from './lp';

export interface BlogDict {
	/** 一覧ページの meta title（サイト名は付けずページ側で組み立てる） */
	listTitle: string;
	listDescription: string;
	/** 一覧ページの h1 */
	heading: string;
	/** 一覧ページのリード文 */
	intro: string;
	/** 記事が1本もないときの表示 */
	empty: string;
	/** 記事ページ → 一覧への戻りリンク */
	backToList: string;
	/** 公開日ラベル（<time> の前に表示） */
	published: string;
	/** 更新日ラベル */
	updated: string;
	/**
	 * 記事末尾CTAの見出し。トップページ最終CTA（lp.ts の cta.title）と同じメッセージだが、
	 * 記事では1行で見せるため改行なしの言い回しにしたもの。
	 * 直下のサブコピーは記事ごとに frontmatter の ctaSub で書く。
	 */
	ctaTitle: string;
	/** 目次の見出し */
	toc: string;
	/** 関連記事セクションの見出し */
	related: string;
	/** 読了時間（{n} が分数に置換される） */
	readingTime: string;
}

export const blogDict: Record<LpLocale, BlogDict> = {
	en: {
		listTitle: 'Blog',
		listDescription:
			'Tips and guides on splitting bills with your partner or friends — across currencies, without the awkward math.',
		heading: 'Blog',
		intro: 'Tips and guides on splitting bills and settling up, from everyday life to trips abroad.',
		empty: 'No articles yet. Check back soon!',
		backToList: 'Back to Blog',
		published: 'Published',
		updated: 'Updated',
		ctaTitle: 'With anyone, anywhere.',
		toc: 'Contents',
		related: 'Related articles',
		readingTime: '{n} min read',
	},
	ja: {
		listTitle: 'ブログ',
		listDescription:
			'カップル・友だち同士の割り勘や精算のコツ、通貨をまたぐ立て替えの整理術を紹介するEvere公式ブログ。',
		heading: 'ブログ',
		intro: '日常の割り勘から海外での精算まで、お金の分担をラクにするコツを紹介します。',
		empty: '記事は準備中です。もうしばらくお待ちください。',
		backToList: 'ブログ一覧へ戻る',
		published: '公開日',
		updated: '更新日',
		ctaTitle: 'だれとでも、どこへでも。',
		toc: '目次',
		related: '関連記事',
		readingTime: '約{n}分で読めます',
	},
	th: {
		listTitle: 'บล็อก',
		listDescription:
			'เคล็ดลับการหารค่าใช้จ่ายกับแฟนหรือเพื่อน และการเคลียร์เงินข้ามสกุลเงิน จากทีม Evere',
		heading: 'บล็อก',
		intro: 'เคล็ดลับการหารบิลและเคลียร์เงิน ตั้งแต่ชีวิตประจำวันจนถึงทริปต่างประเทศ',
		empty: 'ยังไม่มีบทความ โปรดกลับมาใหม่เร็ว ๆ นี้',
		backToList: 'กลับไปที่บล็อก',
		published: 'เผยแพร่เมื่อ',
		updated: 'อัปเดตเมื่อ',
		ctaTitle: 'กับใครก็ได้ ที่ไหนก็ได้',
		toc: 'สารบัญ',
		related: 'บทความที่เกี่ยวข้อง',
		readingTime: 'อ่านประมาณ {n} นาที',
	},
	ko: {
		listTitle: '블로그',
		listDescription:
			'커플·친구 사이의 더치페이와 정산 노하우, 서로 다른 통화의 정산 방법을 소개하는 Evere 공식 블로그.',
		heading: '블로그',
		intro: '일상 속 더치페이부터 해외에서의 정산까지, 돈 분담을 편하게 하는 팁을 소개합니다.',
		empty: '아직 게시글이 없습니다. 곧 찾아뵙겠습니다!',
		backToList: '블로그 목록으로',
		published: '게시일',
		updated: '업데이트',
		ctaTitle: '누구와도, 어디서나.',
		toc: '목차',
		related: '관련 글',
		readingTime: '약 {n}분 소요',
	},
	'zh-hans': {
		listTitle: '博客',
		listDescription: 'Evere 官方博客：情侣与朋友之间的 AA 制分账技巧，以及跨币种结算的实用指南。',
		heading: '博客',
		intro: '从日常分账到出国旅行结算，分享让分摊费用更轻松的实用技巧。',
		empty: '文章正在准备中，敬请期待！',
		backToList: '返回博客列表',
		published: '发布于',
		updated: '更新于',
		ctaTitle: '无论与谁，无论去哪。',
		toc: '目录',
		related: '相关文章',
		readingTime: '阅读约 {n} 分钟',
	},
	'zh-hant': {
		listTitle: '部落格',
		listDescription: 'Evere 官方部落格：情侶與朋友之間的分帳技巧，以及跨幣別結算的實用指南。',
		heading: '部落格',
		intro: '從日常分帳到出國旅行結算，分享讓分攤費用更輕鬆的實用技巧。',
		empty: '文章準備中，敬請期待！',
		backToList: '返回部落格列表',
		published: '發佈於',
		updated: '更新於',
		ctaTitle: '無論與誰，無論去哪。',
		toc: '目錄',
		related: '相關文章',
		readingTime: '閱讀約 {n} 分鐘',
	},
};

/** 読了時間（分）の概算。CJK/タイ語は文字数、それ以外は単語数ベース */
export function estimateReadingMinutes(markdown: string, locale: LpLocale): number {
	// frontmatter・コード・リンクURL・記号を除いた本文で概算する
	const text = markdown
		.replace(/^---[\s\S]*?---/, '')
		.replace(/```[\s\S]*?```/g, '')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/[#>*|`\-]/g, '');
	if (locale === 'en') {
		const words = text.split(/\s+/).filter(Boolean).length;
		return Math.max(1, Math.round(words / 200));
	}
	// 日本語・韓国語・中国語・タイ語: 500文字/分 前後で概算
	const chars = text.replace(/\s/g, '').length;
	return Math.max(1, Math.round(chars / 500));
}

/** pubDate 表示用のロケール別フォーマッタ（ビルド時に実行される） */
export function formatDate(date: Date, locale: LpLocale): string {
	return new Intl.DateTimeFormat(HTML_LANG[locale], {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'Asia/Tokyo',
	}).format(date);
}
