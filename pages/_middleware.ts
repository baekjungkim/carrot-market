import type { NextRequest, NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";

export const middleware = (req: NextRequest, ev: NextFetchEvent) => {
  if (req.ua?.isBot) {
    return new Response("Only humans can enter this site", { status: 403 });
  }
  if (!req.url.includes("/api")) {
    if (!req.cookies.carrotsession && !req.url.includes("/enter")) {
      return NextResponse.redirect("/enter");
    }
  }
};
