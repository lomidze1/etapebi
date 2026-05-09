interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

interface Context {
  request: Request;
  env: Env;
}

function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  const target = `${name}=`;
  for (const part of header.split(';')) {
    const trimmed = part.trim();
    if (trimmed.startsWith(target)) {
      return trimmed.slice(target.length);
    }
  }
  return null;
}

function clearStateCookie(): string {
  return 'oauth_state=; Path=/oauth; HttpOnly; Secure; SameSite=Lax; Max-Age=0';
}

function htmlResponse(body: string, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      ...extraHeaders,
    },
  });
}

function successPage(token: string): Response {
  const message = `authorization:github:success:${JSON.stringify({ token, provider: 'github' })}`;
  const messageLiteral = JSON.stringify(message);

  const html = `<!doctype html>
<html lang="ka">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex, nofollow">
  <title>etapebi · CMS</title>
</head>
<body>
<script>
(function() {
  function receiveMessage(e) {
    if (!window.opener) return;
    window.opener.postMessage(${messageLiteral}, e.origin);
  }
  window.addEventListener("message", receiveMessage, false);
  if (window.opener) {
    window.opener.postMessage("authorizing:github", "*");
  }
})();
</script>
<p>თქვენი სესია დადასტურებულია — შეგიძლიათ დახუროთ ეს ფანჯარა.</p>
</body>
</html>`;

  return htmlResponse(html, 200, { 'Set-Cookie': clearStateCookie() });
}

function errorPage(reason: string): Response {
  const message = `authorization:github:error:${JSON.stringify({ message: reason })}`;
  const messageLiteral = JSON.stringify(message);

  const html = `<!doctype html>
<html lang="ka">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex, nofollow">
  <title>etapebi · CMS error</title>
</head>
<body>
<script>
(function() {
  if (window.opener) {
    window.opener.postMessage(${messageLiteral}, "*");
  }
})();
</script>
<p>ავტორიზაცია ვერ მოხერხდა.</p>
</body>
</html>`;

  return htmlResponse(html, 400, { 'Set-Cookie': clearStateCookie() });
}

export async function onRequest(context: Context): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookieState = readCookie(request.headers.get('Cookie'), 'oauth_state');

  if (!code || !state || !cookieState || state !== cookieState) {
    return errorPage('Invalid OAuth state');
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  if (!tokenRes.ok) {
    return errorPage('Token exchange failed');
  }

  const tokenData = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!tokenData.access_token) {
    return errorPage(tokenData.error_description ?? tokenData.error ?? 'No access token');
  }

  return successPage(tokenData.access_token);
}
