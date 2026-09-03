import { NextResponse } from "next/server";
import { getPlayerStatSchema } from "@/lib/player-query";
export async function GET(){return NextResponse.json({fields:await getPlayerStatSchema()})}
