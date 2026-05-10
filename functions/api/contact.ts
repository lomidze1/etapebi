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

const PHONE_RE = /^[+\d\s\-()]{6,30}$/;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function redirect(target: string): Response {
  return new Response(null, {
    status: 303,
    headers: { Location: target },
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
  if (message.length < 10 || message.length > 5000) errors.push('message');
  if (!phone && !email) errors.push('contact-method');
  if (phone && !PHONE_RE.test(phone)) errors.push('phone');
  if (email && !EMAIL_RE.test(email)) errors.push('email');
  if (!turnstileToken) errors.push('turnstile');

  if (errors.length > 0) {
    return redirect(`/contact?error=${encodeURIComponent(errors.join(','))}`);
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
    return redirect('/contact?error=turnstile');
  }

  const subject = `etapebi.com — შეტყობინება ${name}-ისგან`;
  const body = [
    `სახელი: ${name}`,
    `ტელეფონი: ${phone || '—'}`,
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
    return redirect('/contact?error=server');
  }

  return redirect('/contact?sent=1');
}
