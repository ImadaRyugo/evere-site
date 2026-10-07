// 割り勘計算ツールの画面制御（/ja/tools/warikan/）。計算そのものは warikan.ts。
//
// 方針:
// - 入力中の欄は作り直さない（フォーカスとカーソルを奪わないため）。
//   メンバー・支払いの「行の増減」があったときだけリストを組み直し、
//   それ以外は結果エリアと、名前を表示している箇所だけを書き換える
// - 未入力のあいだは例の値（プレースホルダー）で計算して薄く表示する。
//   何を入れればどうなるかが、触る前から分かるようにするため
// - 入力はどこにも送らない。共有リンクは location.hash に入れるだけ（サーバーに届かない）
import { splitTotal, diffFromExact, computeBalances, settle, type Payment, type RoundingMode, type Transfer } from './warikan';

type Mode = 'split' | 'settle';

interface PaymentRow {
	payer: number;
	amount: number; // 0 = 未入力
	memo: string;
	targets: boolean[];
}

interface State {
	mode: Mode;
	total: number; // 0 = 未入力
	count: number;
	unit: number;
	rounding: RoundingMode;
	weighted: boolean;
	weights: number[];
	members: string[];
	payments: PaymentRow[];
}

const MIN_PEOPLE = 2;
const MAX_PEOPLE = 30;
// warikan.ts の EXACT_LIMIT と合わせる（12人までなら送金回数の最小解を必ず出せる）
const MAX_MEMBERS = 12;
const EXAMPLE_TOTAL = 12000;
const EXAMPLE_PAYMENTS = [
	{ memo: 'ホテル', amount: 30000 },
	{ memo: 'ディナー', amount: 9000 },
];
const PAGE_URL = 'https://evereapp.com/ja/tools/warikan/';

const defaults = (): State => ({
	mode: 'split',
	total: 0,
	count: 3,
	// 既定は端数を残さない正確な割り勘。現金でそろえたい人だけが単位を上げる
	unit: 1,
	// 1円単位で「多めに集める」だと 10,000円÷3人 が 3,334・3,334・3,332 と1人目だけ2円少なくなる。
	// 「少なめに集める」なら 3,333・3,333・3,334 と自然に割れるので、こちらを既定にする
	rounding: 'organizer-more',
	weighted: false,
	weights: [1, 1, 1],
	members: ['Aさん', 'Bさん', 'Cさん'],
	payments: EXAMPLE_PAYMENTS.map((_, k) => ({ payer: k, amount: 0, memo: '', targets: [true, true, true] })),
});

let state: State = defaults();
// 「済」にした送金（from-to-amount）。計算結果が変わったら自然に外れる
const doneTransfers = new Set<string>();

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const yen = (n: number) => n.toLocaleString('ja-JP');
const esc = (s: string) =>
	s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const digitsOnly = (s: string) => {
	const v = parseInt(s.replace(/[^\d]/g, '').slice(0, 10), 10);
	return Number.isFinite(v) ? v : 0;
};
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
	Array.from(root.querySelectorAll<T>(sel));

const memberName = (i: number) => state.members[i]?.trim() || `${i + 1}人目`;
// 人数で割るときは何人目かの数字で示す（1人目が割り切れない差額を調整する）
const splitAvatar = (i: number) => `<span class="evr-avatar evr-avatar--${i % 4}">${i + 1}</span>`;
const initial = (name: string) => Array.from(name.trim() || '?')[0].toUpperCase();
const personLabel = (i: number) => `${i + 1}人目`;
/** 0始まりの番号の並びを「1人目」「2〜3人目」「2・4〜5人目」のように書く */
const peopleLabel = (indices: number[]) => {
	const nums = [...indices].sort((a, b) => a - b).map((i) => i + 1);
	const runs: string[] = [];
	for (let k = 0; k < nums.length; ) {
		let end = k;
		while (end + 1 < nums.length && nums[end + 1] === nums[end] + 1) end++;
		runs.push(end > k ? `${nums[k]}〜${nums[end]}` : String(nums[k]));
		k = end + 1;
	}
	return `${runs.join('・')}人目`;
};
const signedYen = (n: number) => (n > 0 ? `+${yen(n)}円` : n < 0 ? `−${yen(-n)}円` : '±0円');

/* ============================================================
   数字のロール表示（オドメーター）
   各桁を 0〜9 の縦帯にし、translateY で目的の数字まで回す
   ============================================================ */
function setOdometer(el: HTMLElement, value: string) {
	if (el.dataset.value === value) return;
	el.dataset.value = value;
	const chars = Array.from(value);
	const layout = chars.map((c) => (/\d/.test(c) ? 'd' : c)).join('');
	const rebuilt = el.dataset.layout !== layout;
	if (rebuilt) {
		el.dataset.layout = layout;
		el.innerHTML = chars
			.map((c) =>
				/\d/.test(c)
					? `<span class="evr-odo-col"><span class="evr-odo-strip">${'0123456789'
							.split('')
							.map((d) => `<span>${d}</span>`)
							.join('')}</span></span>`
					: `<span class="evr-odo-sep">${esc(c)}</span>`,
			)
			.join('');
	}
	const strips = $$('.evr-odo-strip', el);
	const digits = chars.filter((c) => /\d/.test(c)).map(Number);
	const apply = () =>
		strips.forEach((strip, k) => {
			// 右の桁から順に少し遅れて回す
			strip.style.transitionDelay = reduceMotion() ? '0ms' : `${(strips.length - 1 - k) * 28}ms`;
			strip.style.transform = `translateY(${-digits[k] * 10}%)`;
		});
	if (rebuilt && !reduceMotion()) {
		// 組み直した直後は0の位置から回し始める
		strips.forEach((s) => {
			s.style.transition = 'none';
			s.style.transform = 'translateY(0)';
		});
		void el.offsetWidth;
		strips.forEach((s) => (s.style.transition = ''));
	}
	apply();
}

/* ============================================================
   トースト
   ============================================================ */
let toastTimer = 0;
function toast(message: string) {
	const el = $('[data-toast]');
	el.textContent = message;
	el.classList.add('is-on');
	window.clearTimeout(toastTimer);
	toastTimer = window.setTimeout(() => el.classList.remove('is-on'), 2600);
}

/* ============================================================
   タブ
   ============================================================ */
function renderMode() {
	const seg = $('[data-seg]');
	seg.style.setProperty('--i', state.mode === 'split' ? '0' : '1');
	$$<HTMLButtonElement>('[data-tab]').forEach((t) => {
		const on = t.dataset.tab === state.mode;
		t.setAttribute('aria-selected', String(on));
		t.tabIndex = on ? 0 : -1;
	});
	$$('[data-panel]').forEach((p) => (p.hidden = p.dataset.panel !== state.mode));
}

/* ============================================================
   人数で割る
   ============================================================ */
function syncWeights() {
	const w = state.weights.slice(0, state.count);
	while (w.length < state.count) w.push(1);
	state.weights = w;
}

function renderPeople() {
	const shown = Math.min(state.count, 7);
	const rest = state.count - shown;
	$('[data-people]').innerHTML =
		Array.from({ length: shown }, (_, i) => splitAvatar(i)).join('') +
		(rest > 0 ? `<span class="evr-avatar evr-avatar--more">+${rest}</span>` : '');
	$('[data-count]').textContent = String(state.count);
	$<HTMLButtonElement>('[data-count-dec]').disabled = state.count <= MIN_PEOPLE;
	$<HTMLButtonElement>('[data-count-inc]').disabled = state.count >= MAX_PEOPLE;
}

function renderPills(group: string, value: string) {
	$$<HTMLButtonElement>(`[data-${group}] [role="radio"]`).forEach((b) => {
		const on = b.dataset.value === value;
		b.setAttribute('aria-checked', String(on));
		b.tabIndex = on ? 0 : -1;
	});
}

/** 折りたたんだ設定の見出しに、いまの設定を要約して出す */
function renderOptionsSummary() {
	$('[data-options-now]').textContent = [
		`${yen(state.unit)}円単位`,
		state.rounding === 'organizer-less' ? '多めに集める' : '少なめに集める',
		state.weighted ? '傾斜あり' : null,
	]
		.filter(Boolean)
		.join('・');
}

function renderSplit() {
	renderOptionsSummary();
	const example = state.total <= 0;
	const total = example ? EXAMPLE_TOTAL : state.total;
	const weights = state.weighted ? state.weights : new Array(state.count).fill(1);
	const shares = splitTotal(total, weights, state.unit, state.rounding);
	const result = $('[data-split-result]');
	result.classList.toggle('is-example', example);

	const odo = $('[data-split-odo]');
	const note = $('[data-split-note]');
	const kicker = $('[data-split-kicker]');
	const list = $('[data-split-list]');
	const bar = $('[data-split-bar]');
	const diffBox = $('[data-split-diff]');
	const sr = $('[data-split-sr]');

	if (!shares) {
		setOdometer(odo, '0');
		note.textContent = '1人目の金額がマイナスになります。単位を小さくするか、比率を見直してください。';
		result.classList.add('is-error');
		list.innerHTML = '';
		bar.hidden = true;
		diffBox.hidden = true;
		sr.textContent = note.textContent;
		return;
	}
	result.classList.remove('is-error');
	bar.hidden = false;

	const sumW = weights.reduce((a, w) => a + w, 0);
	const exTag = example ? ' <span class="evr-ex">例</span>' : '';
	if (state.weighted) {
		kicker.innerHTML = `比率1の人の目安${exTag}`;
		setOdometer(odo, yen(Math.round(total / sumW)));
	} else {
		kicker.innerHTML = `1人あたり${exTag}`;
		setOdometer(odo, yen(shares[1].amount));
	}
	const exact = total / state.count;
	const org = shares[0].amount;
	const diff = diffFromExact(total, shares);
	note.textContent = example
		? `${yen(EXAMPLE_TOTAL)}円を${state.count}人で割った場合。金額を入れると計算します`
		: state.weighted
			? `比率に合わせて${yen(state.unit)}円単位で分けました`
			: diff.allExact
				? 'ぴったり割り切れました'
				: '割り切れない差額は1人目が調整します';

	// 金額の比率バー
	while (bar.children.length > shares.length) bar.lastElementChild!.remove();
	const added: HTMLElement[] = [];
	while (bar.children.length < shares.length) {
		const seg = document.createElement('span');
		seg.style.flexGrow = '0';
		if (bar.children.length === 0) seg.className = 'is-organizer';
		bar.appendChild(seg);
		added.push(seg);
	}
	const applyBar = () =>
		shares.forEach((s, k) => ((bar.children[k] as HTMLElement).style.flexGrow = String(Math.max(s.amount, 0))));
	if (added.length && !reduceMotion()) requestAnimationFrame(() => requestAnimationFrame(applyBar));
	else applyBar();

	// 内訳。行数が変わったときだけ組み直し、金額は書き換えで更新する（比率のボタンを押した直後に行が消えないように）
	if (list.children.length !== shares.length || list.dataset.weighted !== String(state.weighted)) {
		list.dataset.weighted = String(state.weighted);
		list.innerHTML = shares
			.map(
				(s) => `<li class="evr-li">
					${splitAvatar(s.index)}
					<span class="evr-li-name">${personLabel(s.index)}${s.index === 0 ? '<em>差額を調整</em>' : ''}</span>
					${
						state.weighted
							? `<span class="evr-weight" role="group" aria-label="${personLabel(s.index)}の比率">
								<button type="button" data-w-dec="${s.index}" aria-label="比率を下げる"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12"></path></svg></button>
								<span data-w-val="${s.index}"></span>
								<button type="button" data-w-inc="${s.index}" aria-label="比率を上げる"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6v12M6 12h12"></path></svg></button>
							</span>`
							: ''
					}
					<span class="evr-li-amount" data-amount-of="${s.index}"></span>
				</li>`,
			)
			.join('');
	}
	shares.forEach((s) => {
		$(`[data-amount-of="${s.index}"]`, list).textContent = `¥${yen(s.amount)}`;
		const w = list.querySelector(`[data-w-val="${s.index}"]`);
		if (w) w.textContent = `×${s.weight}`;
	});

	// ちょうど割った額との差。全員ちょうどのときと例の表示中は出さない
	diffBox.hidden = example || diff.allExact;
	$('[data-split-diff-label]').textContent = state.weighted ? '比率どおりの額より' : `ちょうどの${yen(Math.round(exact))}円より`;
	$('[data-split-diff-list]').innerHTML = diff.groups
		.map((g) => `<li><span>${peopleLabel(g.indices)}</span><strong>${signedYen(g.diff)}</strong></li>`)
		.join('');
	if (document.querySelector('[data-peek]')) requestAnimationFrame(measurePeek);
	sr.textContent = (example
		? ''
		: state.weighted
			? `内訳: ${shares.map((s) => `${personLabel(s.index)} ${yen(s.amount)}円`).join('、')}`
			: `1人あたり${yen(shares[1].amount)}円、1人目は${yen(org)}円`) +
			(example || diff.allExact
				? ''
				: `。ちょうど割った額より ${diff.groups.map((g) => `${peopleLabel(g.indices)} ${signedYen(g.diff)}`).join('、')}`);
}

/* ============================================================
   立て替えを精算
   ============================================================ */
const avatarHtml = (i: number, extra = '') =>
	`<span class="evr-avatar evr-avatar--${i % 4} ${extra}" data-initial-of="${i}">${esc(initial(memberName(i)))}</span>`;

function renderMembers() {
	const canRemove = (i: number) => state.members.length > 2 && !state.payments.some((p) => p.payer === i);
	$('[data-members]').innerHTML =
		state.members
			.map(
				(m, i) => `<li class="evr-member">
					${avatarHtml(i)}
					<input type="text" maxlength="12" value="${esc(m)}" data-member="${i}" aria-label="${i + 1}人目の名前" size="${Math.max(Array.from(m).length, 3) + 1}" />
					${
						canRemove(i)
							? `<button type="button" class="evr-x" data-remove-member="${i}" aria-label="${esc(memberName(i))}を削除"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"></path></svg></button>`
							: ''
					}
				</li>`,
			)
			.join('') +
		(state.members.length < MAX_MEMBERS
			? `<li><button type="button" class="evr-member-add" data-add-member><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6v12M6 12h12"></path></svg>追加</button></li>`
			: '');
}

function renderPayments() {
	$('[data-payments]').innerHTML = state.payments
		.map((p, k) => {
			const ex = EXAMPLE_PAYMENTS[k];
			const options = state.members
				.map((_, i) => `<option value="${i}"${i === p.payer ? ' selected' : ''} data-name-of="${i}">${esc(memberName(i))}</option>`)
				.join('');
			const targets = state.members
				.map(
					(_, i) =>
						`<button type="button" class="evr-target" aria-pressed="${p.targets[i] ? 'true' : 'false'}" data-target="${k}:${i}">
							${avatarHtml(i, 'evr-avatar--sm')}<span data-name-of="${i}">${esc(memberName(i))}</span>
						</button>`,
				)
				.join('');
			return `<li class="evr-pay" data-pay="${k}">
				<div class="evr-pay-top">
					<label class="evr-payer">
						${avatarHtml(p.payer, 'evr-avatar--sm')}
						<span class="evr-payer-name" data-payer-name="${k}">${esc(memberName(p.payer))}</span>
						<span class="evr-payer-verb">が立て替え</span>
						<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5"></path></svg>
						<select data-payer="${k}" aria-label="${k + 1}件目を払った人">${options}</select>
					</label>
					${
						state.payments.length > 1
							? `<button type="button" class="evr-x" data-remove-payment="${k}" aria-label="${k + 1}件目の支払いを削除"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"></path></svg></button>`
							: ''
					}
				</div>
				<div class="evr-pay-mid">
					<input class="evr-pay-memo" type="text" maxlength="20" value="${esc(p.memo)}" placeholder="${ex ? esc(ex.memo) : '内容（任意）'}" data-memo="${k}" aria-label="${k + 1}件目の内容" />
					<label class="evr-pay-amount">
						<span aria-hidden="true">¥</span>
						<input type="text" inputmode="numeric" autocomplete="off" value="${p.amount ? yen(p.amount) : ''}" placeholder="${ex ? yen(ex.amount) : '0'}" data-pay-amount="${k}" aria-label="${k + 1}件目の金額（円）" />
					</label>
				</div>
				<div class="evr-pay-targets" role="group" aria-label="${k + 1}件目は誰の分か">${targets}</div>
			</li>`;
		})
		.join('');
	$$<HTMLInputElement>('[data-pay-amount]').forEach(fitAmount);
}

/** 支払い金額の欄を中身の桁数に合わせる（¥ と数字のあいだに隙間を作らない） */
function fitAmount(input: HTMLInputElement) {
	const text = input.value || input.placeholder || '0';
	input.style.width = `${Math.max(Array.from(text).length, 1) * 0.62 + 0.3}em`;
}

/** 名前の変更を、作り直さずに表示箇所だけへ反映する */
function refreshNames() {
	state.members.forEach((_, i) => {
		const name = memberName(i);
		$$(`[data-name-of="${i}"]`).forEach((el) => (el.textContent = name));
		$$(`[data-initial-of="${i}"]`).forEach((el) => (el.textContent = initial(name)));
	});
	state.payments.forEach((p, k) => {
		const el = document.querySelector(`[data-payer-name="${k}"]`);
		if (el) el.textContent = memberName(p.payer);
	});
}

const transferKey = (t: Transfer) => `${t.from}-${t.to}-${t.amount}`;

function renderSettle() {
	const entered = state.payments.some((p) => p.amount > 0);
	const example = !entered;
	const payments: Payment[] = state.payments
		.map((p, k) => ({
			payer: p.payer,
			amount: example ? (EXAMPLE_PAYMENTS[k]?.amount ?? 0) : p.amount,
			targets: p.targets.flatMap((on, i) => (on ? [i] : [])),
		}))
		.filter((p) => p.amount > 0 && p.targets.length > 0);

	const result = $('[data-settle-result]');
	result.classList.toggle('is-example', example);
	const balances = computeBalances(state.members.length, payments);
	const transfers = settle(balances);
	const people = balances.filter((b) => b.net !== 0).length;

	setOdometer($('[data-settle-odo]'), String(transfers.length));
	const note = $('[data-settle-note]');
	note.textContent = example
		? 'ホテル30,000円とディナー9,000円を3人で分けた場合。金額を入れると計算します'
		: transfers.length === 0
			? '貸し借りはありません。精算は不要です'
			: `${people}人の貸し借りを、${transfers.length}回の送金で精算できます`;

	// 送金リスト（組み合わせが変わったときだけ組み直す。入力のたびにアニメーションが走らないように）
	const list = $('[data-transfers]');
	const keys = transfers.map(transferKey).join('|') + `|${example}`;
	if (list.dataset.keys !== keys) {
		list.dataset.keys = keys;
		list.innerHTML = transfers
			.map(
				(t, n) => `<li class="evr-tr" style="--n:${n}" data-key="${transferKey(t)}">
					<span class="evr-tr-who">${avatarHtml(t.from)}<span data-name-of="${t.from}">${esc(memberName(t.from))}</span></span>
					<span class="evr-tr-flow" aria-hidden="true"><i></i></span>
					<span class="evr-tr-who evr-tr-to">${avatarHtml(t.to)}<span data-name-of="${t.to}">${esc(memberName(t.to))}</span></span>
					<span class="evr-tr-amount">¥${yen(t.amount)}</span>
					<button type="button" class="evr-done" aria-pressed="false" data-done="${transferKey(t)}" ${example ? 'disabled' : ''}>
						<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 12.4l3 3 6-6.3"></path></svg>
						<span class="evr-done-off">済にする</span><span class="evr-done-on">取り消す</span>
					</button>
					<span class="evr-stamp" aria-hidden="true">精算済み</span>
					<span class="evr-sr">${esc(memberName(t.from))}から${esc(memberName(t.to))}へ${yen(t.amount)}円</span>
				</li>`,
			)
			.join('');
	}
	// 「済」の状態を反映
	const liveKeys = new Set(transfers.map(transferKey));
	for (const k of Array.from(doneTransfers)) if (!liveKeys.has(k)) doneTransfers.delete(k);
	$$<HTMLElement>('.evr-tr', list).forEach((li) => {
		const on = !example && doneTransfers.has(li.dataset.key!);
		li.classList.toggle('is-done', on);
		$('[data-done]', li).setAttribute('aria-pressed', String(on));
	});
	const allDone = !example && transfers.length > 0 && transfers.every((t) => doneTransfers.has(transferKey(t)));
	result.classList.toggle('is-all-done', allDone);
	$('[data-settle-kicker]').innerHTML = allDone ? 'すべて精算済み' : `精算方法${example ? ' <span class="evr-ex">例</span>' : ''}`;

	// 精算前の貸し借り
	const breakdown = $<HTMLDetailsElement>('[data-breakdown]');
	breakdown.hidden = example || payments.length === 0;
	const maxAbs = Math.max(1, ...balances.map((b) => Math.abs(b.net)));
	$('[data-balances]').innerHTML = balances
		.map(
			(b, i) => `<li>
				<span class="evr-bal-name">${avatarHtml(i, 'evr-avatar--sm')}<span data-name-of="${i}">${esc(memberName(i))}</span></span>
				<span class="evr-bal-meta">払った ¥${yen(b.paid)} ・ 負担 ¥${yen(b.owed)}</span>
				<span class="evr-bal-bar" aria-hidden="true"><i class="${b.net >= 0 ? 'is-plus' : 'is-minus'}" style="--w:${(Math.abs(b.net) / maxAbs) * 50}%"></i></span>
				<span class="evr-bal-net">${b.net > 0 ? '+' : b.net < 0 ? '−' : '±'}¥${yen(Math.abs(b.net))}</span>
			</li>`,
		)
		.join('');

	$('[data-settle-sr]').textContent = example ? '' : note.textContent ?? '';
	requestAnimationFrame(measurePeek);
}

/* ============================================================
   コピー・共有
   ============================================================ */
function resultText(): string | null {
	if (state.mode === 'split') {
		if (state.total <= 0) return null;
		const weights = state.weighted ? state.weights : new Array(state.count).fill(1);
		const shares = splitTotal(state.total, weights, state.unit, state.rounding);
		if (!shares) return null;
		const head = `【割り勘】合計 ${yen(state.total)}円 ÷ ${state.count}人（${yen(state.unit)}円単位）`;
		const lines = shares.map(
			(s) => {
				const notes = [state.weighted ? `×${s.weight}` : null, s.index === 0 ? '差額を調整' : null].filter(Boolean);
				return `・${personLabel(s.index)}${notes.length ? `（${notes.join('・')}）` : ''}　${yen(s.amount)}円`;
			},
		);
		return [head, ...lines].join('\n');
	}
	const valid: Payment[] = state.payments
		.map((p) => ({ payer: p.payer, amount: p.amount, targets: p.targets.flatMap((on, i) => (on ? [i] : [])) }))
		.filter((p) => p.amount > 0 && p.targets.length > 0);
	if (valid.length === 0) return null;
	const transfers = settle(computeBalances(state.members.length, valid));
	const pays = state.payments
		.filter((p) => p.amount > 0)
		.map((p) => `・${memberName(p.payer)}が立て替え ${yen(p.amount)}円${p.memo.trim() ? `（${p.memo.trim()}）` : ''}`);
	const head = transfers.length ? `【精算】${transfers.length}回の送金で完了` : '【精算】貸し借りはありません';
	const lines = transfers.map((t) => `・${memberName(t.from)} → ${memberName(t.to)}　${yen(t.amount)}円`);
	return [head, ...lines, '', '内訳', ...pays].join('\n');
}

async function copyText(text: string) {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		const ta = document.createElement('textarea');
		ta.value = text;
		ta.setAttribute('readonly', '');
		ta.style.position = 'fixed';
		ta.style.opacity = '0';
		document.body.appendChild(ta);
		ta.select();
		const ok = document.execCommand('copy');
		ta.remove();
		return ok;
	}
}

// 共有リンク用の短い表現（キー名を詰める）。# 以降に入れるのでサーバーには送られない
function encodeState(): string {
	const compact =
		state.mode === 'split'
			? { m: 's', t: state.total, n: state.count, u: state.unit, r: state.rounding === 'organizer-less' ? 0 : 1, w: state.weighted ? state.weights : undefined }
			: {
					m: 'p',
					mb: state.members,
					p: state.payments.map((p) => [p.payer, p.amount, p.memo, p.targets.map((t) => (t ? 1 : 0)).join('')]),
				};
	const json = JSON.stringify(compact);
	return btoa(String.fromCharCode(...new TextEncoder().encode(json)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}

function decodeState(hash: string): State | null {
	try {
		const raw = hash.replace(/^#?d=/, '');
		if (!raw) return null;
		const bin = atob(raw.replace(/-/g, '+').replace(/_/g, '/'));
		const c = JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (ch) => ch.charCodeAt(0))));
		const s = defaults();
		const int = (v: unknown, lo: number, hi: number, d: number) =>
			Number.isFinite(Number(v)) ? Math.min(Math.max(Math.floor(Number(v)), lo), hi) : d;
		if (c.m === 's') {
			s.mode = 'split';
			s.total = int(c.t, 0, 9_999_999_999, 0);
			s.count = int(c.n, MIN_PEOPLE, MAX_PEOPLE, 3);
			s.unit = [1, 10, 100, 1000].includes(Number(c.u)) ? Number(c.u) : 1;
			s.rounding = c.r === 1 ? 'organizer-more' : 'organizer-less';
			if (Array.isArray(c.w)) {
				s.weighted = true;
				s.weights = c.w.slice(0, s.count).map((w: unknown) => Math.min(Math.max(Number(w) || 0, 0), 5));
			}
			s.weights = s.weights.slice(0, s.count);
			while (s.weights.length < s.count) s.weights.push(1);
			return s;
		}
		if (c.m === 'p' && Array.isArray(c.mb) && Array.isArray(c.p)) {
			s.mode = 'settle';
			s.members = c.mb.slice(0, MAX_MEMBERS).map((m: unknown) => String(m).slice(0, 12));
			while (s.members.length < 2) s.members.push(`${s.members.length + 1}人目`);
			s.payments = c.p.slice(0, 50).map((row: unknown[]) => ({
				payer: int(row[0], 0, s.members.length - 1, 0),
				amount: int(row[1], 0, 9_999_999_999, 0),
				memo: String(row[2] ?? '').slice(0, 20),
				targets: s.members.map((_, i) => String(row[3] ?? '')[i] === '1'),
			}));
			if (s.payments.length === 0) s.payments = defaults().payments;
			return s;
		}
	} catch {
		/* 壊れたリンクは無視して初期状態で開く */
	}
	return null;
}

/* ============================================================
   全体の描画と入力
   ============================================================ */
function renderAll() {
	renderMode();
	syncWeights();
	renderPeople();
	renderPills('unit', String(state.unit));
	renderPills('mode', state.rounding);
	const weighted = $<HTMLInputElement>('[data-weighted]');
	weighted.checked = state.weighted;
	const totalEl = $<HTMLInputElement>('[data-split-total]');
	if (document.activeElement !== totalEl) totalEl.value = state.total ? yen(state.total) : '';
	renderSplit();
	renderMembers();
	renderPayments();
	renderSettle();
}

function bindPills(group: string, onPick: (v: string) => void) {
	const root = $(`[data-${group}]`);
	root.addEventListener('click', (e) => {
		const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[role="radio"]');
		if (!b) return;
		onPick(b.dataset.value!);
	});
	// ラジオグループの矢印キー操作
	root.addEventListener('keydown', (e) => {
		if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
		const items = $$<HTMLButtonElement>('[role="radio"]', root);
		const cur = items.findIndex((b) => b.getAttribute('aria-checked') === 'true');
		const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
		const next = items[(cur + dir + items.length) % items.length];
		e.preventDefault();
		onPick(next.dataset.value!);
		next.focus();
	});
}

/* ============================================================
   SPで結果が画面外にあるとき、画面下に小さく結果を出す（タップで結果へ）
   ============================================================ */
let resultVisible = true;
let deviceVisible = false;

function renderPeek() {
	const peek = $<HTMLButtonElement>('[data-peek]');
	const hasValue = state.mode === 'split' ? state.total > 0 : state.payments.some((p) => p.amount > 0);
	const show = hasValue && deviceVisible && !resultVisible;
	if (show) {
		if (state.mode === 'split') {
			$('[data-peek-label]').textContent = state.weighted ? '内訳' : '1人あたり';
			$('[data-peek-value]').textContent = state.weighted
				? ''
				: `¥${$('[data-split-odo]').dataset.value ?? ''}`;
		} else {
			$('[data-peek-label]').textContent = '精算方法';
			$('[data-peek-value]').textContent = `${$('[data-settle-odo]').dataset.value ?? '0'}回の送金`;
		}
	}
	peek.hidden = !show;
}

/** 実際に見えている範囲（キーボードを除く）で、結果の数字が見えているかを測り直す */
function measurePeek() {
	const vv = window.visualViewport;
	const top = vv?.offsetTop ?? 0;
	const height = vv?.height ?? window.innerHeight;
	const head = $(`[data-panel="${state.mode}"] .evr-result-head`).getBoundingClientRect();
	const device = $('[data-device]').getBoundingClientRect();
	resultVisible = head.top >= top - 4 && head.bottom <= top + height + 4;
	deviceVisible = device.top < top + height && device.bottom > top;
	// iOSのキーボードはページに重なるだけなので、表示をキーボードのすぐ上へ持ち上げる
	const keyboard = window.innerHeight - (top + height);
	$('[data-peek]').style.bottom = keyboard > 80 ? `${Math.round(keyboard + 12)}px` : '';
	renderPeek();
}

function initPeek() {
	let raf = 0;
	const schedule = () => {
		cancelAnimationFrame(raf);
		raf = requestAnimationFrame(measurePeek);
	};
	window.addEventListener('scroll', schedule, { passive: true });
	window.addEventListener('resize', schedule);
	window.visualViewport?.addEventListener('resize', schedule);
	window.visualViewport?.addEventListener('scroll', schedule);
	$('[data-peek]').addEventListener('click', () => {
		const target = $(`[data-panel="${state.mode}"] .evr-result`);
		// キーボードを閉じてから結果へ移動する
		(document.activeElement as HTMLElement | null)?.blur();
		target.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
	});
	measurePeek();
}

function initParallax() {
	const bg = document.querySelector<HTMLElement>('.evr-hero-bg');
	if (!bg || reduceMotion() || !window.matchMedia('(pointer: fine)').matches) return;
	let raf = 0;
	window.addEventListener(
		'pointermove',
		(e) => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(() => {
				bg.style.setProperty('--mx', String(e.clientX / innerWidth - 0.5));
				bg.style.setProperty('--my', String(e.clientY / innerHeight - 0.5));
			});
		},
		{ passive: true },
	);
}

export function initWarikan() {
	initParallax();
	const fromLink = decodeState(location.hash);
	if (fromLink) state = fromLink;
	document.documentElement.classList.add('evr-ready');

	// タブ
	const tabs = $$<HTMLButtonElement>('[data-tab]');
	tabs.forEach((t, i) => {
		t.addEventListener('click', () => {
			state.mode = t.dataset.tab as Mode;
			renderMode();
			measurePeek();
		});
		t.addEventListener('keydown', (e) => {
			if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
			const next = tabs[(i + 1) % tabs.length];
			state.mode = next.dataset.tab as Mode;
			renderMode();
			next.focus();
		});
	});

	// 合計金額（入力しながら3桁区切りを付ける。カーソルは数字の並びの中で同じ位置に戻す）
	const totalEl = $<HTMLInputElement>('[data-split-total]');
	totalEl.addEventListener('input', () => {
		const caretDigits = totalEl.value.slice(0, totalEl.selectionStart ?? totalEl.value.length).replace(/[^\d]/g, '').length;
		state.total = digitsOnly(totalEl.value);
		totalEl.value = state.total ? yen(state.total) : '';
		let pos = 0;
		for (let seen = 0; pos < totalEl.value.length && seen < caretDigits; pos++) if (/\d/.test(totalEl.value[pos])) seen++;
		totalEl.setSelectionRange(pos, pos);
		renderSplit();
	});
	$$<HTMLButtonElement>('[data-quick]').forEach((b) =>
		b.addEventListener('click', () => {
			state.total = Math.min(state.total + Number(b.dataset.quick), 9_999_999_999);
			totalEl.value = yen(state.total);
			renderSplit();
		}),
	);
	$('[data-quick-clear]').addEventListener('click', () => {
		state.total = 0;
		totalEl.value = '';
		totalEl.focus();
		renderSplit();
	});

	// 人数
	const changeCount = (d: number) => {
		state.count = Math.min(Math.max(state.count + d, MIN_PEOPLE), MAX_PEOPLE);
		syncWeights();
		renderPeople();
		renderSplit();
	};
	$('[data-count-dec]').addEventListener('click', () => changeCount(-1));
	$('[data-count-inc]').addEventListener('click', () => changeCount(1));

	bindPills('unit', (v) => {
		state.unit = Number(v);
		renderPills('unit', v);
		renderSplit();
	});
	bindPills('mode', (v) => {
		state.rounding = v as RoundingMode;
		renderPills('mode', v);
		renderSplit();
	});
	$<HTMLInputElement>('[data-weighted]').addEventListener('change', (e) => {
		state.weighted = (e.target as HTMLInputElement).checked;
		renderSplit();
	});
	// 比率（0.5刻み・0〜5）
	$('[data-split-list]').addEventListener('click', (e) => {
		const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-w-dec],[data-w-inc]');
		if (!b) return;
		const inc = b.dataset.wInc !== undefined;
		const i = Number(inc ? b.dataset.wInc : b.dataset.wDec);
		state.weights[i] = Math.min(Math.max(state.weights[i] + (inc ? 0.5 : -0.5), 0), 5);
		renderSplit();
	});

	// メンバー
	const membersEl = $('[data-members]');
	membersEl.addEventListener('input', (e) => {
		const el = e.target as HTMLInputElement;
		if (el.dataset.member === undefined) return;
		state.members[Number(el.dataset.member)] = el.value;
		el.size = Math.max(Array.from(el.value).length, 3) + 1;
		refreshNames();
		renderSettle();
	});
	membersEl.addEventListener('click', (e) => {
		const t = e.target as HTMLElement;
		if (t.closest('[data-add-member]')) {
			if (state.members.length >= MAX_MEMBERS) return;
			state.members.push(`${String.fromCharCode(65 + state.members.length)}さん`);
			// 金額を入れ済みの支払いには加えない（あとから来た人の分まで黙って結果が変わらないように）
			state.payments.forEach((p) => p.targets.push(p.amount <= 0));
			renderMembers();
			renderPayments();
			renderSettle();
			$<HTMLInputElement>(`[data-member="${state.members.length - 1}"]`).select();
			return;
		}
		const rm = t.closest<HTMLButtonElement>('[data-remove-member]');
		if (!rm) return;
		const idx = Number(rm.dataset.removeMember);
		state.members.splice(idx, 1);
		state.payments.forEach((p) => {
			if (p.payer > idx) p.payer -= 1;
			p.targets.splice(idx, 1);
		});
		doneTransfers.clear();
		renderMembers();
		renderPayments();
		renderSettle();
	});

	// 支払い
	const paymentsEl = $('[data-payments]');
	paymentsEl.addEventListener('input', (e) => {
		const el = e.target as HTMLInputElement | HTMLSelectElement;
		if (el.dataset.payAmount !== undefined) {
			const input = el as HTMLInputElement;
			const k = Number(input.dataset.payAmount);
			state.payments[k].amount = digitsOnly(input.value);
			input.value = state.payments[k].amount ? yen(state.payments[k].amount) : '';
			fitAmount(input);
		} else if (el.dataset.memo !== undefined) {
			state.payments[Number(el.dataset.memo)].memo = el.value;
			return;
		} else if (el.dataset.payer !== undefined) {
			const k = Number(el.dataset.payer);
			state.payments[k].payer = Number(el.value);
			// 払った人のアバターと名前、メンバーの削除可否が変わる
			renderPayments();
			renderMembers();
		}
		renderSettle();
	});
	paymentsEl.addEventListener('click', (e) => {
		const t = e.target as HTMLElement;
		const tg = t.closest<HTMLButtonElement>('[data-target]');
		if (tg) {
			const [k, i] = tg.dataset.target!.split(':').map(Number);
			state.payments[k].targets[i] = !state.payments[k].targets[i];
			tg.setAttribute('aria-pressed', String(state.payments[k].targets[i]));
			renderSettle();
			return;
		}
		const rm = t.closest<HTMLButtonElement>('[data-remove-payment]');
		if (rm) {
			state.payments.splice(Number(rm.dataset.removePayment), 1);
			renderPayments();
			renderMembers();
			renderSettle();
		}
	});
	$('[data-add-payment]').addEventListener('click', () => {
		state.payments.push({ payer: 0, amount: 0, memo: '', targets: state.members.map(() => true) });
		renderPayments();
		renderSettle();
		$<HTMLInputElement>(`[data-pay-amount="${state.payments.length - 1}"]`).focus();
	});

	// 送金の「済」
	$('[data-transfers]').addEventListener('click', (e) => {
		const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-done]');
		if (!b) return;
		const key = b.dataset.done!;
		if (doneTransfers.has(key)) doneTransfers.delete(key);
		else doneTransfers.add(key);
		renderSettle();
	});

	// コピー・共有・リセット
	const onCopy = async () => {
		const text = resultText();
		if (!text) {
			toast(state.mode === 'split' ? '合計金額を入れてください' : '支払いの金額を入れてください');
			return;
		}
		const ok = await copyText(`${text}\n\n計算: Evere 割り勘計算 ${PAGE_URL}`);
		toast(ok ? 'コピーしました。LINEなどに貼り付けできます' : 'コピーできませんでした');
	};
	const onShare = async () => {
		if (!resultText()) {
			toast(state.mode === 'split' ? '合計金額を入れてください' : '支払いの金額を入れてください');
			return;
		}
		// 開いているページのURLから作る（本番以外の環境でもそのまま開けるように）
		const url = `${location.origin}${location.pathname}#d=${encodeState()}`;
		history.replaceState(null, '', `#d=${encodeState()}`);
		if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
			try {
				await navigator.share({ title: '割り勘の計算結果', url });
				return;
			} catch {
				/* キャンセル時はコピーに切り替えない */
				return;
			}
		}
		const ok = await copyText(url);
		toast(ok ? '共有リンクをコピーしました' : 'コピーできませんでした');
	};
	$$('[data-copy]').forEach((b) => b.addEventListener('click', onCopy));
	$$('[data-share]').forEach((b) => b.addEventListener('click', onShare));
	$('[data-reset]').addEventListener('click', () => {
		const mode = state.mode;
		state = defaults();
		state.mode = mode;
		doneTransfers.clear();
		history.replaceState(null, '', location.pathname);
		renderAll();
		toast('入力をリセットしました');
	});

	renderAll();
	initPeek();
	if (fromLink) toast('共有された計算結果を開きました');
}
