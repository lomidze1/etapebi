interface Env {
  TURNSTILE_SECRET: string;
  RESEND_API_KEY: string;
  MAIL_TO_ADDRESS: string;
  MAIL_FROM_ADDRESS: string;
}

interface Context {
  request: Request;
  env: Env;
}

const PHONE_RE = /^[+]?[\d\s]{6,30}$/;
const PHONE_MIN_DIGITS = 6;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function wantsJson(request: Request): boolean {
  const accept = request.headers.get('Accept') ?? '';
  return accept.includes('application/json');
}

function fail(
  request: Request,
  errors: string[],
  status = 400,
): Response {
  if (wantsJson(request)) {
    return new Response(JSON.stringify({ ok: false, errors }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(null, {
    status: 303,
    headers: { Location: `/contact?error=${encodeURIComponent(errors.join(','))}` },
  });
}

function ok(request: Request): Response {
  if (wantsJson(request)) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(null, {
    status: 303,
    headers: { Location: '/contact?sent=1' },
  });
}

export async function onRequestPost(context: Context): Promise<Response> {
  const { request, env } = context;
  const form = await request.formData();

  const name = (form.get('name') ?? '').toString().trim();
  const phone = (form.get('phone') ?? '').toString().trim();
  const email = (form.get('email') ?? '').toString().trim();
  const message = (form.get('message') ?? '').toString().trim();
  const turnstileToken = (form.get('cf-turnstile-response') ?? '').toString();

  const errors: string[] = [];
  if (name.length < 2 || name.length > 100) errors.push('name');
  if (!phone || !PHONE_RE.test(phone) || phone.replace(/\D/g, '').length < PHONE_MIN_DIGITS) {
    errors.push('phone');
  }
  if (email && !EMAIL_RE.test(email)) errors.push('email');
  if (message.length < 10 || message.length > 5000 || !/\s/.test(message)) {
    errors.push('message');
  }
  if (!turnstileToken) errors.push('turnstile');

  if (errors.length > 0) {
    return fail(request, errors);
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? '';
  const tsRes = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: turnstileToken,
        remoteip: ip,
      }),
    },
  );
  const tsData = (await tsRes.json()) as { success: boolean };
  if (!tsData.success) {
    return fail(request, ['turnstile']);
  }

  const subject = `etapebi.com — შეტყობინება ${name}-ისგან`;
  const body = [
    `სახელი: ${name}`,
    `ტელეფონი: ${phone}`,
    `ემაილი: ${email || '—'}`,
    '',
    'შეტყობინება:',
    message,
  ].join('\n');

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: env.MAIL_FROM_ADDRESS,
      to: env.MAIL_TO_ADDRESS,
      subject,
      text: body,
      reply_to: email || undefined,
    }),
  });

  if (!emailRes.ok) {
    const errorBody = await emailRes.text();
    console.error('Resend API error', emailRes.status, errorBody);
    return fail(request, ['server'], 500);
  }

  return ok(request);
}
