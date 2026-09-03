import { describe, expect, it } from "vitest";
import { validateSquad } from "./rules";
import { calculateFreeTransfers } from "./fpl";
const player=(id:number,position:any,teamId=1)=>({id,name:"x",webName:"x",teamId,team:"T",position,price:5,totalPoints:0,form:0,minutes:0,status:"a",chance:null,news:""});
describe("squad rules",()=>{it("enforces club maximum",()=>{const squad=[...Array.from({length:2},(_,i)=>player(i,"GKP",i+1)),...Array.from({length:5},(_,i)=>player(i+2,"DEF",i<4?1:i+3)),...Array.from({length:5},(_,i)=>player(i+7,"MID",i+8)),...Array.from({length:3},(_,i)=>player(i+12,"FWD",i+13))];expect(validateSquad(squad)?.code).toBe("MAX_PLAYERS_PER_CLUB")})});
describe("free-transfer calculation",()=>{it("rolls unused transfers and deducts current transfers",()=>{expect(calculateFreeTransfers([{event:1,event_transfers:0},{event:2,event_transfers:1}],3,0)).toBe(2);expect(calculateFreeTransfers([{event:1,event_transfers:0}],2,1)).toBe(1)})});
