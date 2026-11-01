import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Called by a Sanity webhook on every publish, so changes appear within seconds.
 * The signature is checked against SANITY_REVALIDATE_SECRET.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ message: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 });

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
    if (!isValidSignature) return NextResponse.json({ message: "Invalid signature" }, { status: 401 });

    // The site is small, so refresh every page rather than tracking which page uses what.
    revalidatePath("/", "layout");
    return NextResponse.json({ revalidated: true, type: body?._type ?? null });
  } catch (error) {
    console.error("[revalidate]", error);
    return NextResponse.json({ message: "Could not revalidate" }, { status: 500 });
  }
}
