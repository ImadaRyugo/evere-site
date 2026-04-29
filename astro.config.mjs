// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Evere',
			description: 'Split bills easily across currencies.',
			defaultLocale: 'en',
			head: [
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
				},
				{
					tag: 'script',
					attrs: {},
					content: `
						(function(d,t) {
							var BASE_URL="https://app.chatwoot.com";
							var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
							g.src=BASE_URL+"/packs/js/sdk.js";
							g.defer = true;
							g.async = true;
							s.parentNode.insertBefore(g,s);
							g.onload=function(){
								window.chatwootSDK.run({
									websiteToken: '3Aukaeb7xphwVBX2EBQYbenj',
									baseUrl: BASE_URL
								})
							}
						})(document,"script");
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
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/ImadaRyugo/evenly-mobile'
				}
			],
		}),
	],
});
