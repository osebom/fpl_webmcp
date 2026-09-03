"use client";
import { useEffect, useRef } from "react";
import type { Squad } from "@/lib/types";

type ModelContextDocument = Document & { modelContext?: { registerTool:(tool:unknown)=>Promise<void>|void } };

export default function DataTools({squad}:{squad:Squad|null}) {
  const squadRef=useRef(squad);
  squadRef.current=squad;
  useEffect(()=>{
    const api=(document as ModelContextDocument).modelContext;
    if(!api?.registerTool)return;
    const register=(tool:unknown)=>void Promise.resolve(api.registerTool(tool)).catch(()=>{});
    register({name:"get_player_stat_schema",description:"Discover all queryable FPL player fields, their types, and concise descriptions.",inputSchema:{type:"object",properties:{}},execute:async()=>fetch("/api/fpl/player-schema").then(response=>response.json())});
    register({name:"query_players",description:"Deterministically filter and rank cached FPL players using any discovered field. Supports clubs, positions, player IDs, filters, multi-field sorting, and small result limits.",inputSchema:{type:"object",properties:{positions:{type:"array",items:{type:"string"}},teams:{type:"array",items:{}},include_player_ids:{type:"array",items:{type:"number"}},exclude_player_ids:{type:"array",items:{type:"number"}},exclude_owned:{type:"boolean"},filters:{type:"array",items:{type:"object"}},sort:{},limit:{type:"number"}}},execute:async(input:any)=>{const excluded=[...(input.exclude_player_ids??[]),...(input.exclude_owned?squadRef.current?.players.map(player=>player.id)??[]:[])];return fetch("/api/fpl/player-query",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({...input,exclude_player_ids:excluded})}).then(response=>response.json())}});
    register({name:"get_team_fixtures",description:"Return a club's fixtures with opponent, venue, gameweek, FPL difficulty, scores, and completion state.",inputSchema:{type:"object",properties:{team_id:{type:"number"},gameweeks:{type:"array",items:{type:"number"}}},required:["team_id"]},execute:async(input:any)=>{const games=Array.isArray(input.gameweeks)?`&gameweeks=${input.gameweeks.join(",")}`:"";return fetch(`/api/fpl/team-context?teamId=${input.team_id}${games}`).then(response=>response.json())}});
    register({name:"get_team_results",description:"Return a club's season-to-date fixture results plus played, wins, draws, and losses.",inputSchema:{type:"object",properties:{team_id:{type:"number"}},required:["team_id"]},execute:async(input:any)=>fetch(`/api/fpl/team-context?mode=results&teamId=${input.team_id}`).then(response=>response.json())});
    register({name:"query_head_to_head_results",description:"Query local Premier League results from 2022-23 to 2025-26. Returns a head-to-head record and the underlying fixtures; defaults to the most recent three seasons. Use this instead of web search for historical match results.",inputSchema:{type:"object",properties:{team_a:{type:"string"},team_b:{type:"string"},seasons:{type:"array",items:{type:"string"}},venue:{type:"string",enum:["all","home","away"]}},required:["team_a","team_b"]},execute:async(input:any)=>fetch("/api/fpl/match-history",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({mode:"head_to_head",...input})}).then(response=>response.json())});
    register({name:"query_match_history",description:"Query local Premier League match history from 2022-23 to 2025-26 by club, optional opponent, venue, result, and seasons. Returns most recent matches first. Use this instead of web search for historical results.",inputSchema:{type:"object",properties:{team:{type:"string"},opponent:{type:"string"},seasons:{type:"array",items:{type:"string"}},venue:{type:"string",enum:["all","home","away"]},result:{type:"string",enum:["W","D","L"]},limit:{type:"number"}},required:["team"]},execute:async(input:any)=>fetch("/api/fpl/match-history",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(input)}).then(response=>response.json())});
  },[]);
  return null;
}
