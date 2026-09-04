import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const runtime="nodejs";
export async function POST(request:NextRequest){const entryId=Number((await request.json()).entryId);if(!Number.isInteger(entryId)||entryId<1)return NextResponse.json({error:"Enter a valid numerical FPL team ID."},{status:400});revalidateTag("fpl:bootstrap");revalidateTag("fpl:fixtures");revalidateTag(`fpl:entry:${entryId}`);return NextResponse.json({ok:true})}
