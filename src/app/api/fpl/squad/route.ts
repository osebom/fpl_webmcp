import { NextRequest, NextResponse } from "next/server";
import { squad } from "@/lib/fpl";
export async function GET(request:NextRequest){const id=Number(request.nextUrl.searchParams.get("entryId"));if(!Number.isInteger(id)||id<1)return NextResponse.json({error:"Enter a valid FPL team ID."},{status:400});try{return NextResponse.json(await squad(id,request.nextUrl.searchParams.get("refresh")==="1"))}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Could not load this public FPL entry."},{status:502})}}
