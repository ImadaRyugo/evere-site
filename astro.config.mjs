// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://evereapp.com',
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
