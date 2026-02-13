import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*"],
};

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      // Triggers the browser Basic Auth prompt.
      "WWW-Authenticate": 'Basic realm="SJR Admin"',
    },
  });
}

export function proxy(request: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASS;

  // Fail closed in production. In dev, also fail closed (explicit is better than implicit).
  if (!user || !pass) return unauthorized();

  const auth = request.headers.get("authorization") || "";
  const [scheme, encoded] = auth.split(" ");
  if (scheme !== "Basic" || !encoded) return unauthorized();

  try {
    const decoded = atob(encoded);
    const idx = decoded.indexOf(":");
    if (idx < 0) return unauthorized();
    const inUser = decoded.slice(0, idx);
    const inPass = decoded.slice(idx + 1);
    if (inUser !== user || inPass !== pass) return unauthorized();
    return NextResponse.next();
  } catch {
    return unauthorized();
  }
}
