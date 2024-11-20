import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const roles = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'VENDOR', 'CUSTOMER', 'GUEST'];

const allowedOrigins = ['*'];
const isOriginAllowed = (origin: string) => allowedOrigins.includes(origin) || allowedOrigins.includes('*');
const setCorsHeaders = (response: NextResponse, origin: string) => {
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true'); // Ensure credentials are allowed
  return response;
};

const handleCors = (request: NextRequest, response: NextResponse, origin: string) => {
  if (request.method === 'OPTIONS') {
    if (isOriginAllowed(origin)) {
      return setCorsHeaders(NextResponse.json({}), origin);
    }
    return NextResponse.json({});
  }

  if (isOriginAllowed(origin)) {
    setCorsHeaders(response, origin);
  }
  return response;
};

export async function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') || '*';
  let response = NextResponse.next();

  // Handle CORS
  response = handleCors(request, response, origin);

  const user = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // If the pathname starts with /protected and the user is not an admin, redirect to the home page
  // if ((pathname.startsWith('/admin') || pathname.startsWith('/random-winners')) && !user) {
  //   return NextResponse.redirect(new URL('/signin', request.url));
  // }
  // if (pathname.startsWith('/signin') && user) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  // Continue with the request if the user is an admin or the route is not protected
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
