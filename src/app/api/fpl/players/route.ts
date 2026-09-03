import { NextRequest, NextResponse } from "next/server";
import { players } from "@/lib/fpl";
export async function GET(request:NextRequest){try{let result=await players(request.nextUrl.searchParams.get("refresh")==="1");const q=request.nextUrl.searchParams.get("q")?.toLowerCase();if(q)result=result.filter(p=>`${p.name} ${p.webName}`.toLowerCase().includes(q));return NextResponse.json(result.slice(0,Number(request.nextUrl.searchParams.get("limit")??30)))}catch{return NextResponse.json({error:"FPL player data unavailable."},{status:502})}}
