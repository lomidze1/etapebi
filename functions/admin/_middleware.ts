interface Env {
  ADMIN_PASSWORD: string;
}

interface Context {
  request: Request;
  env: Env;
  next: () => Promise<Response>;
}

const ADMIN_USERNAME = 'admin';
const REALM = 'etapebi admin';

function unauthorizedResponse(): Response {
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'Cache-Control': 'no-store',
    },
  });
}

export async function onRequest(context: Context): Promise<Response> {
  const { request, env, next } = context;

  if (!env.ADMIN_PASSWORD) {
    return new Response('Admin password not configured', { status: 503 });
  }

  const header = request.headers.get('Authorization');
  if (!header || !header.startsWith('Basic ')) {
    return unauthorizedResponse();
  }

  let decoded: string;
  try {
    decoded = atob(header.slice(6));
  } catch {
    return unauthorizedResponse();
  }

  const separator = decoded.indexOf(':');
  if (separator < 0) {
    return unauthorizedResponse();
  }

  const user = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1);

  if (user !== ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) {
    return unauthorizedResponse();
  }

  return next();
}
