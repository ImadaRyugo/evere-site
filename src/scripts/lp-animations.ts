import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
// iOS Chrome等はツールバー収納で表示領域ごとリサイズされ resize が発火する。
// そのたびに全トリガーを再計算するとスクロール中にピンがガタつくため、
// モバイルのブラウザUI起因のリサイズでは refresh しない（幅変更時は通常どおり実行）
ScrollTrigger.config({ ignoreMobileResize: true });

let initialized = false;
// 起動演出の完了後に再生するヒーロー導入タイムライン（initStoryが構築）
let heroIntro: gsap.core.Timeline | null = null;

export function initLp(): void {
	if (initialized) return;
	initialized = true;

	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	initNav();

	if (reduceMotion) {
		document.documentElement.classList.remove('lp-launching');
		document.querySelector('[data-launch]')?.remove();
		initSplitDemo(true);
		showEverything();
		return;
	}

	initLenis();
	initStory();
	initLaunch();
	initSplitDemo(false);
	initParticles();
	initBigWords();
	initReveals();
	initCounters();
	initRolls();
	initSettleChecks();
	initReviewsScore();
	initCtaIcon();
	initMagnetic();

	// ピンスペーサー追加後の最終レイアウトで全トリガー位置を確定させる
	// （load後にscriptが実行された場合、これがないとピンより先に作った
	//   トリガーの位置が古いまま残る）
	requestAnimationFrame(() => ScrollTrigger.refresh());
	window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* ============================================================
   起動演出 — アプリアイコンをタップしてEvereが起動する体験を再現
   1. アイコンのみ表示（ページは全面オーバーレイで隠す）
   2. タップの押下ハイライト → アイコンが拡大しながらフォンへ展開
   3. 実アプリのスプラッシュ（白 + ネイビーロゴ）→ 支出画面
   4. フォンが本来の位置へ滑り込み、他要素が出現
   ============================================================ */

function initLaunch(): void {
	const html = document.documentElement;
	const overlay = document.querySelector<HTMLElement>('[data-launch]');

	const finish = () => {
		html.classList.remove('lp-launching');
		overlay?.remove();
		// 演出をスキップする場合、フォンの登場tweenは存在しない（launching時は
		// heroIntroに含めない）ため、CSSの初期非表示をここで明示的に解除する
		gsap.set('[data-phone]', { opacity: 1 });
		heroIntro?.play();
		ScrollTrigger.refresh();
	};

	if (!html.classList.contains('lp-launching')) {
		overlay?.remove();
		return;
	}

	const iconWrap = document.querySelector<HTMLElement>('[data-launch-icon]');
	const iconImg = iconWrap?.querySelector<HTMLElement>('img') ?? null;
	const label = iconWrap?.querySelector<HTMLElement>('span') ?? null;
	const phone = document.querySelector<HTMLElement>('[data-phone]');
	const wrap = document.querySelector<HTMLElement>('[data-phone-launch]');
	const scaler = document.querySelector<HTMLElement>('[data-phone-scale]');
	const splash = document.querySelector<HTMLElement>('[data-phone-splash]');
	const hint = document.querySelector<HTMLElement>('[data-story-hint]');

	// 要素が欠けている・スクロール位置が先頭でない（リロード復元等）場合はスキップ
	if (!overlay || !iconImg || !phone || !wrap || window.scrollY > 40) {
		finish();
		return;
	}

	const run = () => {
		// ブラウザのスクロール位置復元は load 後に起こることがあるため再チェック
		if (window.scrollY > 40) {
			finish();
			return;
		}
		const rect = phone.getBoundingClientRect();
		const iconRect = iconImg.getBoundingClientRect();
		if (rect.width === 0 || iconRect.width === 0) {
			finish();
			return;
		}
		// ズーム先は「画面中央」ではなく実際に表示されているアイコンの中心に合わせる。
		// iOS Safari/Chrome ではツールバーの表示状態で window.innerHeight が揺れ、
		// 画面中央の計算とfixed要素（アイコン）の見た目の中央がズレるため、
		// アイコンの実測座標を唯一の基準にする（実機の「アイコンからアプリが開く」挙動とも一致）
		//
		// 注意: SPでは親の [data-phone-scale] に fitPhone() の縮小scaleが掛かる。
		// wrap への x/y はそのローカル座標系で解釈され画面上では scale 倍に縮むため、
		// 画面上の距離を親scaleで割って指定する（画面高さが低い実機で顕在化するズレの原因）
		const parentScale =
			scaler && scaler.offsetWidth > 0
				? scaler.getBoundingClientRect().width / scaler.offsetWidth
				: 1;
		const dx = (iconRect.left + iconRect.width / 2 - (rect.left + rect.width / 2)) / parentScale;
		const dy = (iconRect.top + iconRect.height / 2 - (rect.top + rect.height / 2)) / parentScale;
		// startScale は画面上のサイズ比なので親scaleの影響を受けない（rect が実測値のため）
		const startScale = (iconRect.width * 1.02) / rect.width;

		gsap.set(wrap, { x: dx, y: dy, scale: startScale, autoAlpha: 0, transformOrigin: '50% 50%' });
		// フォン本体はCSSの初期非表示（html.lp-js [data-phone]）を明示的に解除
		// （通常はイントロのtweenが行うが、起動演出時はスキップされるため）
		gsap.set(phone, { opacity: 1 });
		if (splash) gsap.set(splash, { opacity: 1 });
		// スクロールヒントはストーリーのscrubタイムラインがインラインstyleを書き込み
		// CSSの visibility:hidden が効かないため、GSAP側で隠して演出完了時に出す
		if (hint) gsap.set(hint, { autoAlpha: 0 });

		gsap
			.timeline()
			// タップ: iOSの押下ハイライト（少し暗くなる）。実機同様、離した直後に展開が始まる
			.to(iconImg, { filter: 'brightness(0.72)', duration: 0.11, ease: 'power1.out' }, 0.55)
			.to(iconImg, { filter: 'brightness(1)', duration: 0.15 }, 0.66)
			// アプリ展開: ラベルが消え、アイコンが拡大しながらフォンにクロスフェード
			.to(label, { autoAlpha: 0, duration: 0.15 }, 0.62)
			.to(
				iconImg,
				{
					scale: (rect.width / iconRect.width) * 0.92,
					autoAlpha: 0,
					duration: 0.45,
					ease: 'power3.in',
					transformOrigin: '50% 50%',
				},
				0.66,
			)
			.to(wrap, { autoAlpha: 1, duration: 0.22, ease: 'power1.out' }, 0.74)
			.to(wrap, { scale: 1, duration: 0.5, ease: 'power3.out' }, 0.76)
			// スプラッシュを見せてから支出画面へ
			.to(splash, { opacity: 0, duration: 0.35, ease: 'power1.inOut' }, 1.95)
			// フォンが本来のレイアウト位置へ滑り込み、ページ全体が現れる
			.to(wrap, { x: 0, y: 0, duration: 0.95, ease: 'power3.inOut' }, 2.3)
			.to(overlay, { autoAlpha: 0, duration: 0.6, ease: 'power1.out' }, 2.38)
			.add(() => heroIntro?.play(), 2.55)
			.to(hint, { autoAlpha: 1, duration: 0.6, ease: 'power1.out' }, 2.55)
			.add(() => {
				html.classList.remove('lp-launching');
				overlay.remove();
				ScrollTrigger.refresh();
			}, 2.8);
	};

	if (document.readyState === 'complete') {
		requestAnimationFrame(run);
	} else {
		window.addEventListener('load', () => requestAnimationFrame(run), { once: true });
	}
}

/* ---------- nav glass ---------- */

function initNav(): void {
	const nav = document.querySelector('[data-nav]');
	if (!nav) return;
	const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();
}

/* ---------- reduced motion: static page ---------- */

function showEverything(): void {
	gsap.set('[data-reveal], [data-phone], [data-price-row], .lpm-card', {
		opacity: 1,
		clearProps: 'transform,filter',
	});
	document.querySelectorAll<HTMLElement>('[data-count]:not([data-roll])').forEach((el) => {
		const target = parseInt(el.dataset.count ?? '0', 10);
		el.textContent = (el.dataset.prefix ?? '') + target.toLocaleString('en-US');
	});
}

/* ---------- Lenis smooth scroll ---------- */

function initLenis(): void {
	const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
	gsap.ticker.add((time) => lenis.raf(time * 1000));
	gsap.ticker.lagSmoothing(0);
	lenis.on('scroll', ScrollTrigger.update);

	document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
		a.addEventListener('click', (e) => {
			const id = a.getAttribute('href');
			const target = id && id.length > 1 ? document.querySelector(id) : null;
			if (target) {
				e.preventDefault();
				// 着地位置はCSSの scroll-margin-top が単一の情報源。
				// Lenis は要素指定の scrollTo で scroll-margin を自前で考慮するため、
				// ここで offset を足すと二重適用になる
				lenis.scrollTo(target as HTMLElement, { duration: 1.4 });
			}
		});
	});
}

/* ============================================================
   Story — 1台のフォンの中で物語が進むピン留めスクラブ
   S0 ヒーロー → S1 記録 → S2 共有 → S3 精算
   ============================================================ */

function initStory(): void {
	const pin = document.querySelector<HTMLElement>('[data-story-pin]');
	const phone = document.querySelector<HTMLElement>('[data-phone]');
	if (!pin || !phone) return;

	const scenes = gsap.utils.toArray<HTMLElement>('.lp-scene');
	const dots = gsap.utils.toArray<HTMLElement>('[data-story-progress] i');
	const hint = document.querySelector<HTMLElement>('[data-story-hint]');
	const cards = gsap.utils.toArray<HTMLElement>('[data-phone-view="expenses"] .lpx-card');
	const viewExpenses = document.querySelector<HTMLElement>('[data-phone-view="expenses"]');
	const viewSettle = document.querySelector<HTMLElement>('[data-phone-view="settlement"]');
	const toast = document.querySelector<HTMLElement>('[data-phone-toast]');
	const tabs = gsap.utils.toArray<HTMLElement>('[data-phone-tab]');

	/* --- 導入（ロード時のヒーロー出現） ---
	   起動演出（initLaunch）実行時はフォンの登場をそちらに任せ、
	   テキストの出現は演出完了後に再生する */
	const launching = document.documentElement.classList.contains('lp-launching');
	const heroReveals = gsap.utils.toArray<HTMLElement>('.lp-scene--hero [data-reveal]');
	const intro = gsap.timeline({ paused: launching, defaults: { ease: 'power3.out' } });
	intro.fromTo(
		heroReveals,
		{ y: 28, opacity: 0, filter: 'blur(8px)' },
		{ y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, stagger: 0.12 },
		launching ? 0 : 0.15,
	);
	if (!launching) {
		intro.fromTo(
			phone,
			{ y: 70, opacity: 0, scale: 0.94 },
			{ y: 0, opacity: 1, scale: 1, duration: 1.2 },
			0.4,
		);
	}
	heroIntro = intro;

	// フォンの浮遊ループ
	gsap.to(phone, {
		y: -8,
		duration: 3.2,
		ease: 'sine.inOut',
		yoyo: true,
		repeat: -1,
		delay: launching ? 5.2 : 1.8,
	});

	// マウス追従チルト（デスクトップのみ）
	const visual = document.querySelector<HTMLElement>('[data-hero-visual]');
	if (visual && window.matchMedia('(pointer: fine) and (min-width: 901px)').matches) {
		gsap.set(phone, { transformPerspective: 900 });
		const rotX = gsap.quickTo(phone, 'rotationX', { duration: 0.6, ease: 'power2.out' });
		const rotY = gsap.quickTo(phone, 'rotationY', { duration: 0.6, ease: 'power2.out' });
		visual.addEventListener('mousemove', (e) => {
			const rect = visual.getBoundingClientRect();
			rotY(((e.clientX - rect.left) / rect.width - 0.5) * 10);
			rotX(((e.clientY - rect.top) / rect.height - 0.5) * -8);
		});
		visual.addEventListener('mouseleave', () => {
			rotX(0);
			rotY(0);
		});
	}

	/* --- ストーリー初期状態 --- */
	scenes.forEach((sc, i) => gsap.set(sc, { autoAlpha: i === 0 ? 1 : 0 }));
	gsap.set(cards.slice(2), { opacity: 0, y: 26 }); // カード3〜5はS1で積まれる

	// 精算画面の内部をゼロ状態に（S3で伸ばす）
	const progressFill = viewSettle?.querySelector<HTMLElement>('.lps-progress i') ?? null;
	const progressLabel = viewSettle?.querySelector<HTMLElement>('.lps-progress-row b') ?? null;
	const targetPercent = progressLabel ? parseInt(progressLabel.textContent || '0', 10) : 0;
	const chartBars = viewSettle
		? gsap.utils.toArray<HTMLElement>('.lpc-bars i', viewSettle)
		: [];
	const chartTips = viewSettle ? gsap.utils.toArray<HTMLElement>('.lpc-tip', viewSettle) : [];
	// カテゴリ別のバー（目標幅はインラインstyleから取得してからゼロに）
	const catBars = viewSettle
		? gsap.utils.toArray<HTMLElement>('.lpg-bar .track i', viewSettle)
		: [];
	const catTargets = catBars.map((b) => b.style.width);
	const catLabels = viewSettle
		? gsap.utils.toArray<HTMLElement>('.lpg-bar b', viewSettle)
		: [];
	const catPercents = catLabels.map((l) => parseInt(l.textContent || '0', 10));
	catBars.forEach((b) => gsap.set(b, { width: 0 }));
	catLabels.forEach((l) => (l.textContent = '0%'));
	if (progressFill) gsap.set(progressFill, { width: 0 });
	if (progressLabel) progressLabel.textContent = '0%';

	// サマリーカードの数値（7件 / 8,750 THB / ≈ 36,700 JPY）もゼロから数える。
	// 「7件」「8,750 THB」等から数値部分だけを取り出し、前後の文字はそのまま残す
	const summaryCounters = (
		viewSettle
			? gsap.utils.toArray<HTMLElement>(
					'.lps-card:first-child .lps-row .val, .lps-card:first-child .big, .lps-card:first-child .col .sub',
					viewSettle,
				)
			: []
	).flatMap((el) => {
		const original = el.textContent ?? '';
		const m = original.match(/\d[\d,]*/);
		if (!m || m.index === undefined) return [];
		const target = parseInt(m[0].replace(/,/g, ''), 10);
		const comma = m[0].includes(',');
		const format = (v: number) =>
			original.slice(0, m.index) +
			(comma ? v.toLocaleString('en-US') : String(v)) +
			original.slice(m.index! + m[0].length);
		el.textContent = format(0);
		return [{ el, target, format }];
	});
	chartBars.forEach((b) => gsap.set(b, { scaleY: 0, transformOrigin: 'bottom center' }));
	if (chartTips.length) gsap.set(chartTips, { opacity: 0, y: 6 });

	const isMobile = window.matchMedia('(max-width: 900px)').matches;

	// SP: フォン全体を実測して 100svh に収まるようスケーリング
	const scaler = document.querySelector<HTMLElement>('[data-phone-scale]');
	const copyBox = document.querySelector<HTMLElement>('.lp-story-copy');
	const fitPhone = () => {
		if (!scaler) return;
		if (!window.matchMedia('(max-width: 900px)').matches) {
			scaler.style.transform = '';
			return;
		}
		const avail =
			pin.clientHeight - 88 - (copyBox?.offsetHeight ?? 0) - 24;
		const natural = phone.offsetHeight;
		const scale = Math.min(1, avail / natural);
		scaler.style.transform = scale < 1 ? `scale(${scale.toFixed(3)})` : '';
	};
	fitPhone();
	// 幅が変わったとき（回転・ウィンドウリサイズ）だけ再計算する。
	// iOS Chrome はスクロールでツールバーが収納されると表示領域自体が高くなり
	// resize が発火するため、高さだけの変化で再計算するとスクロール中に
	// 縮小が解除されてフォンが巨大化してしまう（Safariはバーを被せるだけで発火しない）
	let fitWidth = window.innerWidth;
	window.addEventListener('resize', () => {
		if (window.innerWidth === fitWidth) return;
		fitWidth = window.innerWidth;
		fitPhone();
	});

	/* --- マスタータイムライン（スクラブ） --- */
	const tl = gsap.timeline({
		defaults: { ease: 'power2.out' },
		scrollTrigger: {
			trigger: pin,
			start: 'top top',
			// SPはスワイプでスクロール速度が速く、シーンが一瞬で切り替わってしまうため
			// 必要なスクロール量を1.5倍にして各アニメーションを見せる時間を確保する
			end: isMobile ? '+=500%' : '+=340%',
			pin: true,
			scrub: 0.6,
			anticipatePin: 1,
			invalidateOnRefresh: true,
			onUpdate: (self) => {
				// シーン進行ドット
				const idx = Math.min(3, Math.floor(self.progress * 4.2));
				dots.forEach((d, i) => d.classList.toggle('active', i === idx));
			},
		},
	});

	const swapScene = (from: number, to: number, at: number) => {
		tl.to(scenes[from], { autoAlpha: 0, y: -30, duration: 0.5, ease: 'power2.in' }, at);
		tl.fromTo(
			scenes[to],
			{ autoAlpha: 0, y: 34 },
			{ autoAlpha: 1, y: 0, duration: 0.6 },
			at + 0.3,
		);
	};

	// スクロールヒントは開始直後に消す。
	// scrubタイムラインに入れると refresh のたびに開始値（表示状態）が
	// インラインstyleで書き戻され、起動演出中の非表示が壊れるため独立トリガーにする
	if (hint) {
		ScrollTrigger.create({
			start: 10,
			end: 'max',
			onEnter: () => gsap.to(hint, { autoAlpha: 0, duration: 0.3 }),
			onLeaveBack: () => gsap.to(hint, { autoAlpha: 1, duration: 0.3 }),
		});
	}

	// S0 → S1: 記録（カードが積まれる）
	swapScene(0, 1, 0.9);
	if (isMobile) {
		// SPではヒーロー時にフォンが下に覗いており、S1で全体が上がってくる。
		// 短い距離で一気に動くと速く見えるため、早めに始めて長い距離をゆっくり追従させる
		gsap.set(visual, { yPercent: 46 });
		tl.to(visual, { yPercent: 0, duration: 1.6, ease: 'power1.inOut' }, 0.5);
	}
	cards.slice(2).forEach((card, i) => {
		tl.to(card, { opacity: 1, y: 0, duration: 0.4 }, 1.55 + i * 0.32);
	});

	// S1 → S2: 共有（トースト通知が降りる）
	swapScene(1, 2, 3.5);
	if (toast) {
		// 通知はシーン共有の間しっかり見せる（在画面時間を長めに確保）
		tl.to(toast, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' }, 3.9);
		if (cards[1]) {
			tl.fromTo(
				cards[1],
				{ borderColor: 'rgba(255,255,255,0.08)' },
				{ borderColor: 'rgba(110,231,160,0.45)', duration: 0.35, yoyo: true, repeat: 1 },
				4.4,
			);
		}
		tl.to(toast, { y: '-160%', opacity: 0, duration: 0.4, ease: 'power2.in' }, 5.75);
	}

	// S2 → S3: 精算（画面切替 → グラフが伸びる）
	swapScene(2, 3, 5.9);
	if (viewExpenses && viewSettle) {
		tl.to(viewExpenses, { autoAlpha: 0, x: -16, duration: 0.4 }, 6.3);
		tl.fromTo(viewSettle, { autoAlpha: 0, x: 18 }, { autoAlpha: 1, x: 0, duration: 0.5 }, 6.55);
	}
	if (tabs[1] && tabs[3]) {
		tl.to(tabs[1], { opacity: 0.5, duration: 0.25 }, 6.4);
		tl.to(tabs[3], { opacity: 1, duration: 0.25 }, 6.55);
	}
	// サマリーの数値カウントアップ（精算状況の%と同じ増え方で、少しだけ先行して上から流す）
	summaryCounters.forEach(({ el, target, format }) => {
		const counter = { val: 0 };
		tl.to(
			counter,
			{
				val: target,
				duration: 1.1,
				ease: 'power2.inOut',
				onUpdate: () => {
					el.textContent = format(Math.round(counter.val));
				},
			},
			6.9,
		);
	});
	if (progressFill && progressLabel) {
		const counter = { val: 0 };
		tl.to(progressFill, { width: `${targetPercent}%`, duration: 1.1, ease: 'power2.inOut' }, 7.0);
		tl.to(
			counter,
			{
				val: targetPercent,
				duration: 1.1,
				ease: 'power2.inOut',
				onUpdate: () => {
					progressLabel.textContent = `${Math.round(counter.val)}%`;
				},
			},
			7.0,
		);
	}
	if (chartBars.length) {
		tl.to(chartBars, { scaleY: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out' }, 7.3);
	}
	if (chartTips.length) {
		tl.to(chartTips, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(2)', stagger: 0.12 }, 8.2);
	}
	catBars.forEach((bar, i) => {
		tl.to(bar, { width: catTargets[i], duration: 0.7, ease: 'power2.inOut' }, 7.5 + i * 0.15);
		const counter = { val: 0 };
		tl.to(
			counter,
			{
				val: catPercents[i],
				duration: 0.7,
				ease: 'power2.inOut',
				onUpdate: () => {
					catLabels[i].textContent = `${Math.round(counter.val)}%`;
				},
			},
			7.5 + i * 0.15,
		);
	});

	// 余韻
	tl.to({}, { duration: 1.2 }, 8.6);
}

/* ============================================================
   通貨パーティクル（軽量2Dキャンバス / ストーリー背景）
   ============================================================ */

function initParticles(): void {
	const canvas = document.querySelector<HTMLCanvasElement>('[data-story-canvas]');
	const pinEl = document.querySelector<HTMLElement>('[data-story-pin]');
	if (!canvas || !pinEl) return;
	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	const GLYPHS = ['¥', '$', '€', '฿', '₩', '£'];
	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	let width = 0;
	let height = 0;
	let running = false;
	let rafId = 0;

	interface P {
		x: number;
		y: number;
		vx: number;
		vy: number;
		size: number;
		alpha: number;
		glyph: string;
	}
	let particles: P[] = [];
	const pointer = { x: -9999, y: -9999 };

	const resize = () => {
		width = pinEl.clientWidth;
		height = pinEl.clientHeight;
		canvas.width = width * dpr;
		canvas.height = height * dpr;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		const count = width < 700 ? 20 : 34;
		particles = Array.from({ length: count }, () => ({
			x: Math.random() * width,
			y: Math.random() * height,
			vx: (Math.random() - 0.5) * 0.25,
			vy: (Math.random() - 0.5) * 0.25,
			size: 11 + Math.random() * 13,
			alpha: 0.05 + Math.random() * 0.1,
			glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
		}));
	};

	const frame = () => {
		if (!running) return;
		ctx.clearRect(0, 0, width, height);
		const light = document.documentElement.dataset.theme === 'light';
		const base = light ? '23, 24, 29' : '244, 244, 245';
		for (const p of particles) {
			// ポインタ反発
			const dx = p.x - pointer.x;
			const dy = p.y - pointer.y;
			const dist = Math.hypot(dx, dy);
			if (dist < 130 && dist > 0.01) {
				const force = ((130 - dist) / 130) * 0.5;
				p.vx += (dx / dist) * force;
				p.vy += (dy / dist) * force;
			}
			p.vx *= 0.985;
			p.vy *= 0.985;
			// 最低限の漂流
			p.vx += (Math.random() - 0.5) * 0.01;
			p.vy += (Math.random() - 0.5) * 0.01;
			p.x += p.vx;
			p.y += p.vy;
			if (p.x < -30) p.x = width + 30;
			if (p.x > width + 30) p.x = -30;
			if (p.y < -30) p.y = height + 30;
			if (p.y > height + 30) p.y = -30;
			ctx.font = `600 ${p.size}px sans-serif`;
			ctx.fillStyle = `rgba(${base}, ${p.alpha})`;
			ctx.fillText(p.glyph, p.x, p.y);
		}
		rafId = requestAnimationFrame(frame);
	};

	pinEl.addEventListener('pointermove', (e) => {
		const rect = pinEl.getBoundingClientRect();
		pointer.x = e.clientX - rect.left;
		pointer.y = e.clientY - rect.top;
	});
	pinEl.addEventListener('pointerleave', () => {
		pointer.x = -9999;
		pointer.y = -9999;
	});
	window.addEventListener('resize', resize);
	resize();

	// ストーリーが見えている間だけ描画
	ScrollTrigger.create({
		trigger: pinEl,
		start: 'top bottom',
		end: 'bottom top',
		onToggle: (self) => {
			running = self.isActive;
			if (running) {
				rafId = requestAnimationFrame(frame);
			} else {
				cancelAnimationFrame(rafId);
			}
		},
	});
}

/* ---------- 巨大アウトラインタイポの視差 ---------- */

function initBigWords(): void {
	document.querySelectorAll<HTMLElement>('[data-bigword]').forEach((el) => {
		const track = el.querySelector<HTMLElement>('.lp-bigword-track');
		if (!track) return;
		const dir = parseInt(el.dataset.direction ?? '1', 10);
		gsap.fromTo(
			track,
			{ xPercent: dir > 0 ? -22 : 0 },
			{
				xPercent: dir > 0 ? 0 : -22,
				ease: 'none',
				scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
			},
		);
	});
}

/* ---------- generic scroll reveals ---------- */

function initReveals(): void {
	const targets = gsap.utils
		.toArray<HTMLElement>('[data-reveal]')
		.filter((el) => !el.closest('.lp-story') && !el.classList.contains('lp-step'));

	targets.forEach((el) => {
		gsap.fromTo(
			el,
			{ y: 36, opacity: 0 },
			{
				y: 0,
				opacity: 1,
				duration: 0.9,
				ease: 'power3.out',
				scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' },
			},
		);
	});

	ScrollTrigger.batch('.lp-step', {
		start: 'top 88%',
		once: true,
		onEnter: (els) =>
			gsap.fromTo(
				els,
				{ opacity: 0, y: 32 },
				{ opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out' },
			),
	});

	ScrollTrigger.batch('.lpm-card', {
		start: 'top 90%',
		once: true,
		onEnter: (els) =>
			gsap.fromTo(
				els,
				{ opacity: 0, y: 26 },
				{ opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out' },
			),
	});

	ScrollTrigger.batch('[data-price-row]', {
		start: 'top 94%',
		once: true,
		onEnter: (els) =>
			gsap.fromTo(
				els,
				{ opacity: 0, y: 14 },
				{ opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: 'power2.out' },
			),
	});

	document.querySelectorAll('.lp-faq-q').forEach((btn) => {
		btn.addEventListener('click', () => setTimeout(() => ScrollTrigger.refresh(), 500));
	});
}

/* ---------- number counters ---------- */

function initCounters(): void {
	document.querySelectorAll<HTMLElement>('[data-count]:not([data-roll])').forEach((el) => {
		const target = parseInt(el.dataset.count ?? '0', 10);
		const prefix = el.dataset.prefix ?? '';
		const obj = { val: 0 };
		el.textContent = prefix + '0';
		gsap.to(obj, {
			val: target,
			duration: 1.6,
			ease: 'power2.out',
			onUpdate: () => {
				el.textContent = prefix + Math.round(obj.val).toLocaleString('en-US');
			},
			scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
		});
	});
}

/* ---------- スロット式ローリング数字 ---------- */

function initRolls(): void {
	document.querySelectorAll<HTMLElement>('[data-count][data-roll]').forEach((el) => {
		const target = parseInt(el.dataset.count ?? '0', 10);
		const prefix = el.dataset.prefix ?? '';
		const finalText = prefix + target.toLocaleString('en-US');

		// 桁ごとに0-9の縦スタックを構築
		el.classList.add('lp-roll');
		el.textContent = '';
		const cols: { el: HTMLElement; digit: number }[] = [];
		for (const ch of finalText) {
			const col = document.createElement('span');
			col.className = 'col';
			if (/[0-9]/.test(ch)) {
				for (let d = 0; d <= 9; d++) {
					const cell = document.createElement('b');
					cell.textContent = String(d);
					col.appendChild(cell);
				}
				cols.push({ el: col, digit: parseInt(ch, 10) });
			} else {
				col.textContent = ch;
			}
			el.appendChild(col);
		}

		ScrollTrigger.create({
			trigger: el,
			start: 'top 85%',
			once: true,
			onEnter: () => {
				cols.forEach((c, i) => {
					// セル高は実測（scrollHeight/10）。yPercentだとflexに
					// 潰された要素自身の高さ基準になり移動量が1/10になる
					const cell = c.el.scrollHeight / 10;
					gsap.fromTo(
						c.el,
						{ y: 0 },
						{
							y: -c.digit * cell,
							duration: 1.3 + i * 0.12,
							ease: 'power3.inOut',
							delay: i * 0.05,
						},
					);
				});
			},
		});
	});
}

/* ---------- split-mode demo (機能セクション) ---------- */

function initSplitDemo(reduceMotion: boolean): void {
	const demo = document.querySelector<HTMLElement>('[data-split-demo]');
	if (!demo) return;

	const tabs = Array.from(demo.querySelectorAll<HTMLElement>('[data-split-tab]'));
	const indicator = demo.querySelector<HTMLElement>('[data-split-indicator]');
	const bars = Array.from(demo.querySelectorAll<HTMLElement>('[data-split-bar]')).map((el) => ({
		el,
		scales: JSON.parse(el.dataset.scales ?? '[]') as number[],
	}));
	const amounts = Array.from(demo.querySelectorAll<HTMLElement>('[data-split-amt]')).map((el) => ({
		el,
		values: JSON.parse(el.dataset.amounts ?? '[]') as string[],
	}));

	bars.forEach((b) => {
		b.el.style.transform = `scaleX(${b.scales[0]})`;
	});

	if (reduceMotion) return;

	let mode = 0;
	const setMode = (next: number) => {
		mode = next;
		tabs.forEach((t, i) => t.classList.toggle('active', i === mode));
		if (indicator) gsap.to(indicator, { xPercent: 100 * mode, duration: 0.55, ease: 'power3.inOut' });
		bars.forEach((b) => {
			b.el.style.transform = `scaleX(${b.scales[mode]})`;
		});
		amounts.forEach((a) => {
			gsap
				.timeline()
				.to(a.el, { opacity: 0, y: -6, duration: 0.18, ease: 'power1.in' })
				.add(() => {
					a.el.textContent = a.values[mode];
				})
				.to(a.el, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
		});
	};

	let timer: number | undefined;
	let kickoff: number | undefined;
	ScrollTrigger.create({
		trigger: demo,
		start: 'top 85%',
		end: 'bottom top',
		onToggle: (self) => {
			if (self.isActive) {
				// setInterval の初回発火(2.4秒後)を待つと止まって見えるので、まず0.7秒で1回切り替える
				if (kickoff === undefined && timer === undefined) {
					kickoff = window.setTimeout(() => {
						kickoff = undefined;
						setMode((mode + 1) % 3);
						timer = window.setInterval(() => setMode((mode + 1) % 3), 2400);
					}, 700);
				}
			} else {
				window.clearTimeout(kickoff);
				window.clearInterval(timer);
				kickoff = undefined;
				timer = undefined;
			}
		},
	});
}

/* ---------- settle check draw-in (機能セクション) ---------- */

/* ---------- レビューの評価ブロック（星の連続塗り + 月桂樹の出現） ---------- */

function initReviewsScore(): void {
	const score = document.querySelector<HTMLElement>('.lp-reviews-score');
	if (!score) return;

	const stars = gsap.utils.toArray<SVGSVGElement>('.col .stars svg', score);
	const leaves = gsap.utils.toArray<SVGPathElement>('.laurel path[transform]', score);
	const stems = gsap.utils.toArray<SVGPathElement>('.laurel path[fill="none"]', score);

	// 初期状態
	gsap.set(stars, { scale: 0.3, opacity: 0, transformOrigin: '50% 50%' });
	gsap.set(leaves, { scale: 0, opacity: 0, transformOrigin: '50% 50%' });
	stems.forEach((stem) => {
		const len = stem.getTotalLength();
		stem.style.strokeDasharray = String(len);
		stem.style.strokeDashoffset = String(len);
	});

	const tl = gsap.timeline({
		scrollTrigger: { trigger: score, start: 'top 78%', once: true },
	});

	// 茎が下から上へ描画
	tl.to(stems, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.out' }, 0);
	// 葉が下から順にポップ（左右同時）
	const half = leaves.length / 2;
	tl.to(leaves.slice(0, half), { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)', stagger: 0.035 }, 0.05);
	tl.to(leaves.slice(half), { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)', stagger: 0.035 }, 0.05);
	// 星が1つずつ高速で塗られていく
	tl.to(
		stars,
		{ scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2.6)', stagger: 0.09 },
		0.2,
	);
}

function initSettleChecks(): void {
	document.querySelectorAll<SVGSVGElement>('.lpf-settle-row .check').forEach((svg, i) => {
		const shapes = Array.from(
			svg.querySelectorAll<SVGGeometryElement>('[data-check-circle], [data-check-mark]'),
		);
		shapes.forEach((shape) => {
			const len = shape.getTotalLength();
			shape.style.strokeDasharray = String(len);
			shape.style.strokeDashoffset = String(len);
		});
		gsap.to(shapes, {
			strokeDashoffset: 0,
			duration: 0.9,
			ease: 'power2.out',
			stagger: 0.18,
			delay: i * 0.3,
			scrollTrigger: {
				trigger: svg.closest('.lpf-card'),
				start: 'top 80%',
				toggleActions: 'play none none none',
			},
		});
	});
}

/* ---------- CTA背面アイコン: フッター裏から半回転しながら定位置へ ---------- */

function initCtaIcon(): void {
	const icon = document.querySelector<HTMLElement>('.lp-cta-bg-icon');
	const section = document.querySelector<HTMLElement>('.lp-cta');
	if (!icon || !section) return;

	// CSSフォールバックの rotate を無効化し、回転はGSAPが一元管理する
	icon.style.rotate = '0deg';

	gsap.fromTo(
		icon,
		{ y: 900, rotation: -102 },
		{
			y: 0,
			rotation: -12,
			ease: 'none',
			scrollTrigger: {
				trigger: section,
				// セクションが見え始める少し前から動き出す
				start: 'top bottom+=250',
				end: 'bottom bottom',
				scrub: 0.6,
			},
		},
	);
}

/* ---------- 磁石ボタン（デスクトップ） ---------- */

function initMagnetic(): void {
	if (!window.matchMedia('(pointer: fine) and (min-width: 901px)').matches) return;

	document.querySelectorAll<HTMLElement>('.lp-btn').forEach((btn) => {
		// CSSのtransform transitionとGSAPの競合を避ける
		btn.style.transition = 'box-shadow 0.35s var(--lp-ease), background 0.35s var(--lp-ease)';
		const toX = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
		const toY = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });

		btn.addEventListener('mousemove', (e) => {
			const rect = btn.getBoundingClientRect();
			toX((e.clientX - rect.left - rect.width / 2) * 0.28);
			toY((e.clientY - rect.top - rect.height / 2) * 0.32);
		});
		btn.addEventListener('mouseleave', () => {
			toX(0);
			toY(0);
		});
	});
}
