import { NextRequest, NextResponse } from "next/server";
import { queryPlayers } from "@/lib/player-query";
export async function POST(request:NextRequest){try{return NextResponse.json({players:await queryPlayers(await request.json())})}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Player query failed."},{status:400})}}
