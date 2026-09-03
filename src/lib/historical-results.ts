import { readFile } from "node:fs/promises";
import path from "node:path";

export type HistoricalMatch={season:string;fixtureId:number;gameweek:number;kickoffTime:string;homeTeam:string;homeScore:number;awayTeam:string;awayScore:number};
export type MatchHistoryQuery={team:string;opponent?:string;seasons?:string[];venue?:"all"|"home"|"away";result?:"W"|"D"|"L";limit?:number};

let matchesPromise:Promise<HistoricalMatch[]>|undefined;
const defaultSeasons=["2023-24","2024-25","2025-26"];
const normalise=(value:string)=>value.trim().toLowerCase();

function csvRow(line:string){const cells:string[]=[];let cell="",quoted=false;for(let index=0;index<line.length;index+=1){const char=line[index];if(char==='"'){if(quoted&&line[index+1]==='"'){cell+='"';index+=1}else quoted=!quoted}else if(char===","&&!quoted){cells.push(cell);cell=""}else cell+=char}cells.push(cell);return cells}

async function loadMatches(){if(!matchesPromise)matchesPromise=readFile(path.join(process.cwd(),"data","premier-league-results.csv"),"utf8").then(raw=>raw.trim().split(/\r?\n/).slice(1).map(csvRow).map(row=>({season:row[0],fixtureId:Number(row[1]),gameweek:Number(row[2]),kickoffTime:row[3],homeTeam:row[5],homeScore:Number(row[6]),awayTeam:row[8],awayScore:Number(row[9])})).filter(match=>match.homeTeam&&match.awayTeam));return matchesPromise}

function perspective(match:HistoricalMatch,team:string){const home=normalise(match.homeTeam)===normalise(team);const scored=home?match.homeScore:match.awayScore,conceded=home?match.awayScore:match.homeScore;return {home,scored,conceded,result:scored===conceded?"D":scored>conceded?"W":"L" as "W"|"D"|"L"}}

export async function queryMatchHistory(query:MatchHistoryQuery){const team=normalise(query.team),opponent=query.opponent?normalise(query.opponent):undefined,seasons=(query.seasons??defaultSeasons).map(normalise),venue=query.venue??"all",result=query.result;const matches=await loadMatches();const filtered=matches.filter(match=>{const isHome=normalise(match.homeTeam)===team,isAway=normalise(match.awayTeam)===team;if(!isHome&&!isAway)return false;if(opponent&&normalise(isHome?match.awayTeam:match.homeTeam)!==opponent)return false;if(seasons&&!seasons.includes(normalise(match.season)))return false;const detail=perspective(match,query.team);return (venue==="all"||venue===(detail.home?"home":"away"))&&(!result||detail.result===result)}).sort((a,b)=>b.kickoffTime.localeCompare(a.kickoffTime));return filtered.slice(0,Math.min(Math.max(query.limit??20,1),100)).map(match=>{const detail=perspective(match,query.team);return {...match,team:query.team,opponent:detail.home?match.awayTeam:match.homeTeam,venue:detail.home?"home":"away",teamScore:detail.scored,opponentScore:detail.conceded,result:detail.result}})}

export async function queryHeadToHead(query:{teamA:string;teamB:string;seasons?:string[];venue?:"all"|"home"|"away"}){const matches=await queryMatchHistory({team:query.teamA,opponent:query.teamB,seasons:query.seasons,venue:query.venue,limit:100});const summary=matches.reduce((totals,match)=>({...totals,[match.result]:totals[match.result]+1}),{W:0,D:0,L:0});return {teamA:query.teamA,teamB:query.teamB,seasons:query.seasons??["2023-24","2024-25","2025-26"],venue:query.venue??"all",summary:{matches:matches.length,teamAWins:summary.W,draws:summary.D,teamBWins:summary.L},matches}}
