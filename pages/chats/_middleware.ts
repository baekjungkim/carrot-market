import type { NextRequest, NextFetchEvent } from "next/server";

export const middleware = (req: NextRequest, ev: NextFetchEvent) => {
  console.log("Chats ONLY Middleware");
};
