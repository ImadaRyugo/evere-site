// 割り勘計算ツール（/ja/tools/warikan/）の計算ロジック。
// DOMに依存しない純粋関数だけを置く（テストしやすくするため）。
// 金額はすべて円の整数で扱う。

export type RoundingMode = 'organizer-less' | 'organizer-more';

export interface SplitShare {
	/** 0番目が割り切れない差額を調整する人 */
	index: number;
	weight: number;
	amount: number;
}

/**
 * 合計金額を比率で割り、unit 円単位にそろえる。
 * 0番目（差額を調整する人）以外を unit 単位に丸め、残りを0番目が払う。
 * - organizer-less: 他の人を切り上げる（多めに集めて、0番目の負担が少し減る）
 * - organizer-more: 他の人を切り捨てる（端数ぶん0番目が多めに払う）
 * 0番目の金額が負になる組み合わせ（極端な単位や比率）は null を返す。
 */
export function splitTotal(
	total: number,
	weights: number[],
	unit: number,
	mode: RoundingMode,
): SplitShare[] | null {
	const sum = weights.reduce((a, w) => a + w, 0);
	if (!(total > 0) || weights.length < 2 || !(sum > 0)) return null;
	const round = mode === 'organizer-less' ? Math.ceil : Math.floor;
	const shares: SplitShare[] = weights.map((weight, index) => ({ index, weight, amount: 0 }));
	let others = 0;
	for (let i = 1; i < shares.length; i++) {
		// 浮動小数の誤差で 3400.0000001 が 3500 に切り上がらないよう、1e-9 円未満を落としてから丸める
		const exact = (total * shares[i].weight) / sum;
		const amount = round(Math.round((exact / unit) * 1e6) / 1e6) * unit;
		shares[i].amount = amount;
		others += amount;
	}
	shares[0].amount = total - others;
	return shares[0].amount < 0 ? null : shares;
}

export interface Payment {
	payer: number;
	amount: number;
	/** 負担する人（payer 自身を含めてよい） */
	targets: number[];
}

export interface Balance {
	paid: number;
	owed: number;
	/** paid − owed。プラスは受け取る側、マイナスは払う側 */
	net: number;
}

export interface Transfer {
	from: number;
	to: number;
	amount: number;
}

/**
 * 各人の払った額・負担額・差額を出す。負担額は支払いごとに対象者で均等割りし、
 * 最後に1円単位へ丸める。丸めで合計がずれないよう、差額は最大剰余法で調整する
 * （全員の差額の合計が必ず0円になる）。
 */
export function computeBalances(memberCount: number, payments: Payment[]): Balance[] {
	const paid = new Array<number>(memberCount).fill(0);
	const owedExact = new Array<number>(memberCount).fill(0);
	for (const p of payments) {
		const targets = p.targets.filter((t) => t >= 0 && t < memberCount);
		if (!(p.amount > 0) || targets.length === 0 || p.payer < 0 || p.payer >= memberCount) continue;
		paid[p.payer] += p.amount;
		for (const t of targets) owedExact[t] += p.amount / targets.length;
	}
	const totalPaid = paid.reduce((a, v) => a + v, 0);
	// 負担額を整数に丸める（合計は総支払額に一致させる）
	const floors = owedExact.map((v) => Math.floor(v + 1e-9));
	let rest = totalPaid - floors.reduce((a, v) => a + v, 0);
	const order = owedExact
		.map((v, i) => ({ i, frac: v - Math.floor(v + 1e-9) }))
		.sort((a, b) => b.frac - a.frac || a.i - b.i);
	const owed = [...floors];
	for (let k = 0; rest > 0 && k < order.length; k++, rest--) owed[order[k].i] += 1;
	return paid.map((v, i) => ({ paid: v, owed: owed[i], net: v - owed[i] }));
}

/** 差額の合計が0の集合を、受け取る側と払う側で順に突き合わせる（k人なら最大 k−1 回） */
function settleGroup(members: { i: number; net: number }[]): Transfer[] {
	const creditors = members.filter((m) => m.net > 0).map((m) => ({ ...m })).sort((a, b) => b.net - a.net);
	const debtors = members
		.filter((m) => m.net < 0)
		.map((m) => ({ i: m.i, net: -m.net }))
		.sort((a, b) => b.net - a.net);
	const out: Transfer[] = [];
	let c = 0;
	let d = 0;
	while (c < creditors.length && d < debtors.length) {
		const amount = Math.min(creditors[c].net, debtors[d].net);
		if (amount > 0) out.push({ from: debtors[d].i, to: creditors[c].i, amount });
		creditors[c].net -= amount;
		debtors[d].net -= amount;
		if (creditors[c].net === 0) c++;
		if (debtors[d].net === 0) d++;
	}
	return out;
}

/** 厳密解を探す人数の上限（3^n の探索なので、これを超えたら近似に切り替える） */
const EXACT_LIMIT = 12;

/**
 * 送金の組み合わせを出す。差額が0でない人が EXACT_LIMIT 人以下なら、
 * 送金回数が最小になる組み合わせを返す。
 * 考え方: 差額の合計が0になるグループにできるだけ多く分ければ、
 * 各グループ内は（人数−1）回で精算できる。最小回数 = 人数 − グループ数。
 */
export function settle(balances: Balance[]): Transfer[] {
	const nonzero = balances.map((b, i) => ({ i, net: b.net })).filter((m) => m.net !== 0);
	const n = nonzero.length;
	if (n === 0) return [];
	if (n > EXACT_LIMIT) return settleGroup(nonzero);

	const full = (1 << n) - 1;
	const sum = new Array<number>(1 << n).fill(0);
	for (let mask = 1; mask <= full; mask++) {
		const low = mask & -mask;
		sum[mask] = sum[mask ^ low] + nonzero[31 - Math.clz32(low)].net;
	}
	// best[mask] = mask を差額0のグループに分けたときの最大グループ数（分けられなければ -1）
	const best = new Array<number>(1 << n).fill(-2);
	const choice = new Array<number>(1 << n).fill(0);
	const solve = (mask: number): number => {
		if (mask === 0) return 0;
		if (best[mask] !== -2) return best[mask];
		let result = -1;
		const low = mask & -mask;
		const rest = mask ^ low;
		// 最下位ビットを含む部分集合だけを調べる（同じ分け方を重複して数えない）
		for (let sub = rest; ; sub = (sub - 1) & rest) {
			const group = sub | low;
			if (sum[group] === 0) {
				const r = solve(mask ^ group);
				if (r >= 0 && r + 1 > result) {
					result = r + 1;
					choice[mask] = group;
				}
			}
			if (sub === 0) break;
		}
		best[mask] = result;
		return result;
	};
	solve(full);

	const out: Transfer[] = [];
	for (let mask = full; mask !== 0; mask ^= choice[mask]) {
		const group = choice[mask];
		out.push(...settleGroup(nonzero.filter((_, k) => group & (1 << k))));
	}
	return out;
}

export interface DiffGroup {
	/** 同じ差になった人（0番目 = 差額を調整する人） */
	indices: number[];
	/** ちょうど割った額との差（円・四捨五入）。プラスは多く払う */
	diff: number;
}

/**
 * 各人の金額が「ちょうど割った額（比率どおりの額）」からいくらずれたかを、
 * 同じ差の人ごとにまとめて返す。丸めの設定を変えたときに、誰がいくら得をして
 * 誰がいくら損をするかを見せるためのもの。
 * 並びは先頭の人の順。ただし差額を調整する0番目だけのグループは最後に置く。
 */
export function diffFromExact(total: number, shares: SplitShare[]): { allExact: boolean; groups: DiffGroup[] } {
	const sum = shares.reduce((a, s) => a + s.weight, 0);
	const diffs = shares.map((s) => s.amount - (total * s.weight) / sum);
	const allExact = diffs.every((d) => Math.abs(d) < 1e-6);
	const byDiff = new Map<number, number[]>();
	diffs.forEach((d, i) => {
		const key = Math.round(d) || 0; // -0 を 0 にそろえる
		byDiff.set(key, [...(byDiff.get(key) ?? []), shares[i].index]);
	});
	const groups = Array.from(byDiff, ([diff, indices]) => ({ diff, indices })).sort((a, b) => {
		const aOrg = a.indices.length === 1 && a.indices[0] === 0;
		const bOrg = b.indices.length === 1 && b.indices[0] === 0;
		if (aOrg !== bOrg) return aOrg ? 1 : -1;
		return a.indices[0] - b.indices[0];
	});
	return { allExact, groups };
}
