import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const profile = await client.user.findUnique({
      where: {
        id: req.session.user?.id,
      },
      include: {
        curiosities: {
          select: {
            postId: true,
          },
        },
        answers: {
          select: {
            postId: true,
          },
        },
      },
    });
    res.json({
      ok: true,
      profile,
    });
  } else if (req.method === "POST") {
    const {
      session: { user },
      body: { name, email, phone, avatarId },
    } = req;

    if (email) {
      const alreadyEmail = await client.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });
      if (alreadyEmail && user?.id !== alreadyEmail.id)
        return res
          .status(409)
          .json({ ok: false, error: "This Email is already in use" });
    }
    if (phone) {
      const alreadyPhone = await client.user.findUnique({
        where: {
          phone,
        },
        select: {
          id: true,
        },
      });
      if (alreadyPhone && user?.id !== alreadyPhone.id)
        return res
          .status(409)
          .json({ ok: false, error: "This Phone number is already in use" });
    }

    await client.user.update({
      where: {
        id: user?.id,
      },
      data: {
        ...(avatarId ? { avatar: avatarId } : ""),
        phone,
        email,
        name,
      },
    });

    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
