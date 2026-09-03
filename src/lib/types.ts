export type Position = "GKP" | "DEF" | "MID" | "FWD";
export type UpcomingFixture = { opponent:string; badgeUrl:string; home:boolean; difficulty:number };
export type Player = { id:number; name:string; webName:string; teamId:number; team:string; badgeUrl?:string; upcomingFixtures:UpcomingFixture[]; position:Position; price:number; totalPoints:number; form:number; minutes:number; status:string; chance:number | null; news:string; stats:Record<string,string|number|boolean|null> };
export type SquadPlayer = Player & { purchasePrice?:number; sellingPrice?:number; multiplier:number; isCaptain:boolean; isViceCaptain:boolean; benchOrder?:number };
export type Squad = { entryId:number; teamName:string; managerName:string; gameweek:number; bank:number | null; value:number | null; freeTransfers:number | null; lastGameweekPoints:number | null; bestGameweekPoints:number | null; averageGameweekPoints:number | null; players:SquadPlayer[] };
export type Transfer = { out:number; in:number };
export type Scenario = { id:string; label:string; description?:string; players:SquadPlayer[]; transfers:Transfer[]; hit:number; bank:number | null; createdAt:number };
