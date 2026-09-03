import { NextRequest, NextResponse } from "next/server";
import { queryHeadToHead, queryMatchHistory } from "@/lib/historical-results";

export const runtime="nodejs";
export async function POST(request:NextRequest){try{const input=await request.json();if(input.mode==="head_to_head"){if(typeof input.team_a!=="string"||typeof input.team_b!=="string")return NextResponse.json({error:"team_a and team_b are required."},{status:400});return NextResponse.json(await queryHeadToHead({teamA:input.team_a,teamB:input.team_b,seasons:input.seasons,venue:input.venue}))}if(typeof input.team!=="string")return NextResponse.json({error:"team is required."},{status:400});return NextResponse.json({matches:await queryMatchHistory({team:input.team,opponent:input.opponent,seasons:input.seasons,venue:input.venue,result:input.result,limit:input.limit})})}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Historical result query failed."},{status:400})}}
