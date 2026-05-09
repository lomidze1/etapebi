interface Env {
  GITHUB_CLIENT_ID: string;
}

interface Context {
  request: Request;
  env: Env;
}

export async function onRequest(context: Context): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const provider = url.searchParams.get('provider') ?? 'github';

  if (provider !== 'github') {
    return new Response('Provider not supported', { status: 400 });
  }

  const state = crypto.randomUUID();

  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', `${url.origin}/oauth/callback`);
  authUrl.searchParams.set('scope', 'repo user');
  authUrl.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl.toString(),
      'Set-Cookie': `oauth_state=${state}; Path=/oauth; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}
