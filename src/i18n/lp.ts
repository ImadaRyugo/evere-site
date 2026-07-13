// LP（トップページ）用の翻訳辞書。
// 事実ベースの記述のみ。プラン内容・タブ名・分割モード名・精算バッジは
// アプリ実装 (apps/mobile/app/i18n/locales/*.json) の文言に合わせている。

export const LP_LOCALES = ['en', 'ja', 'th', 'ko', 'zh-hans', 'zh-hant'] as const;
export type LpLocale = (typeof LP_LOCALES)[number];

// 言語 → 各国App Storeストアフロント（全ストアで配信確認済み・2026-07）
export const APP_STORE_URLS: Record<LpLocale, string> = {
	en: 'https://apps.apple.com/us/app/id6760035569',
	ja: 'https://apps.apple.com/jp/app/id6760035569',
	// タイのストアフロントはデフォルト表示言語が英語のため ?l=th でタイ語表示を明示
	th: 'https://apps.apple.com/th/app/id6760035569?l=th',
	ko: 'https://apps.apple.com/kr/app/id6760035569',
	'zh-hans': 'https://apps.apple.com/cn/app/id6760035569',
	'zh-hant': 'https://apps.apple.com/tw/app/id6760035569',
};

export const HTML_LANG: Record<LpLocale, string> = {
	en: 'en',
	ja: 'ja',
	th: 'th',
	ko: 'ko',
	'zh-hans': 'zh-CN',
	'zh-hant': 'zh-TW',
};

export const LOCALE_LABELS: Record<LpLocale, string> = {
	en: 'English',
	ja: '日本語',
	th: 'ไทย',
	ko: '한국어',
	'zh-hans': '简体中文',
	'zh-hant': '繁體中文',
};

export interface LpPricingRow {
	name: string;
	free: boolean | string;
	pro: boolean | string;
}

export interface LpMockExpense {
	title: string;
	date: string;
	payer: string;
	amount: string;
	sub?: string;
	settled?: boolean;
}

export interface LpDict {
	meta: { title: string; description: string };
	nav: { features: string; pricing: string; faq: string; support: string; download: string };
	hero: {
		title: string[];
		sub: string;
		cta: string;
		ctaNote: string;
	};
	story: { scenes: { kicker: string; title: string }[] };
	featuresHeading: { eyebrow: string; title: string };
	features: { label: string; title: string; body: string }[];
	splitModes: [string, string, string];
	fxDemo: {
		rows: { sym: string; code: string; val: string }[];
		base: { code: string; prefix: string; amount: number };
	};
	more: { title: string; items: { icon: string; title: string; body: string }[] };
	steps: { eyebrow: string; title: string; items: { title: string; body: string }[] };
	pricing: {
		eyebrow: string;
		title: string;
		note: string;
		planFree: string;
		planPro: string;
		featureCol: string;
		groups: { label: string; rows: LpPricingRow[] }[];
	};
	reviews: {
		eyebrow: string;
		title: string;
		score: string;
		ratingNote: string;
		translatedNote: string;
		more: string;
		items: { title: string; body: string; author: string }[];
	};
	faq: { eyebrow: string; title: string; items: { q: string; a: string }[] };
	cta: { title: string; sub: string; button: string };
	footer: {
		tagline: string;
		product: string;
		resources: string;
		legal: string;
		guide: string;
		support: string;
		privacy: string;
		terms: string;
		language: string;
	};
	supportPage: {
		metaTitle: string;
		metaDescription: string;
		title: string;
		intro: string;
		nameLabel: string;
		emailLabel: string;
		messageLabel: string;
		submit: string;
		sending: string;
		success: string;
		error: string;
		invalid: string;
		mailNote: string;
	};
	mock: {
		project: string;
		expenses: LpMockExpense[];
		settled: string;
		toast: { title: string; body: string; time: string };
		tabs: [string, string, string, string, string];
		settle: {
			summary: string;
			totalCount: string;
			totalAmount: string;
			countValue: string;
			totalValue: string;
			totalSub: string;
			status: string;
			settledLabel: string;
			unsettledLabel: string;
			settledValue: string;
			settledSub: string;
			unsettledValue: string;
			unsettledSub: string;
			percent: number;
			comparison: string;
			paidLabel: string;
			owesLabel: string;
			members: { name: string; paid: number; owes: number }[];
			byCategory: string;
			categories: { icon: string; name: string; amount: string; sub: string; percent: number }[];
		};
	};
}

export const lp: Record<LpLocale, LpDict> = {
	/* ---------------------------------- 日本語 ---------------------------------- */
	ja: {
		meta: {
			title: '割り勘・立て替え精算アプリ Evere｜登録不要・無料',
			description:
				'162通貨対応の割り勘・精算アプリ。旅先でも、ふだんの生活でも。支払いを登録するだけで、あとはEvereが自動で精算。大切な方やグループでの利用にぜひ。',
		},
		nav: { features: '機能', pricing: 'プラン', faq: 'FAQ', support: 'サポート', download: 'ダウンロード' },
		hero: {
			title: ['割り勘を、', 'もっと美しく。'],
			sub: '旅先でも、ふだんの生活でも。払った人と金額を記録するだけで、あとはEvereが自動で精算。',
			cta: 'App Store でダウンロード',
			ctaNote: '無料・登録不要',
		},
		story: {
			scenes: [
				{ kicker: '記録', title: '払ったら、\nその場で記録。' },
				{ kicker: '共有', title: '全員のスマホに、\nすぐ届く。' },
				{ kicker: '精算', title: '記録するだけで、\n精算状況をひと目で。' },
			],
		},
		featuresHeading: { eyebrow: '機能', title: '割り勘に必要な機能、\nぜんぶ入り。' },
		features: [
			{
				label: 'マルチ通貨',
				title: '162通貨、自動レート換算。',
				body: '支払いも精算も、好きな通貨で。為替レートは自動で取得して、普段使用する通貨に換算します。Proなら自分でレートを決めることも。',
			},
			{
				label: '柔軟な分割',
				title: '割り方も、思いのまま。',
				body: 'ふたり暮らしの6:4も、飲み会の等分も、「今日は多めに」も。\nぜんぶその場で、1タップ。',
			},
			{
				label: 'グループ共有',
				title: 'リンクを送るだけで、\n全員とつながる。',
				body: '招待はリンクひとつで。記録した支払いは全員のスマホに即反映されます。アプリを入れていない人も、名前だけで追加できます。',
			},
			{
				label: '精算',
				title: '「誰が誰にいくら」を一瞬で。',
				body: '精算は、最小の回数で。どんなに入り組んだ立て替えも、誰が誰に払えばいいかを自動で計算します。精算状況も、いつでも確認できます。',
			},
		],
		splitModes: ['均等割', '割合指定', '金額指定'],
		fxDemo: { rows: [{ sym: '฿', code: 'THB', val: '฿4,200' }, { sym: '$', code: 'USD', val: '$120.00' }, { sym: '€', code: 'EUR', val: '€86.40' }], base: { code: 'JPY', prefix: '¥', amount: 51000 } },
		more: {
			title: 'まだある、便利な機能。',
			items: [
				{ icon: 'guest', title: 'ゲストモード', body: 'アカウント登録不要ですぐに使える' },
				{ icon: 'receipt', title: '画像添付', body: 'レシートやお店の写真を支払いに添付' },
				{ icon: 'category', title: 'カテゴリ管理', body: 'カテゴリを設定して支出を整理' },
				{ icon: 'report', title: '共有機能', body: 'アプリを入れてないメンバーにも簡単に共有' },
				{ icon: 'budget', title: '予算アラート', body: '使いすぎる前にお知らせ（Pro）' },
				{ icon: 'offline', title: 'オフラインモード', body: '電波がなくても利用できる（Pro）' },
			],
		},
		steps: {
			eyebrow: '使い方',
			title: '使い方は、これだけ。',
			items: [
				{ title: 'プロジェクトを作成', body: '旅行、デート、飲み会。シーンごとに作って、メンバーを呼ぶだけ。登録は要りません。' },
				{ title: '支払いを記録', body: '払った人と金額を入れるだけ。通貨の指定もレシート添付も、その場でサッと。' },
				{ title: '精算する', body: '「誰が誰にいくら」はEvereが計算。送金したらチェックして、おしまい。' },
			],
		},
		pricing: {
			eyebrow: 'プラン',
			title: 'まずは無料で、\n必要になったら Proへ。',
			note: '価格はアプリ内でご確認ください。',
			planFree: 'Free',
			planPro: 'Pro',
			featureCol: '機能',
			groups: [
				{
					label: '基本機能',
					rows: [
						{ name: 'プロジェクト数', free: '3個まで', pro: '無制限' },
						{ name: '画像添付', free: '5枚', pro: '無制限' },
						{ name: 'マルチ通貨', free: true, pro: true },
						{ name: 'メンバー招待', free: true, pro: true },
						{ name: 'リアルタイム同期', free: true, pro: true },
					],
				},
				{
					label: 'Pro 限定',
					rows: [
						{ name: '手動為替レート', free: false, pro: true },
						{ name: '予算設定・到達通知', free: false, pro: true },
						{ name: 'オフラインモード', free: false, pro: true },
						{ name: '広告非表示', free: false, pro: true },
					],
				},
			],
		},
		reviews: {
			eyebrow: 'レビュー',
			title: 'ユーザーの声',
			score: '5.0',
			ratingNote: 'App Storeでのユーザー評価',
			translatedNote: '※ 原文が別言語のレビューは翻訳して掲載しています。',
			more: '続きを読む',
			items: [
				{
					title: 'こういうのが欲しかった',
					body: '普段から別の割り勘アプリを使っていますが、友人の紹介でインストール。多通貨対応、割り勘割合設定など、正直ここまで痒い所に手が届くアプリは無かったのでお気に入りです。',
					author: 'Kei1110',
				},
				{
					title: '痒いところに手が届く割り勘アプリ',
					body: '仲の良い複数人グループでの割り勘アプリは、単発利用向けのものはありましたが、過去の精算履歴も含めてまとめて管理できるアプリはなかなかありませんでした。その中でこのアプリは、まだ荒削りな部分もありつつ、細かい設定や支払いの割り当てができ、とても使いやすいです。',
					author: 'Mu\"',
				},
				{
					title: '素晴らしいアプリ！',
					body: '仕事で海外へ行くことが多いのですが、このアプリのおかげで旅行中の割り勘がとても簡単になりました。いろんな国の友人と会うと通貨の換算がいつも面倒でしたが、このアプリならシンプルでストレスフリー。特にグループでの食事のときに便利です。これからの進化も楽しみですし、旅行や割り勘の機会が多い人にはぜひおすすめしたいです。',
					author: 'JonD87',
				},
				{
					title: '友人との海外旅行で便利',
					body: '意外と今までありそうでなかったアプリだと思います。プロジェクトごとに支払い状態が見やすく整理され、すごく使いやすいです！',
					author: 'YUMA963',
				},
				{
					title: '旅行にぴったり',
					body: '使いやすくて便利。友達との旅行で、なんでもきれいに割り勘できます。',
					author: 'eralf . lp',
				},
				{
					title: '令和の通貨インフラ',
					body: '円安、物価高、多通貨時代。そういう時代だからこそ、割り勘精算 evereの価値がある。UIもかなり今っぽい。このアプリはただの割り勘アプリではない。割り勘と向き合うアプリなんです。',
					author: 'コピライター',
				},
			],
		},
		faq: {
			eyebrow: 'FAQ',
			title: 'よくある質問',
			items: [
				{
					q: 'Evere は無料で使えますか？',
					a: 'はい。記録・共有・精算まで、ふだん使いに必要な機能は無料で使えます。プロジェクト数などの上限をなくしたくなったら、Proをどうぞ。',
				},
				{
					q: 'アカウント登録は必要ですか？',
					a: 'いいえ。ゲストモードならインストールしてすぐ使えます。あとから Apple・Google・メールで登録すれば全機能が解放されて、それまでのデータもそのまま。',
				},
				{
					q: '対応デバイスは？',
					a: 'iOS 15.1 以降の iPhone に対応しています。Android版は現在提供していません。',
				},
				{
					q: '何通貨に対応していますか？',
					a: '162通貨に対応し、為替レートは自動で取得されます。Pro では手動レートの入力もできます。',
				},
				{
					q: '一緒に使う人もアプリのインストールが必要ですか？',
					a: '招待リンクから参加してもらう場合は必要です。アプリを使わない人は、名前だけの参加者として追加でき、各支払い・精算結果も簡単に共有できます。',
				},
			],
		},
		cta: {
			title: 'だれとでも、\nどこへでも。',
			sub: '無料・登録不要。',
			button: 'App Store でダウンロード',
		},
		footer: {
			tagline: '割り勘を、もっと美しく。',
			product: 'プロダクト',
			resources: 'リソース',
			legal: '法務',
			guide: '使い方ガイド',
			support: 'サポート',
			privacy: 'プライバシーポリシー',
			terms: '利用規約',
			language: '言語',
		},
		supportPage: {
			metaTitle: 'サポート・お問い合わせ | Evere',
			metaDescription:
				'割り勘・精算アプリEvereのサポート窓口。ご質問・不具合報告・ご要望はお問い合わせフォームからどうぞ。',
			title: 'お問い合わせ',
			intro: 'Evereへのご質問・不具合のご報告・ご要望など、お気軽にお送りください。',
			nameLabel: 'お名前（任意）',
			emailLabel: 'メールアドレス',
			messageLabel: 'お問い合わせ内容',
			submit: '送信する',
			sending: '送信中…',
			success: 'お問い合わせを送信しました。\n通常1〜2日以内に返信いたします。',
			error: '送信に失敗しました。時間をおいて再度お試しいただくか、メールで直接ご連絡ください。',
			invalid: 'メールアドレスとお問い合わせ内容を入力してください。',
			mailNote: 'メールでのご連絡はこちら: ',
		},
		mock: {
			project: 'タイ旅行',
			expenses: [
				{ title: '🏨 ホテル', date: '3月12日', payer: 'Yuki', amount: '4,200 THB', sub: '≈ 17,600 JPY' },
				{ title: '🍽️ ディナー', date: '3月12日', payer: 'Ren', amount: '1,860 THB', sub: '≈ 7,800 JPY', settled: true },
				{ title: '🚕 タクシー', date: '3月13日', payer: 'Aoi', amount: '240 THB', sub: '≈ 1,000 JPY', settled: true },
				{ title: '☕️ カフェ', date: '3月13日', payer: 'Yuki', amount: '320 THB', sub: '≈ 1,340 JPY' },
				{ title: '🍢 屋台ごはん', date: '3月13日', payer: 'Aoi', amount: '450 THB', sub: '≈ 1,890 JPY' },
				{ title: '🛍️ お土産', date: '3月14日', payer: 'Ren', amount: '980 THB', sub: '≈ 4,100 JPY' },
				{ title: '💆 マッサージ', date: '3月14日', payer: 'Yuki', amount: '700 THB', sub: '≈ 2,930 JPY' },
			],
			settled: '精算済',
			toast: { title: '新しい支払いが追加されました', body: '🍽️ ディナー: THB 1,860', time: '現在' },
			tabs: ['プロジェクト', '支出', '追加', '精算', '設定'],
			settle: {
				summary: 'サマリー',
				totalCount: '総支払い数',
				totalAmount: '総額',
				countValue: '7件',
				totalValue: '8,750 THB',
				totalSub: '≈ 36,700 JPY',
				status: '精算状況',
				settledLabel: '精算済み',
				unsettledLabel: '未精算',
				settledValue: '2,100 THB',
				settledSub: '≈ 8,800 JPY',
				unsettledValue: '6,650 THB',
				unsettledSub: '≈ 27,900 JPY',
				percent: 24,
				comparison: '支払い比較',
				paidLabel: '支払額',
				owesLabel: '負担額',
				byCategory: 'カテゴリ別',
				categories: [
					{ icon: '🏨', name: '宿泊費', amount: '4,200 THB', sub: '≈ 17,600 JPY', percent: 48 },
					{ icon: '🍽️', name: '食費', amount: '2,630 THB', sub: '≈ 11,000 JPY', percent: 30 },
					{ icon: '🛍️', name: '買い物', amount: '980 THB', sub: '≈ 4,100 JPY', percent: 11 },
				],
				members: [
					{ name: 'Yuki', paid: 5220, owes: 2917 },
					{ name: 'Ren', paid: 2840, owes: 2917 },
					{ name: 'Aoi', paid: 690, owes: 2917 },
				],
			},
		},
	},

	/* ---------------------------------- English ---------------------------------- */
	en: {
		meta: {
			title: 'Bill Splitting App — Evere | Split Expenses Free, No Sign-Up',
			description:
				'Evere is a bill splitting and expense sharing app. Log who paid and it works out who owes whom — across 162 currencies. Perfect for trips, housemates, and everyday IOUs. Free on iOS, no sign-up needed.',
		},
		nav: { features: 'Features', pricing: 'Plans', faq: 'FAQ', support: 'Support', download: 'Download' },
		hero: {
			title: ['Split bills,', 'beautifully.'],
			sub: 'Log who paid — Evere does the math and keeps your whole group in sync.',
			cta: 'Download on the App Store',
			ctaNote: 'Free · No sign-up needed',
		},
		story: {
			scenes: [
				{ kicker: 'Log', title: 'Paid? Logged on the spot.' },
				{ kicker: 'Sync', title: 'On everyone’s phone, instantly.' },
				{ kicker: 'Settle', title: 'Just log payments — see where you stand.' },
			],
		},
		featuresHeading: { eyebrow: 'Features', title: 'Everything you need to split fairly.' },
		features: [
			{
				label: 'Multi-currency',
				title: '162 currencies, auto-converted.',
				body: 'Pay in baht, settle in dollars. Rates are fetched automatically and converted to your home currency — or set your own with Pro.',
			},
			{
				label: 'Flexible splits',
				title: 'Split it your way.',
				body: 'Go 60/40 with your partner, split evenly at dinner, or chip in a bit more — each takes a single tap.',
			},
			{
				label: 'Group sharing',
				title: 'One link, and everyone’s in.',
				body: 'Invites are just a link, and every expense lands on everyone’s phone instantly. Friends without the app? Add them by name.',
			},
			{
				label: 'Settle up',
				title: '“Who owes whom, how much” — instantly.',
				body: 'Settle up in as few payments as possible. However messy it gets, Evere works out who pays whom — and you can check the settlement status anytime.',
			},
		],
		splitModes: ['Equal', 'By Percentage', 'By Amount'],
		fxDemo: { rows: [{ sym: '฿', code: 'THB', val: '฿4,200' }, { sym: '¥', code: 'JPY', val: '¥18,000' }, { sym: '€', code: 'EUR', val: '€86.40' }], base: { code: 'USD', prefix: '$', amount: 340 } },
		more: {
			title: 'The little things, covered.',
			items: [
				{ icon: 'guest', title: 'Guest mode', body: 'No sign-up — start using it right away' },
				{ icon: 'receipt', title: 'Photo attachments', body: 'Attach receipts or photos to any expense' },
				{ icon: 'category', title: 'Categories', body: 'Set up categories to organize spending' },
				{ icon: 'report', title: 'Easy sharing', body: 'Share payments with members without the app' },
				{ icon: 'budget', title: 'Budget alerts', body: 'A heads-up before you overspend (Pro)' },
				{ icon: 'offline', title: 'Offline mode', body: 'Works even without a signal (Pro)' },
			],
		},
		steps: {
			eyebrow: 'How it works',
			title: 'Three steps to settled.',
			items: [
				{ title: 'Create a project', body: 'A trip, a flat, a night out — make a project and invite the crew. No sign-up needed.' },
				{ title: 'Log expenses', body: 'Who paid, how much, done. Add a currency or a receipt photo if you need it.' },
				{ title: 'Settle up', body: 'Evere works out who owes whom. Pay up, tick it off, move on.' },
			],
		},
		pricing: {
			eyebrow: 'Plans',
			title: 'Start free. Go Pro when you need more.',
			note: 'See in-app for prices.',
			planFree: 'Free',
			planPro: 'Pro',
			featureCol: 'Feature',
			groups: [
				{
					label: 'Basics',
					rows: [
						{ name: 'Projects', free: 'Up to 3', pro: 'Unlimited' },
						{ name: 'Photo attachments', free: '5/project', pro: 'Unlimited' },
						{ name: 'Multi-currency (auto rates)', free: true, pro: true },
						{ name: 'Member invites', free: true, pro: true },
						{ name: 'Real-time sync', free: true, pro: true },
					],
				},
				{
					label: 'Pro only',
					rows: [
						{ name: 'Manual FX rate', free: false, pro: true },
						{ name: 'Budgets & progress alerts', free: false, pro: true },
						{ name: 'Offline mode', free: false, pro: true },
						{ name: 'Ad-free', free: false, pro: true },
					],
				},
			],
		},
		reviews: {
			eyebrow: 'Reviews',
			title: 'What our users say',
			score: '5.0',
			ratingNote: 'User rating on the App Store',
			translatedNote: '* Reviews originally written in other languages are shown in translation.',
			more: 'Read more reviews',
			items: [
				{
					title: 'Exactly what I wanted',
					body: 'I usually use a different bill-splitting app, but installed this one on a friend’s recommendation. Multi-currency support, custom split ratios — honestly, no other app gets the details this right. It’s my favorite now.',
					author: 'Kei1110',
				},
				{
					title: 'A splitting app that sweats the details',
					body: 'There are plenty of one-off splitting tools, but hardly any apps let a close group manage everything in one place, including past settlement history. This one still has a few rough edges, but with its fine-grained settings and payment assignments, it’s really easy to use.',
					author: 'Mu\"',
				},
				{
					title: 'Great app!',
					body: 'I travel internationally for work quite often, and this app has made splitting expenses during my recent trips incredibly easy. Meeting up with friends in different countries and trying to convert currencies has always been a hassle, but this app makes the process simple, convenient, and stress free, especially when dining in groups. I’m excited to see how the app continues to grow and evolve. So far, I’ve absolutely loved using it and would highly recommend it to anyone who travels or frequently shares expenses with others.',
					author: 'JonD87',
				},
				{
					title: 'Handy for trips abroad with friends',
					body: 'Surprisingly, an app like this didn’t really exist before. Payments are neatly organized by project, and it’s incredibly easy to use!',
					author: 'YUMA963',
				},
				{
					title: 'good for trip',
					body: 'Easy and convenient to use. When traveling with friends, everything splits out perfectly.',
					author: 'eralf . lp',
				},
				{
					title: 'Currency infrastructure for a new era',
					body: 'A weak yen, rising prices, a multi-currency age. That’s exactly why Evere matters in times like these. The UI also feels very now. This is no ordinary bill-splitting app — it’s an app that truly faces the bill split.',
					author: 'コピライター',
				},
			],
		},
		faq: {
			eyebrow: 'FAQ',
			title: 'Frequently asked questions',
			items: [
				{
					q: 'Is Evere free?',
					a: 'Yes — tracking, sharing, and settling are all free. Go Pro only if you want limits like the project cap removed.',
				},
				{
					q: 'Do I need an account?',
					a: 'No. Guest mode lets you start without one. Link an Apple, Google, or email account later to unlock everything — your data comes with you.',
				},
				{ q: 'Which devices are supported?', a: 'iPhone running iOS 15.1 or later. There’s no Android version at the moment.' },
				{
					q: 'How many currencies are supported?',
					a: '162 currencies, with exchange rates fetched automatically. Pro also lets you enter rates manually.',
				},
				{
					q: 'Does everyone need the app?',
					a: 'Only members who join through an invite link need it. Friends without the app can be added by name, and you can easily share expenses and settlement results with them.',
				},
			],
		},
		cta: {
			title: 'With anyone\nAnywhere',
			sub: 'Free, no sign-up.',
			button: 'Download on the App Store',
		},
		footer: {
			tagline: 'Split bills easily across currencies.',
			product: 'Product',
			resources: 'Resources',
			legal: 'Legal',
			guide: 'User guide',
			support: 'Support',
			privacy: 'Privacy Policy',
			terms: 'Terms of Service',
			language: 'Language',
		},
		supportPage: {
			metaTitle: 'Support & Contact | Evere',
			metaDescription:
				'Get help with Evere, the bill splitting app. Send questions, bug reports, and feature requests through our contact form.',
			title: 'Contact us',
			intro: 'Questions, bug reports, feature requests — send us anything. We read every message.',
			nameLabel: 'Name (optional)',
			emailLabel: 'Email',
			messageLabel: 'Message',
			submit: 'Send message',
			sending: 'Sending…',
			success: 'Your message has been sent.\nWe usually reply within 1–2 days.',
			error: 'Something went wrong. Please try again later, or email us directly.',
			invalid: 'Please enter your email address and a message.',
			mailNote: 'Prefer email? Reach us at ',
		},
		mock: {
			project: 'Thailand Trip',
			expenses: [
				{ title: '🏨 Hotel', date: 'Mar 12', payer: 'Yuki', amount: '4,200 THB', sub: '≈ 124 USD' },
				{ title: '🍽️ Dinner', date: 'Mar 12', payer: 'Ren', amount: '1,860 THB', sub: '≈ 55 USD', settled: true },
				{ title: '🚕 Taxi', date: 'Mar 13', payer: 'Aoi', amount: '240 THB', sub: '≈ 7 USD', settled: true },
				{ title: '☕️ Cafe', date: 'Mar 13', payer: 'Yuki', amount: '320 THB', sub: '≈ 9 USD' },
				{ title: '🍢 Street food', date: 'Mar 13', payer: 'Aoi', amount: '450 THB', sub: '≈ 13 USD' },
				{ title: '🛍️ Souvenirs', date: 'Mar 14', payer: 'Ren', amount: '980 THB', sub: '≈ 29 USD' },
				{ title: '💆 Massage', date: 'Mar 14', payer: 'Yuki', amount: '700 THB', sub: '≈ 21 USD' },
			],
			settled: 'Settled',
			toast: { title: 'New expense added', body: '🍽️ Dinner: THB 1,860', time: 'now' },
			tabs: ['Projects', 'Expenses', 'Add', 'Settle Up', 'Settings'],
			settle: {
				summary: 'Summary',
				totalCount: 'Total payments',
				totalAmount: 'Total amount',
				countValue: '7',
				totalValue: '8,750 THB',
				totalSub: '≈ 257 USD',
				status: 'Settlement status',
				settledLabel: 'Settled',
				unsettledLabel: 'Unsettled',
				settledValue: '2,100 THB',
				settledSub: '≈ 62 USD',
				unsettledValue: '6,650 THB',
				unsettledSub: '≈ 196 USD',
				percent: 24,
				comparison: 'Payment comparison',
				paidLabel: 'Paid',
				owesLabel: 'Owed',
				byCategory: 'By category',
				categories: [
					{ icon: '🏨', name: 'Accommodation', amount: '4,200 THB', sub: '≈ 124 USD', percent: 48 },
					{ icon: '🍽️', name: 'Food', amount: '2,630 THB', sub: '≈ 77 USD', percent: 30 },
					{ icon: '🛍️', name: 'Shopping', amount: '980 THB', sub: '≈ 29 USD', percent: 11 },
				],
				members: [
					{ name: 'Yuki', paid: 5220, owes: 2917 },
					{ name: 'Ren', paid: 2840, owes: 2917 },
					{ name: 'Aoi', paid: 690, owes: 2917 },
				],
			},
		},
	},

	/* ---------------------------------- ไทย ---------------------------------- */
	th: {
		meta: {
			title: 'แอปหารบิล Evere | หารเงินกับเพื่อน ใช้ฟรี ไม่ต้องสมัคร',
			description:
				'Evere แอปหารบิลและแชร์ค่าใช้จ่าย บันทึกว่าใครจ่ายเท่าไหร่ แอปคำนวณให้ว่าใครต้องโอนให้ใคร เหมาะกับทริปเที่ยว รูมเมท และค่าใช้จ่ายประจำวัน รองรับ 162 สกุลเงิน ฟรีบน iOS ไม่ต้องสมัครสมาชิก',
		},
		nav: { features: 'ฟีเจอร์', pricing: 'แพลน', faq: 'FAQ', support: 'ซัพพอร์ต', download: 'ดาวน์โหลด' },
		hero: {
			title: ['หารบิล', 'อย่างสวยงาม'],
			sub: 'แค่บันทึกว่าใครจ่ายเท่าไหร่ ที่เหลือ Evere คิดให้หมด และซิงก์กับเพื่อนทั้งกลุ่มโดยอัตโนมัติ',
			cta: 'ดาวน์โหลดบน App Store',
			ctaNote: 'ฟรี · ไม่ต้องสมัครสมาชิก',
		},
		story: {
			scenes: [
				{ kicker: 'บันทึก', title: 'จ่ายปุ๊บ บันทึกปั๊บ' },
				{ kicker: 'ซิงก์', title: 'ถึงมือถือทุกคนทันที' },
				{ kicker: 'เคลียร์ยอด', title: 'แค่บันทึก ก็เห็นสถานะเคลียร์ยอดได้ทันที' },
			],
		},
		featuresHeading: { eyebrow: 'ฟีเจอร์', title: 'ครบทุกอย่างที่การหารบิลต้องมี' },
		features: [
			{
				label: 'หลายสกุลเงิน',
				title: '162 สกุลเงิน แปลงอัตโนมัติ',
				body: 'จ่ายเป็นเยน เคลียร์เป็นบาทก็ได้ อัตราแลกเปลี่ยนอัปเดตอัตโนมัติและแปลงเป็นสกุลเงินหลักของคุณ หรือกำหนดเรทเองได้ใน Pro',
			},
			{
				label: 'แบ่งได้ยืดหยุ่น',
				title: 'แบ่งยังไงก็ได้ ตามใจคุณ',
				body: 'แบ่ง 60/40 กับแฟน หารเท่ากันตอนกินเลี้ยง หรือ "มื้อนี้ขอออกเพิ่มหน่อย" ทุกแบบแค่แตะเดียว',
			},
			{
				label: 'แชร์กับกลุ่ม',
				title: 'ส่งลิงก์เดียว มากันครบทั้งแก๊ง',
				body: 'ชวนเพื่อนแค่ส่งลิงก์ รายจ่ายทุกรายการเด้งขึ้นมือถือทุกคนทันที เพื่อนที่ไม่มีแอปก็แค่ใส่ชื่อเพิ่มเข้ามาได้เลย',
			},
			{
				label: 'เคลียร์ยอด',
				title: '"ใครต้องจ่ายใคร เท่าไหร่" รู้ทันที',
				body: 'เคลียร์ยอดด้วยจำนวนครั้งน้อยที่สุด ยอดยืมกันวุ่นแค่ไหน Evere ก็คำนวณให้ว่าใครต้องจ่ายให้ใคร และเช็กสถานะการเคลียร์ยอดได้ตลอดเวลา',
			},
		],
		splitModes: ['แบ่งเท่ากัน', 'เปอร์เซ็นต์', 'จำนวนเงิน'],
		fxDemo: { rows: [{ sym: '¥', code: 'JPY', val: '¥18,000' }, { sym: '$', code: 'USD', val: '$120.00' }, { sym: '€', code: 'EUR', val: '€86.40' }], base: { code: 'THB', prefix: '฿', amount: 11900 } },
		more: {
			title: 'เรื่องเล็ก ๆ ก็คิดมาให้แล้ว',
			items: [
				{ icon: 'guest', title: 'โหมด Guest', body: 'ใช้ได้ทันที ไม่ต้องสมัครสมาชิก' },
				{ icon: 'receipt', title: 'แนบรูปภาพ', body: 'แนบใบเสร็จหรือรูปถ่ายไว้กับรายจ่าย' },
				{ icon: 'category', title: 'หมวดหมู่', body: 'ตั้งหมวดหมู่เพื่อจัดระเบียบรายจ่าย' },
				{ icon: 'report', title: 'ฟีเจอร์แชร์', body: 'แชร์รายจ่ายให้เพื่อนที่ไม่มีแอปได้ง่ายๆ' },
				{ icon: 'budget', title: 'แจ้งเตือนงบประมาณ', body: 'เตือนก่อนใช้เงินเกินงบ (Pro)' },
				{ icon: 'offline', title: 'โหมดออฟไลน์', body: 'ใช้ได้แม้ไม่มีสัญญาณ (Pro)' },
			],
		},
		steps: {
			eyebrow: 'วิธีใช้งาน',
			title: 'ใช้งานง่ายแค่นี้เอง',
			items: [
				{ title: 'สร้างโปรเจกต์', body: 'ทริป ห้องแชร์ หรือปาร์ตี้ สร้างโปรเจกต์แล้วชวนเพื่อนเข้ามา ไม่ต้องสมัครสมาชิก' },
				{ title: 'บันทึกรายจ่าย', body: 'ใส่แค่ใครจ่ายกับจำนวนเงิน จะเลือกสกุลเงินหรือแนบใบเสร็จก็ทำได้ทันที' },
				{ title: 'เคลียร์ยอด', body: '"ใครต้องโอนให้ใคร" Evere คิดให้ โอนเสร็จติ๊กถูกก็จบ' },
			],
		},
		pricing: {
			eyebrow: 'แพลน',
			title: 'เริ่มฟรี อัปเกรดเป็น Pro เมื่อต้องการมากกว่า',
			note: 'ดูราคาได้ในแอป',
			planFree: 'Free',
			planPro: 'Pro',
			featureCol: 'ฟีเจอร์',
			groups: [
				{
					label: 'พื้นฐาน',
					rows: [
						{ name: 'จำนวนโปรเจกต์', free: 'สูงสุด 3', pro: 'ไม่จำกัด' },
						{ name: 'แนบรูปภาพ', free: '5/โปรเจกต์', pro: 'ไม่จำกัด' },
						{ name: 'หลายสกุลเงิน (อัตราอัตโนมัติ)', free: true, pro: true },
						{ name: 'เชิญสมาชิก', free: true, pro: true },
						{ name: 'ซิงก์เรียลไทม์', free: true, pro: true },
					],
				},
				{
					label: 'เฉพาะ Pro',
					rows: [
						{ name: 'อัตราแลกเปลี่ยนด้วยตนเอง', free: false, pro: true },
						{ name: 'ตั้งงบและแจ้งเตือนตามเกณฑ์', free: false, pro: true },
						{ name: 'โหมดออฟไลน์', free: false, pro: true },
						{ name: 'ไม่มีโฆษณา', free: false, pro: true },
					],
				},
			],
		},
		reviews: {
			eyebrow: 'รีวิว',
			title: 'เสียงจากผู้ใช้',
			score: '5.0',
			ratingNote: 'คะแนนจากผู้ใช้บน App Store',
			translatedNote: '* รีวิวที่เขียนเป็นภาษาอื่นแสดงเป็นฉบับแปล',
			more: 'อ่านรีวิวเพิ่มเติม',
			items: [
				{
					title: 'นี่แหละที่ตามหา',
					body: 'ปกติใช้แอปหารบิลตัวอื่นอยู่ แต่เพื่อนแนะนำเลยลองโหลด รองรับหลายสกุลเงิน ตั้งสัดส่วนการหารได้ ตรงจุดแบบที่แอปอื่นทำไม่ได้ ชอบมาก',
					author: 'Kei1110',
				},
				{
					title: 'แอปหารบิลที่ใส่ใจรายละเอียด',
					body: 'แอปหารบิลแบบใช้ครั้งเดียวมีอยู่บ้าง แต่แอปที่ให้กลุ่มเพื่อนสนิทจัดการทุกอย่างรวมถึงประวัติการเคลียร์ยอดย้อนหลังในที่เดียวแทบไม่มี แอปนี้ยังมีจุดที่ต้องขัดเกลาอยู่บ้าง แต่ตั้งค่าได้ละเอียดและกำหนดผู้จ่ายได้ ใช้งานง่ายมาก',
					author: 'Mu\"',
				},
				{
					title: 'แอปเยี่ยมมาก!',
					body: 'ผมเดินทางไปต่างประเทศบ่อยเพราะงาน แอปนี้ทำให้การหารค่าใช้จ่ายระหว่างทริปง่ายขึ้นมาก เวลาเจอเพื่อนต่างประเทศ การแปลงสกุลเงินเคยเป็นเรื่องยุ่งยาก แต่แอปนี้ทำให้ทุกอย่างง่าย สะดวก ไร้ความเครียด โดยเฉพาะเวลากินข้าวเป็นกลุ่ม อยากเห็นแอปพัฒนาต่อไปเรื่อย ๆ และขอแนะนำให้ทุกคนที่เดินทางหรือหารค่าใช้จ่ายกับคนอื่นบ่อย ๆ',
					author: 'JonD87',
				},
				{
					title: 'เหมาะกับทริปต่างประเทศกับเพื่อน',
					body: 'เป็นแอปที่น่าแปลกใจว่าทำไมไม่มีมาก่อน รายการจ่ายถูกจัดระเบียบเป็นโปรเจกต์ ดูง่ายและใช้ง่ายมาก!',
					author: 'YUMA963',
				},
				{
					title: 'good for trip',
					body: 'ใช้งานง่ายทสะดวก เวลาไปทริป กับเพื่อน หารทุกอย่างลงตัวดี',
					author: 'eralf . lp',
				},
				{
					title: 'โครงสร้างพื้นฐานทางการเงินแห่งยุคใหม่',
					body: 'ค่าเงินอ่อน ของแพง ยุคหลายสกุลเงิน ยุคแบบนี้แหละที่แอปเคลียร์ยอด Evere มีค่า UI ก็ดูทันสมัยมาก นี่ไม่ใช่แค่แอปหารบิลธรรมดา แต่เป็นแอปที่เผชิญหน้ากับการหารบิลอย่างแท้จริง',
					author: 'コピライター',
				},
			],
		},
		faq: {
			eyebrow: 'FAQ',
			title: 'คำถามที่พบบ่อย',
			items: [
				{
					q: 'Evere ใช้ฟรีไหม?',
					a: 'ใช้ฟรี ทั้งบันทึก แชร์ และเคลียร์ยอด อัปเกรด Pro เฉพาะเมื่ออยากปลดล็อกขีดจำกัด เช่น จำนวนโปรเจกต์',
				},
				{
					q: 'ต้องสมัครสมาชิกไหม?',
					a: 'ไม่ต้อง โหมด guest เปิดแอปแล้วใช้ได้เลย ภายหลังค่อยผูกบัญชี Apple, Google หรืออีเมลเพื่อปลดล็อกทุกฟีเจอร์ ข้อมูลเดิมอยู่ครบ',
				},
				{ q: 'รองรับอุปกรณ์อะไรบ้าง?', a: 'iPhone ที่ใช้ iOS 15.1 ขึ้นไป ยังไม่มีเวอร์ชัน Android ในตอนนี้' },
				{
					q: 'รองรับกี่สกุลเงิน?',
					a: '162 สกุลเงิน พร้อมอัตราแลกเปลี่ยนอัตโนมัติ Pro ยังใส่อัตราเองได้ด้วย',
				},
				{
					q: 'เพื่อนต้องติดตั้งแอปด้วยไหม?',
					a: 'ต้องติดตั้งเฉพาะคนที่เข้าร่วมผ่านลิงก์เชิญ เพื่อนที่ไม่ใช้แอปก็เพิ่มแค่ชื่อได้ และยังแชร์รายการจ่ายกับผลการเคลียร์ยอดให้เขาได้ง่าย ๆ',
				},
			],
		},
		cta: {
			title: 'กับใครก็ได้\nที่ไหนก็ได้',
			sub: 'ฟรี ไม่ต้องสมัคร',
			button: 'ดาวน์โหลดบน App Store',
		},
		footer: {
			tagline: 'หารบิลข้ามสกุลเงินได้ง่าย ๆ',
			product: 'ผลิตภัณฑ์',
			resources: 'แหล่งข้อมูล',
			legal: 'กฎหมาย',
			guide: 'คู่มือการใช้งาน',
			support: 'ซัพพอร์ต',
			privacy: 'นโยบายความเป็นส่วนตัว',
			terms: 'ข้อกำหนดการใช้บริการ',
			language: 'ภาษา',
		},
		supportPage: {
			metaTitle: 'ซัพพอร์ต & ติดต่อเรา | Evere',
			metaDescription:
				'ศูนย์ช่วยเหลือของ Evere แอปหารบิล ส่งคำถาม รายงานปัญหา หรือข้อเสนอแนะผ่านแบบฟอร์มติดต่อได้เลย',
			title: 'ติดต่อเรา',
			intro: 'มีคำถาม เจอปัญหา หรืออยากเสนอฟีเจอร์ ส่งมาได้เลย เราอ่านทุกข้อความ',
			nameLabel: 'ชื่อ (ไม่บังคับ)',
			emailLabel: 'อีเมล',
			messageLabel: 'ข้อความ',
			submit: 'ส่งข้อความ',
			sending: 'กำลังส่ง…',
			success: 'ส่งข้อความเรียบร้อยแล้ว\nโดยปกติเราจะตอบกลับภายใน 1–2 วัน',
			error: 'ส่งไม่สำเร็จ กรุณาลองใหม่อีกครั้ง หรือส่งอีเมลถึงเราโดยตรง',
			invalid: 'กรุณากรอกอีเมลและข้อความ',
			mailNote: 'ติดต่อทางอีเมล: ',
		},
		mock: {
			project: 'ทริปญี่ปุ่น',
			expenses: [
				{ title: '🏨 โรงแรม', date: '12 มี.ค.', payer: 'Yuki', amount: '18,000 JPY', sub: '≈ 4,100 THB' },
				{ title: '🍽️ มื้อเย็น', date: '12 มี.ค.', payer: 'Ren', amount: '7,900 JPY', sub: '≈ 1,800 THB', settled: true },
				{ title: '🚕 แท็กซี่', date: '13 มี.ค.', payer: 'Aoi', amount: '1,200 JPY', sub: '≈ 270 THB', settled: true },
				{ title: '☕️ คาเฟ่', date: '13 มี.ค.', payer: 'Yuki', amount: '1,500 JPY', sub: '≈ 340 THB' },
				{ title: '🍢 อาหารริมทาง', date: '13 มี.ค.', payer: 'Aoi', amount: '1,900 JPY', sub: '≈ 430 THB' },
				{ title: '🛍️ ของฝาก', date: '14 มี.ค.', payer: 'Ren', amount: '5,400 JPY', sub: '≈ 1,230 THB' },
				{ title: '🍣 ซูชิ', date: '14 มี.ค.', payer: 'Yuki', amount: '2,300 JPY', sub: '≈ 520 THB' },
			],
			settled: 'ชำระแล้ว',
			toast: { title: 'เพิ่มรายจ่ายใหม่แล้ว', body: '🍽️ มื้อเย็น: JPY 7,900', time: 'ตอนนี้' },
			tabs: ['โปรเจกต์', 'ค่าใช้จ่าย', 'เพิ่ม', 'ชำระบัญชี', 'ตั้งค่า'],
			settle: {
				summary: 'สรุป',
				totalCount: 'จำนวนรายการจ่าย',
				totalAmount: 'ยอดรวม',
				countValue: '7 รายการ',
				totalValue: '38,200 JPY',
				totalSub: '≈ 8,650 THB',
				status: 'สถานะการชำระ',
				settledLabel: 'ชำระแล้ว',
				unsettledLabel: 'ยังไม่ชำระ',
				settledValue: '9,100 JPY',
				settledSub: '≈ 2,060 THB',
				unsettledValue: '29,100 JPY',
				unsettledSub: '≈ 6,590 THB',
				percent: 24,
				comparison: 'การเปรียบเทียบการจ่าย',
				paidLabel: 'จ่าย',
				owesLabel: 'ต้องจ่าย',
				byCategory: 'ตามหมวดหมู่',
				categories: [
					{ icon: '🏨', name: 'ที่พัก', amount: '18,000 JPY', sub: '≈ 4,100 THB', percent: 47 },
					{ icon: '🍽️', name: 'อาหาร', amount: '13,600 JPY', sub: '≈ 3,080 THB', percent: 36 },
					{ icon: '🛍️', name: 'ช้อปปิ้ง', amount: '5,400 JPY', sub: '≈ 1,230 THB', percent: 14 },
				],
				members: [
					{ name: 'Yuki', paid: 21800, owes: 12733 },
					{ name: 'Ren', paid: 13300, owes: 12733 },
					{ name: 'Aoi', paid: 3100, owes: 12733 },
				],
			},
		},
	},

	/* ---------------------------------- 한국어 ---------------------------------- */
	ko: {
		meta: {
			title: '더치페이·엔빵 정산 앱 Evere | 무료·가입 불필요',
			description:
				'더치페이·정산 앱 Evere. 누가 얼마 냈는지만 기록하면 "누가 누구에게 얼마"를 자동 계산. 여행 더치페이도 일상 정산도 이 앱 하나로. 162개 통화 지원, 가입 불필요, iOS 무료.',
		},
		nav: { features: '기능', pricing: '플랜', faq: 'FAQ', support: '지원', download: '다운로드' },
		hero: {
			title: ['더치페이를,', '더 아름답게.'],
			sub: '누가 얼마 냈는지만 기록하세요. 계산은 Evere가 알아서 하고, 그룹과 실시간으로 공유됩니다.',
			cta: 'App Store에서 다운로드',
			ctaNote: '무료 · 가입 없이 시작',
		},
		story: {
			scenes: [
				{ kicker: '기록', title: '냈으면 그 자리에서 기록.' },
				{ kicker: '동기화', title: '모두의 폰에 바로.' },
				{ kicker: '정산', title: '기록만 하면, 정산 상황이 한눈에.' },
			],
		},
		featuresHeading: { eyebrow: '기능', title: '더치페이에 필요한 건 다 있습니다.' },
		features: [
			{
				label: '멀티 통화',
				title: '162개 통화, 자동 환율 변환.',
				body: '바트로 내고 원화로 정산해도 OK. 환율은 자동으로 받아와 기준 통화로 바꿔줍니다. Pro에서는 직접 환율을 정할 수도 있어요.',
			},
			{
				label: '유연한 분할',
				title: '나누는 방식도, 마음대로.',
				body: '둘이 사는 생활비는 6:4, 모임은 똑같이, "오늘은 내가 좀 더"도. 전부 그 자리에서 탭 한 번이면 됩니다.',
			},
			{
				label: '그룹 공유',
				title: '링크 하나면 다 모입니다.',
				body: '초대는 링크 하나로 끝. 기록한 지출은 모두의 폰에 바로 뜹니다. 앱이 없는 친구는 이름만 넣어도 돼요.',
			},
			{
				label: '정산',
				title: '"누가 누구에게 얼마"를 한 번에.',
				body: '정산은 최소한의 횟수로. 아무리 꼬인 돈 관계도 누가 누구에게 주면 되는지 자동으로 계산합니다. 정산 상황도 언제든 확인할 수 있어요.',
			},
		],
		splitModes: ['균등', '비율', '금액 지정'],
		fxDemo: { rows: [{ sym: '฿', code: 'THB', val: '฿4,200' }, { sym: '$', code: 'USD', val: '$120.00' }, { sym: '€', code: 'EUR', val: '€86.40' }], base: { code: 'KRW', prefix: '₩', amount: 460000 } },
		more: {
			title: '작은 것까지 챙겼습니다.',
			items: [
				{ icon: 'guest', title: '게스트 모드', body: '계정 등록 없이 바로 사용 가능' },
				{ icon: 'receipt', title: '이미지 첨부', body: '영수증이나 가게 사진을 지출에 첨부' },
				{ icon: 'category', title: '카테고리 관리', body: '카테고리를 설정해 지출 정리' },
				{ icon: 'report', title: '공유 기능', body: '앱이 없는 멤버에게도 간편하게 지출 공유' },
				{ icon: 'budget', title: '예산 알림', body: '예산 초과 전에 미리 알림 (Pro)' },
				{ icon: 'offline', title: '오프라인 모드', body: '인터넷이 없어도 사용 가능 (Pro)' },
			],
		},
		steps: {
			eyebrow: '사용 방법',
			title: '사용법은 이게 전부입니다.',
			items: [
				{ title: '프로젝트 만들기', body: '여행, 자취방, 회식. 상황별로 프로젝트를 만들고 멤버를 부르면 끝. 가입은 필요 없어요.' },
				{ title: '지출 기록', body: '낸 사람과 금액만 입력하면 끝. 통화 선택도 영수증 첨부도 그 자리에서 바로.' },
				{ title: '정산하기', body: '"누가 누구에게 얼마"는 Evere가 계산. 보내고 체크하면 끝.' },
			],
		},
		pricing: {
			eyebrow: '플랜',
			title: '먼저 무료로. 부족해지면 Pro.',
			note: '가격은 앱에서 확인하세요.',
			planFree: 'Free',
			planPro: 'Pro',
			featureCol: '기능',
			groups: [
				{
					label: '기본 기능',
					rows: [
						{ name: '프로젝트 수', free: '최대 3개', pro: '무제한' },
						{ name: '이미지 첨부', free: '5장/PJ', pro: '무제한' },
						{ name: '멀티 통화(자동 환율)', free: true, pro: true },
						{ name: '멤버 초대', free: true, pro: true },
						{ name: '실시간 동기화', free: true, pro: true },
					],
				},
				{
					label: 'Pro 전용',
					rows: [
						{ name: '수동 환율 입력', free: false, pro: true },
						{ name: '예산 설정·도달 알림', free: false, pro: true },
						{ name: '오프라인 모드', free: false, pro: true },
						{ name: '광고 제거', free: false, pro: true },
					],
				},
			],
		},
		reviews: {
			eyebrow: '리뷰',
			title: '사용자들의 이야기',
			score: '5.0',
			ratingNote: 'App Store 사용자 평점',
			translatedNote: '※ 다른 언어로 작성된 리뷰는 번역해 게재했습니다.',
			more: '리뷰 더 보기',
			items: [
				{
					title: '이런 걸 원했어요',
					body: '평소에 다른 정산 앱을 쓰고 있었는데 친구 추천으로 설치했습니다. 멀티 통화 지원, 분담 비율 설정 등 솔직히 이렇게 가려운 곳을 긁어주는 앱은 없어서 애용하고 있습니다.',
					author: 'Kei1110',
				},
				{
					title: '가려운 곳을 긁어주는 정산 앱',
					body: '단발성으로 쓰는 정산 도구는 있었지만, 친한 그룹이 과거 정산 이력까지 한곳에서 관리할 수 있는 앱은 좀처럼 없었습니다. 아직 다듬어질 부분도 있지만, 세세한 설정과 지출 할당이 가능해서 정말 쓰기 좋습니다.',
					author: 'Mu\"',
				},
				{
					title: '훌륭한 앱!',
					body: '일 때문에 해외에 자주 가는데, 이 앱 덕분에 여행 중 비용 정산이 정말 쉬워졌습니다. 여러 나라의 친구들을 만나면 환율 계산이 늘 골칫거리였는데, 이 앱은 간단하고 편리하고 스트레스가 없어요. 특히 여럿이 식사할 때 최고입니다. 앞으로의 발전도 기대되고, 여행이나 비용을 나눌 일이 많은 분들께 강력 추천합니다.',
					author: 'JonD87',
				},
				{
					title: '친구와 해외여행에 편리',
					body: '의외로 지금까지 없던 앱이라고 생각합니다. 프로젝트별로 지출 상태가 보기 좋게 정리되어 정말 쓰기 편해요!',
					author: 'YUMA963',
				},
				{
					title: '여행에 딱',
					body: '쉽고 편리해요. 친구들과 여행할 때 뭐든 깔끔하게 나눠집니다.',
					author: 'eralf . lp',
				},
				{
					title: '새 시대의 통화 인프라',
					body: '엔저, 물가 상승, 다통화 시대. 이런 시대이기에 정산 앱 Evere의 가치가 있습니다. UI도 상당히 요즘 느낌. 이 앱은 단순한 더치페이 앱이 아닙니다. 더치페이와 마주하는 앱입니다.',
					author: 'コピライター',
				},
			],
		},
		faq: {
			eyebrow: 'FAQ',
			title: '자주 묻는 질문',
			items: [
				{
					q: 'Evere는 무료인가요?',
					a: '네. 기록·공유·정산까지 평소 쓰는 기능은 모두 무료입니다. 프로젝트 수 같은 제한을 없애고 싶을 때만 Pro를 쓰세요.',
				},
				{
					q: '회원가입이 필요한가요?',
					a: '아니요. 게스트 모드로 설치하자마자 쓸 수 있습니다. 나중에 Apple·Google·이메일로 가입하면 모든 기능이 열리고 데이터도 그대로예요.',
				},
				{ q: '지원 기기는?', a: 'iOS 15.1 이상의 iPhone을 지원합니다. Android 버전은 아직 제공하지 않습니다.' },
				{
					q: '몇 개의 통화를 지원하나요?',
					a: '162개 통화를 지원하며 환율은 자동으로 가져옵니다. Pro에서는 수동 입력도 가능합니다.',
				},
				{
					q: '같이 쓰는 사람도 앱을 설치해야 하나요?',
					a: '초대 링크로 참여하는 멤버만 설치하면 됩니다. 앱을 쓰지 않는 사람은 이름만으로 추가할 수 있고, 각 지출과 정산 결과도 간편하게 공유할 수 있습니다.',
				},
			],
		},
		cta: {
			title: '누구와도\n어디서나',
			sub: '무료, 가입 불필요.',
			button: 'App Store에서 다운로드',
		},
		footer: {
			tagline: '여러 통화로도 더치페이를 간단하게.',
			product: '제품',
			resources: '리소스',
			legal: '법적 고지',
			guide: '사용 가이드',
			support: '지원',
			privacy: '개인정보 처리방침',
			terms: '이용약관',
			language: '언어',
		},
		supportPage: {
			metaTitle: '지원 및 문의 | Evere',
			metaDescription:
				'더치페이 앱 Evere 지원 창구. 질문, 버그 신고, 기능 요청을 문의 양식으로 보내주세요.',
			title: '문의하기',
			intro: '질문, 버그 신고, 기능 요청 등 무엇이든 편하게 보내주세요. 모든 메시지를 읽고 있습니다.',
			nameLabel: '이름 (선택)',
			emailLabel: '이메일',
			messageLabel: '문의 내용',
			submit: '보내기',
			sending: '전송 중…',
			success: '문의를 보냈습니다.\n보통 1–2일 이내에 답변드립니다.',
			error: '전송에 실패했습니다. 잠시 후 다시 시도하시거나 이메일로 직접 연락해 주세요.',
			invalid: '이메일 주소와 문의 내용을 입력해 주세요.',
			mailNote: '이메일로 연락하기: ',
		},
		mock: {
			project: '태국 여행',
			expenses: [
				{ title: '🏨 호텔', date: '3월 12일', payer: 'Yuki', amount: '4,200 THB', sub: '≈ 168,000 KRW' },
				{ title: '🍽️ 저녁 식사', date: '3월 12일', payer: 'Ren', amount: '1,860 THB', sub: '≈ 74,400 KRW', settled: true },
				{ title: '🚕 택시', date: '3월 13일', payer: 'Aoi', amount: '240 THB', sub: '≈ 9,600 KRW', settled: true },
				{ title: '☕️ 카페', date: '3월 13일', payer: 'Yuki', amount: '320 THB', sub: '≈ 12,800 KRW' },
				{ title: '🍢 길거리 음식', date: '3월 13일', payer: 'Aoi', amount: '450 THB', sub: '≈ 18,000 KRW' },
				{ title: '🛍️ 기념품', date: '3월 14일', payer: 'Ren', amount: '980 THB', sub: '≈ 39,200 KRW' },
				{ title: '💆 마사지', date: '3월 14일', payer: 'Yuki', amount: '700 THB', sub: '≈ 28,000 KRW' },
			],
			settled: '정산 완료',
			toast: { title: '새로운 지출이 추가되었습니다', body: '🍽️ 저녁 식사: THB 1,860', time: '지금' },
			tabs: ['프로젝트', '지출', '추가', '정산', '설정'],
			settle: {
				summary: '요약',
				totalCount: '총 지출 수',
				totalAmount: '총액',
				countValue: '7개',
				totalValue: '8,750 THB',
				totalSub: '≈ 350,000 KRW',
				status: '정산 상태',
				settledLabel: '정산 완료',
				unsettledLabel: '미정산',
				settledValue: '2,100 THB',
				settledSub: '≈ 84,000 KRW',
				unsettledValue: '6,650 THB',
				unsettledSub: '≈ 266,000 KRW',
				percent: 24,
				comparison: '지출 비교',
				paidLabel: '지불',
				owesLabel: '부담',
				byCategory: '카테고리별',
				categories: [
					{ icon: '🏨', name: '숙박', amount: '4,200 THB', sub: '≈ 168,000 KRW', percent: 48 },
					{ icon: '🍽️', name: '식비', amount: '2,630 THB', sub: '≈ 105,000 KRW', percent: 30 },
					{ icon: '🛍️', name: '쇼핑', amount: '980 THB', sub: '≈ 39,200 KRW', percent: 11 },
				],
				members: [
					{ name: 'Yuki', paid: 5220, owes: 2917 },
					{ name: 'Ren', paid: 2840, owes: 2917 },
					{ name: 'Aoi', paid: 690, owes: 2917 },
				],
			},
		},
	},

	/* ---------------------------------- 简体中文 ---------------------------------- */
	'zh-hans': {
		meta: {
			title: 'AA制分账App Evere｜多人记账、自动结算，免注册免费使用',
			description:
				'AA制分账·结算应用 Evere。只需记下谁付了多少，自动算清"谁该给谁多少"。旅行分账、合租记账都能用。支持 162 种货币，免注册，iOS 免费下载。',
		},
		nav: { features: '功能', pricing: '方案', faq: '常见问题', support: '支持', download: '下载' },
		hero: {
			title: ['分账，', '也可以很优雅。'],
			sub: '只需记下谁付了多少，剩下的交给 Evere，全组实时同步。',
			cta: '在 App Store 下载',
			ctaNote: '免费 · 无需注册',
		},
		story: {
			scenes: [
				{ kicker: '记录', title: '付了钱，当场记一笔。' },
				{ kicker: '同步', title: '立刻出现在每个人的手机上。' },
				{ kicker: '结算', title: '只要记账，结算进度一目了然。' },
			],
		},
		featuresHeading: { eyebrow: '功能', title: 'AA 制需要的，这里都有。' },
		features: [
			{
				label: '多币种',
				title: '162 种货币，自动汇率换算。',
				body: '用泰铢付款、按人民币结算也没问题。汇率自动获取并换算成你的常用货币，Pro 版还能自定义汇率。',
			},
			{
				label: '灵活分摊',
				title: '怎么分，都随你。',
				body: '同居生活费 6:4、聚餐平均分、"这顿我多出点"，全都当场轻点一下就好。',
			},
			{
				label: '群组共享',
				title: '一条链接，全员到齐。',
				body: '邀请只需发个链接，每笔支出即刻同步到所有人的手机。没装应用的朋友，填个名字就能加进来。',
			},
			{
				label: '结算',
				title: '"谁该给谁多少钱"，立刻知道。',
				body: '用最少的结算次数搞定。再乱的账，也能自动算清谁该给谁多少，结算状态随时可查。',
			},
		],
		splitModes: ['平均分摊', '按比例', '按金额'],
		fxDemo: { rows: [{ sym: '฿', code: 'THB', val: '฿4,200' }, { sym: '$', code: 'USD', val: '$120.00' }, { sym: '€', code: 'EUR', val: '€86.40' }], base: { code: 'CNY', prefix: '¥', amount: 2430 } },
		more: {
			title: '细节，也都想到了。',
			items: [
				{ icon: 'guest', title: '访客模式', body: '无需注册账号，立即可用' },
				{ icon: 'receipt', title: '图片附件', body: '把收据或店铺照片附在支出里' },
				{ icon: 'category', title: '分类管理', body: '设置分类整理支出' },
				{ icon: 'report', title: '共享功能', body: '没装应用的成员也能轻松共享支出' },
				{ icon: 'budget', title: '预算提醒', body: '超支之前，提前提醒（Pro）' },
				{ icon: 'offline', title: '离线模式', body: '没有网络也能使用（Pro）' },
			],
		},
		steps: {
			eyebrow: '使用方法',
			title: '用法就这么简单。',
			items: [
				{ title: '创建项目', body: '旅行、合租、聚餐，按场景建项目、拉人进来就行。不用注册。' },
				{ title: '记录支出', body: '填上谁付的、付了多少就行。选货币、附收据，顺手的事。' },
				{ title: '结算', body: '"谁该给谁多少"由 Evere 计算。转完账打个勾，收工。' },
			],
		},
		pricing: {
			eyebrow: '方案',
			title: '先免费用，需要更多再升级 Pro。',
			note: '价格请在应用内查看。',
			planFree: 'Free',
			planPro: 'Pro',
			featureCol: '功能',
			groups: [
				{
					label: '基本功能',
					rows: [
						{ name: '项目数量', free: '最多3个', pro: '无限制' },
						{ name: '图片附件', free: '5张/项目', pro: '无限制' },
						{ name: '多币种（自动汇率）', free: true, pro: true },
						{ name: '邀请成员', free: true, pro: true },
						{ name: '实时同步', free: true, pro: true },
					],
				},
				{
					label: 'Pro 专属',
					rows: [
						{ name: '手动汇率', free: false, pro: true },
						{ name: '预算与进度提醒', free: false, pro: true },
						{ name: '离线模式', free: false, pro: true },
						{ name: '免广告', free: false, pro: true },
					],
				},
			],
		},
		reviews: {
			eyebrow: '评价',
			title: '用户怎么说',
			score: '5.0',
			ratingNote: 'App Store 用户评分',
			translatedNote: '* 以其他语言撰写的评价为翻译版本。',
			more: '查看更多评价',
			items: [
				{
					title: '就是想要这样的',
					body: '平时一直用别的分账应用，朋友推荐后装了这个。多币种支持、自定义分摊比例……说实话没有哪个应用能把细节做到这么贴心，已经成了我的最爱。',
					author: 'Kei1110',
				},
				{
					title: '把细节做到位的分账应用',
					body: '市面上有不少一次性的分账工具，但能让固定的朋友圈子连同过去的结算记录一起管理的应用几乎没有。这个应用虽然还有些粗糙的地方，但可以做精细的设置和支付分配，非常好用。',
					author: 'Mu\"',
				},
				{
					title: '很棒的应用！',
					body: '我经常因工作出国，这个应用让旅行中的分账变得非常轻松。以前和不同国家的朋友聚会，换算货币总是很麻烦，现在一切都简单、方便、无压力，尤其是多人聚餐的时候。很期待它继续进化，强烈推荐给经常旅行或需要和别人分摊费用的人。',
					author: 'JonD87',
				},
				{
					title: '和朋友出国旅行很好用',
					body: '感觉是那种意外地一直没人做的应用。支付状态按项目整理得清清楚楚，特别好用！',
					author: 'YUMA963',
				},
				{
					title: '旅行必备',
					body: '简单又方便。和朋友旅行时，什么都能分得清清楚楚。',
					author: 'eralf . lp',
				},
				{
					title: '令和时代的货币基础设施',
					body: '日元贬值、物价上涨、多货币时代。正因为是这样的时代，分账结算应用 Evere 才有价值。UI 也相当有当下感。这不只是一个分账应用，而是一个直面分账的应用。',
					author: 'コピライター',
				},
			],
		},
		faq: {
			eyebrow: '常见问题',
			title: '常见问题',
			items: [
				{
					q: 'Evere 是免费的吗？',
					a: '免费。记录、共享、结算这些日常功能全部免费，想解除项目数量等限制时再升级 Pro。',
				},
				{
					q: '需要注册账号吗？',
					a: '不需要。访客模式打开就能用，之后绑定 Apple、Google 或邮箱即可解锁全部功能，数据不会丢。',
				},
				{ q: '支持哪些设备？', a: '支持 iOS 15.1 及以上版本的 iPhone。暂无 Android 版。' },
				{
					q: '支持多少种货币？',
					a: '支持 162 种货币，汇率自动获取。Pro 版还可手动输入汇率。',
				},
				{
					q: '一起用的人也需要安装应用吗？',
					a: '只有通过邀请链接加入的成员需要安装。不用应用的朋友，填个名字就能加进来，每笔支出和结算结果也能轻松分享给对方。',
				},
			],
		},
		cta: {
			title: '无论与谁\n无论去哪',
			sub: '免费、免注册。',
			button: '在 App Store 下载',
		},
		footer: {
			tagline: '跨币种分账，轻松搞定。',
			product: '产品',
			resources: '资源',
			legal: '法务',
			guide: '使用指南',
			support: '支持',
			privacy: '隐私政策',
			terms: '服务条款',
			language: '语言',
		},
		supportPage: {
			metaTitle: '支持与联系 | Evere',
			metaDescription:
				'AA制分账应用 Evere 的支持中心。有问题、故障反馈或功能建议，请通过联系表单发送给我们。',
			title: '联系我们',
			intro: '有任何问题、故障反馈或功能建议，欢迎随时发送。每条消息我们都会认真阅读。',
			nameLabel: '姓名（选填）',
			emailLabel: '邮箱',
			messageLabel: '内容',
			submit: '发送',
			sending: '发送中…',
			success: '咨询已发送。\n我们通常会在 1–2 天内回复。',
			error: '发送失败。请稍后重试，或直接给我们发邮件。',
			invalid: '请填写邮箱和内容。',
			mailNote: '也可以直接发邮件至：',
		},
		mock: {
			project: '泰国之旅',
			expenses: [
				{ title: '🏨 酒店', date: '3月12日', payer: 'Yuki', amount: '4,200 THB', sub: '≈ 890 CNY' },
				{ title: '🍽️ 晚餐', date: '3月12日', payer: 'Ren', amount: '1,860 THB', sub: '≈ 395 CNY', settled: true },
				{ title: '🚕 出租车', date: '3月13日', payer: 'Aoi', amount: '240 THB', sub: '≈ 51 CNY', settled: true },
				{ title: '☕️ 咖啡', date: '3月13日', payer: 'Yuki', amount: '320 THB', sub: '≈ 68 CNY' },
				{ title: '🍢 街边小吃', date: '3月13日', payer: 'Aoi', amount: '450 THB', sub: '≈ 96 CNY' },
				{ title: '🛍️ 纪念品', date: '3月14日', payer: 'Ren', amount: '980 THB', sub: '≈ 209 CNY' },
				{ title: '💆 按摩', date: '3月14日', payer: 'Yuki', amount: '700 THB', sub: '≈ 149 CNY' },
			],
			settled: '已结算',
			toast: { title: '新增了一笔支出', body: '🍽️ 晚餐: THB 1,860', time: '现在' },
			tabs: ['项目', '支出', '添加', '结算', '设置'],
			settle: {
				summary: '摘要',
				totalCount: '总支出数',
				totalAmount: '总额',
				countValue: '7 个',
				totalValue: '8,750 THB',
				totalSub: '≈ 1,860 CNY',
				status: '精算状况',
				settledLabel: '已结算',
				unsettledLabel: '未结算',
				settledValue: '2,100 THB',
				settledSub: '≈ 446 CNY',
				unsettledValue: '6,650 THB',
				unsettledSub: '≈ 1,413 CNY',
				percent: 24,
				comparison: '支出对比',
				paidLabel: '支付额',
				owesLabel: '负担额',
				byCategory: '按类别',
				categories: [
					{ icon: '🏨', name: '住宿', amount: '4,200 THB', sub: '≈ 890 CNY', percent: 48 },
					{ icon: '🍽️', name: '餐饮', amount: '2,630 THB', sub: '≈ 559 CNY', percent: 30 },
					{ icon: '🛍️', name: '购物', amount: '980 THB', sub: '≈ 208 CNY', percent: 11 },
				],
				members: [
					{ name: 'Yuki', paid: 5220, owes: 2917 },
					{ name: 'Ren', paid: 2840, owes: 2917 },
					{ name: 'Aoi', paid: 690, owes: 2917 },
				],
			},
		},
	},

	/* ---------------------------------- 繁體中文 ---------------------------------- */
	'zh-hant': {
		meta: {
			title: '分帳 App Evere｜旅遊、聚餐自動分帳，免註冊免費使用',
			description:
				'分帳·結算 App Evere。只要記下誰付了多少，自動算清「誰該給誰多少」。旅行分帳、合租記帳都好用。支援 162 種貨幣，免註冊，iOS 免費下載。',
		},
		nav: { features: '功能', pricing: '方案', faq: '常見問題', support: '支援', download: '下載' },
		hero: {
			title: ['分帳，', '也可以很優雅。'],
			sub: '只要記下誰付了多少，剩下的交給 Evere，全團即時同步。',
			cta: '在 App Store 下載',
			ctaNote: '免費 · 免註冊',
		},
		story: {
			scenes: [
				{ kicker: '記錄', title: '付了錢，當場記一筆。' },
				{ kicker: '同步', title: '立刻出現在每個人的手機上。' },
				{ kicker: '結算', title: '只要記帳，結算進度一目了然。' },
			],
		},
		featuresHeading: { eyebrow: '功能', title: '分帳需要的，這裡都有。' },
		features: [
			{
				label: '多幣別',
				title: '162 種貨幣，自動匯率換算。',
				body: '用泰銖付款、以台幣結算也沒問題。匯率自動取得並換算成你的常用貨幣，Pro 版還能自訂匯率。',
			},
			{
				label: '彈性分攤',
				title: '怎麼分，都隨你。',
				body: '同居生活費 6:4、聚餐平均分、「這攤我多出一點」，全部當場點一下就好。',
			},
			{
				label: '群組共享',
				title: '一條連結，全員到齊。',
				body: '邀請只要傳個連結，每筆支出立刻同步到所有人的手機。沒裝 App 的朋友，填個名字就能加進來。',
			},
			{
				label: '結算',
				title: '「誰該給誰多少錢」，立刻知道。',
				body: '用最少的結算次數搞定。再亂的帳，也能自動算清誰該給誰多少，結算狀態隨時可查。',
			},
		],
		splitModes: ['平均分攤', '按比例', '按金額'],
		fxDemo: { rows: [{ sym: '฿', code: 'THB', val: '฿4,200' }, { sym: '$', code: 'USD', val: '$120.00' }, { sym: '€', code: 'EUR', val: '€86.40' }], base: { code: 'TWD', prefix: 'NT$', amount: 11000 } },
		more: {
			title: '細節，也都想到了。',
			items: [
				{ icon: 'guest', title: '訪客模式', body: '不需註冊帳號，立即可用' },
				{ icon: 'receipt', title: '圖片附件', body: '把收據或店家照片附在支出裡' },
				{ icon: 'category', title: '分類管理', body: '設定分類整理支出' },
				{ icon: 'report', title: '共享功能', body: '沒裝 App 的成員也能輕鬆共享支出' },
				{ icon: 'budget', title: '預算提醒', body: '超支之前，先提醒你（Pro）' },
				{ icon: 'offline', title: '離線模式', body: '沒有網路也能使用（Pro）' },
			],
		},
		steps: {
			eyebrow: '使用方法',
			title: '用法就這麼簡單。',
			items: [
				{ title: '建立專案', body: '旅行、合租、聚餐，按情境建專案、拉人進來就行。不用註冊。' },
				{ title: '記錄支出', body: '填上誰付的、付了多少就行。選貨幣、附收據，順手的事。' },
				{ title: '結算', body: '「誰該給誰多少」由 Evere 計算。轉完帳打個勾，收工。' },
			],
		},
		pricing: {
			eyebrow: '方案',
			title: '先免費用，需要更多再升級 Pro。',
			note: '價格請在 App 內查看。',
			planFree: 'Free',
			planPro: 'Pro',
			featureCol: '功能',
			groups: [
				{
					label: '基本功能',
					rows: [
						{ name: '專案數量', free: '最多3個', pro: '無限制' },
						{ name: '圖片附件', free: '5張/專案', pro: '無限制' },
						{ name: '多幣別（自動匯率）', free: true, pro: true },
						{ name: '邀請成員', free: true, pro: true },
						{ name: '即時同步', free: true, pro: true },
					],
				},
				{
					label: 'Pro 專屬',
					rows: [
						{ name: '手動匯率', free: false, pro: true },
						{ name: '預算與進度提醒', free: false, pro: true },
						{ name: '離線模式', free: false, pro: true },
						{ name: '免廣告', free: false, pro: true },
					],
				},
			],
		},
		reviews: {
			eyebrow: '評價',
			title: '用戶怎麼說',
			score: '5.0',
			ratingNote: 'App Store 用戶評分',
			translatedNote: '* 以其他語言撰寫的評價為翻譯版本。',
			more: '查看更多評價',
			items: [
				{
					title: '就是想要這樣的',
					body: '平常一直用別的分帳 App，朋友推薦後裝了這個。多幣別支援、自訂分攤比例……說實話沒有哪個 App 能把細節做得這麼貼心，已經成了我的最愛。',
					author: 'Kei1110',
				},
				{
					title: '把細節做到位的分帳 App',
					body: '市面上有不少一次性的分帳工具，但能讓固定的朋友圈子連同過去的結算紀錄一起管理的 App 幾乎沒有。這個 App 雖然還有些粗糙的地方，但可以做精細的設定和付款分配，非常好用。',
					author: 'Mu\"',
				},
				{
					title: '很棒的 App！',
					body: '我經常因工作出國，這個 App 讓旅行中的分帳變得非常輕鬆。以前和不同國家的朋友聚會，換算貨幣總是很麻煩，現在一切都簡單、方便、無壓力，尤其是多人聚餐的時候。很期待它繼續進化，強烈推薦給經常旅行或需要和別人分攤費用的人。',
					author: 'JonD87',
				},
				{
					title: '和朋友出國旅行很好用',
					body: '是那種意外地一直沒有人做的 App。付款狀態依專案整理得清清楚楚，非常好用！',
					author: 'YUMA963',
				},
				{
					title: '旅行必備',
					body: '簡單又方便。和朋友旅行時，什麼都能分得清清楚楚。',
					author: 'eralf . lp',
				},
				{
					title: '令和時代的貨幣基礎設施',
					body: '日圓貶值、物價上漲、多貨幣時代。正因為是這樣的時代，分帳結算 App Evere 才有價值。UI 也相當有當下感。這不只是一個分帳 App，而是一個直面分帳的 App。',
					author: 'コピライター',
				},
			],
		},
		faq: {
			eyebrow: '常見問題',
			title: '常見問題',
			items: [
				{
					q: 'Evere 是免費的嗎？',
					a: '免費。記錄、共享、結算這些日常功能全部免費，想解除專案數量等限制時再升級 Pro。',
				},
				{
					q: '需要註冊帳號嗎？',
					a: '不需要。訪客模式打開就能用，之後綁定 Apple、Google 或電子郵件即可解鎖全部功能，資料不會消失。',
				},
				{ q: '支援哪些裝置？', a: '支援 iOS 15.1 以上版本的 iPhone。目前沒有 Android 版。' },
				{
					q: '支援多少種貨幣？',
					a: '支援 162 種貨幣，匯率自動取得。Pro 版還可手動輸入匯率。',
				},
				{
					q: '一起用的人也需要安裝 App 嗎？',
					a: '只有透過邀請連結加入的成員需要安裝。沒有用 App 的朋友，填個名字就能加進來，每筆支出和結算結果也能輕鬆分享給對方。',
				},
			],
		},
		cta: {
			title: '無論與誰\n無論去哪',
			sub: '免費、免註冊。',
			button: '在 App Store 下載',
		},
		footer: {
			tagline: '跨幣別分帳，輕鬆搞定。',
			product: '產品',
			resources: '資源',
			legal: '法務',
			guide: '使用指南',
			support: '支援',
			privacy: '隱私權政策',
			terms: '服務條款',
			language: '語言',
		},
		supportPage: {
			metaTitle: '支援與聯絡 | Evere',
			metaDescription:
				'分帳 App Evere 的支援中心。有問題、錯誤回報或功能建議，歡迎透過聯絡表單傳送給我們。',
			title: '聯絡我們',
			intro: '有任何問題、錯誤回報或功能建議，歡迎隨時傳送。每則訊息我們都會認真閱讀。',
			nameLabel: '姓名（選填）',
			emailLabel: '電子郵件',
			messageLabel: '內容',
			submit: '送出',
			sending: '傳送中…',
			success: '諮詢已送出。\n我們通常會在 1–2 天內回覆。',
			error: '傳送失敗。請稍後再試，或直接寄信給我們。',
			invalid: '請填寫電子郵件和內容。',
			mailNote: '也可以直接寄信至：',
		},
		mock: {
			project: '泰國之旅',
			expenses: [
				{ title: '🏨 飯店', date: '3月12日', payer: 'Yuki', amount: '4,200 THB', sub: '≈ 4,000 TWD' },
				{ title: '🍽️ 晚餐', date: '3月12日', payer: 'Ren', amount: '1,860 THB', sub: '≈ 1,770 TWD', settled: true },
				{ title: '🚕 計程車', date: '3月13日', payer: 'Aoi', amount: '240 THB', sub: '≈ 230 TWD', settled: true },
				{ title: '☕️ 咖啡', date: '3月13日', payer: 'Yuki', amount: '320 THB', sub: '≈ 300 TWD' },
				{ title: '🍢 路邊攤', date: '3月13日', payer: 'Aoi', amount: '450 THB', sub: '≈ 430 TWD' },
				{ title: '🛍️ 紀念品', date: '3月14日', payer: 'Ren', amount: '980 THB', sub: '≈ 930 TWD' },
				{ title: '💆 按摩', date: '3月14日', payer: 'Yuki', amount: '700 THB', sub: '≈ 660 TWD' },
			],
			settled: '已結算',
			toast: { title: '新增了一筆支出', body: '🍽️ 晚餐: THB 1,860', time: '現在' },
			tabs: ['專案', '支出', '新增', '結算', '設置'],
			settle: {
				summary: '摘要',
				totalCount: '總支出數',
				totalAmount: '總額',
				countValue: '7 個',
				totalValue: '8,750 THB',
				totalSub: '≈ 8,310 TWD',
				status: '精算狀況',
				settledLabel: '已結算',
				unsettledLabel: '未結算',
				settledValue: '2,100 THB',
				settledSub: '≈ 1,995 TWD',
				unsettledValue: '6,650 THB',
				unsettledSub: '≈ 6,320 TWD',
				percent: 24,
				comparison: '支出比較',
				paidLabel: '支付額',
				owesLabel: '負擔額',
				byCategory: '按類別',
				categories: [
					{ icon: '🏨', name: '住宿', amount: '4,200 THB', sub: '≈ 4,000 TWD', percent: 48 },
					{ icon: '🍽️', name: '餐飲', amount: '2,630 THB', sub: '≈ 2,500 TWD', percent: 30 },
					{ icon: '🛍️', name: '購物', amount: '980 THB', sub: '≈ 930 TWD', percent: 11 },
				],
				members: [
					{ name: 'Yuki', paid: 5220, owes: 2917 },
					{ name: 'Ren', paid: 2840, owes: 2917 },
					{ name: 'Aoi', paid: 690, owes: 2917 },
				],
			},
		},
	},
};
