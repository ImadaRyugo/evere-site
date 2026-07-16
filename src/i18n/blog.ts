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
	/** 記事末尾CTAの見出し */
	ctaTitle: string;
	/** 記事末尾CTAの本文 */
	ctaBody: string;
	/** 記事末尾CTAのボタン */
	ctaButton: string;
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
		ctaTitle: 'Split bills the easy way',
		ctaBody: 'Evere keeps track of who paid what — even across currencies.',
		ctaButton: 'Download Evere',
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
		ctaTitle: '割り勘を、もっとシンプルに',
		ctaBody: '誰がいくら立て替えたか、通貨が違っても Evere が自動で整理します。',
		ctaButton: 'Evere をダウンロード',
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
		ctaTitle: 'หารบิลแบบง่าย ๆ',
		ctaBody: 'Evere ช่วยจดว่าใครจ่ายอะไร แม้ต่างสกุลเงินก็คำนวณให้อัตโนมัติ',
		ctaButton: 'ดาวน์โหลด Evere',
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
		ctaTitle: '더치페이를 더 간단하게',
		ctaBody: '누가 얼마를 냈는지, 통화가 달라도 Evere가 자동으로 정리해 드립니다.',
		ctaButton: 'Evere 다운로드',
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
		ctaTitle: '让分账更简单',
		ctaBody: '谁垫付了多少，即使币种不同，Evere 也会自动帮你算清。',
		ctaButton: '下载 Evere',
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
		ctaTitle: '讓分帳更簡單',
		ctaBody: '誰墊付了多少，即使幣別不同，Evere 也會自動幫你算清。',
		ctaButton: '下載 Evere',
	},
};

/** pubDate 表示用のロケール別フォーマッタ（ビルド時に実行される） */
export function formatDate(date: Date, locale: LpLocale): string {
	return new Intl.DateTimeFormat(HTML_LANG[locale], {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'Asia/Tokyo',
	}).format(date);
}
