/**
 * お問い合わせフォームの受け口（Cloudflare Pages Functions）。
 * POST /api/contact { name?, email, message, locale?, website(ハニーポット) }
 * を受け取り、Resend API で support@evereapp.com へ転送する。
 *
 * 必要な環境変数（Cloudflare Pages ダッシュボードで設定）:
 *   RESEND_API_KEY        … Resend の API キー（必須）
 *   CONTACT_TO            … 送信先（省略時 support@evereapp.com）
 *   CONTACT_FROM          … 差出人（省略時 Evere Support <noreply@evereapp.com>。
 *                           Resend で認証済みドメインのアドレスであること）
 *   TURNSTILE_SECRET_KEY  … 設定すると Cloudflare Turnstile 検証を有効化（任意）
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost({ request, env }) {
	let body;
	try {
		body = await request.json();
	} catch {
		return json({ ok: false, error: 'invalid_json' }, 400);
	}

	// ハニーポットが埋まっていたらボット。成功を装って破棄する
	if (typeof body.website === 'string' && body.website.trim() !== '') {
		return json({ ok: true }, 200);
	}

	const name = String(body.name ?? '').trim().slice(0, 200);
	const email = String(body.email ?? '').trim();
	const message = String(body.message ?? '').trim();
	const locale = String(body.locale ?? 'unknown').slice(0, 10);

	if (!EMAIL_RE.test(email) || email.length > 320) {
		return json({ ok: false, error: 'invalid_email' }, 400);
	}
	if (message.length === 0 || message.length > 5000) {
		return json({ ok: false, error: 'invalid_message' }, 400);
	}

	// Turnstile（シークレットが設定されている場合のみ検証）
	if (env.TURNSTILE_SECRET_KEY) {
		const token = String(body.turnstileToken ?? '');
		const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				secret: env.TURNSTILE_SECRET_KEY,
				response: token,
				remoteip: request.headers.get('CF-Connecting-IP') ?? undefined,
			}),
		});
		const result = await verify.json();
		if (!result.success) {
			return json({ ok: false, error: 'turnstile_failed' }, 403);
		}
	}

	if (!env.RESEND_API_KEY) {
		return json({ ok: false, error: 'not_configured' }, 500);
	}

	const to = env.CONTACT_TO || 'support@evereapp.com';
	const from = env.CONTACT_FROM || 'Evere Support <noreply@evereapp.com>';

	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.RESEND_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			from,
			to: [to],
			reply_to: email,
			subject: `[Evere] お問い合わせ (${locale})`,
			text: [
				`Name: ${name || '(未入力)'}`,
				`Email: ${email}`,
				`Locale: ${locale}`,
				'',
				'--- Message ---',
				message,
			].join('\n'),
		}),
	});

	if (!res.ok) {
		return json({ ok: false, error: 'send_failed' }, 502);
	}

	return json({ ok: true }, 200);
}

function json(data, status) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}
