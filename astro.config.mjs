// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Markdownの<table>を<div class="lp-table-wrap">で包む。
// 表を幅100%のまま保ちつつ、はみ出すときだけラッパー側で横スクロールさせるため
// （tableにdisplay:blockを当てると幅いっぱいに広がらなくなる）
function rehypeTableWrap() {
	/** @param {any} node */
	const walk = (node) => {
		if (!node.children) return;
		node.children = node.children.map((/** @type {any} */ child) => {
			if (child.type === 'element' && child.tagName === 'table') {
				return {
					type: 'element',
					tagName: 'div',
					properties: { className: ['lp-table-wrap'] },
					children: [child],
				};
			}
			walk(child);
			return child;
		});
	};
	return (/** @type {any} */ tree) => walk(tree);
}

// https://astro.build/config
export default defineConfig({
	site: 'https://evereapp.com',
	markdown: {
		rehypePlugins: [rehypeTableWrap],
	},
	integrations: [
		starlight({
			title: 'Evere',
			description: 'Split bills easily across currencies.',
			logo: {
				light: './src/assets/evere-logo-light.png',
				dark: './src/assets/evere-logo-dark.png',
				alt: 'Evere',
			},
			favicon: '/favicon.png',
			customCss: ['./src/styles/custom.css'],
			components: {
				// docsページにも言語別OGP画像を出す（src/components/StarlightHead.astro）
				Head: './src/components/StarlightHead.astro',
			},
			defaultLocale: 'en',
			head: [
				// テーマはStarlightの既定（auto=OS追従）に任せる。
				// 以前あった「未設定時にdarkを保存する」スクリプトは、LP側の
				// 「保存はトグル操作時のみ・未設定はOS追従」方針と矛盾するため撤去
				{
					// iOSホーム画面追加用アイコン
					tag: 'link',
					attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
				},
				{
					tag: 'script',
					attrs: {},
					content: `
						// Save user's language preference when they visit a language-specific page
						(function() {
							const path = window.location.pathname;
							const langMatch = path.match(/^\\/([a-z]{2}(-[a-z]+)?)\\//);
							if (langMatch) {
								const lang = langMatch[1];
								const supportedLangs = ['ja', 'en', 'th', 'ko', 'zh-hans', 'zh-hant'];
								if (supportedLangs.includes(lang)) {
									try {
										localStorage.setItem('evere_preferred_lang', lang);
									} catch (e) {
										// Silently fail if localStorage is not available
									}
								}
							}
						})();
					`
				}
			],
			locales: {
				en: {
					label: 'English',
					lang: 'en',
				},
				ja: {
					label: '日本語',
					lang: 'ja',
				},
				th: {
					label: 'ไทย',
					lang: 'th',
				},
				ko: {
					label: '한국어',
					lang: 'ko',
				},
				'zh-hans': {
					label: '简体中文',
					lang: 'zh-CN',
				},
				'zh-hant': {
					label: '繁體中文',
					lang: 'zh-TW',
				},
			},
		}),
	],
});
