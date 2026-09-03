"use client";
import { useState } from "react";

const tools=[
  ["get_squad_context","Reads the loaded team, budget, free transfers, and scenarios."],
  ["query_players","Filters and ranks FPL players by any available statistic."],
  ["get_team_fixtures","Checks opponents and fixture difficulty."],
  ["get_team_results","Checks a team's wins, draws, losses, and results."],
  ["create_transfer_scenarios","Adds several legal hypothetical plans to the pitch at once."],
  ["create_squad_scenario","Builds a legal wildcard-style squad."],
];

export default function AgentPanel(){
  const [open,setOpen]=useState(false);
  return <section className="agent-panel">
    <button className="agent-toggle" type="button" onClick={()=>setOpen(value=>!value)} aria-expanded={open}>
      <span>ADD A TRANSFER STRATEGY</span><span>{open?"−":"+"}</span>
    </button>
    {open&&<div className="agent-body">
      <p>Ask ChatGPT while this planner tab is open. It reads the shared FPL state, then adds scenario tabs directly to this pitch.</p>
      <ol>
        <li>Load your team.</li>
        <li>Send ChatGPT a planning request.</li>
      </ol>
      <p className="prompt">“Create conservative, balanced, and aggressive transfer strategies. Keep Haaland and Bruno.”</p>
      <details>
        <summary>SHOW AGENT TOOLS ({tools.length})</summary>
        <ul>{tools.map(([name,description])=><li key={name}><code>{name}</code><span>{description}</span></li>)}</ul>
      </details>
    </div>}
  </section>
}
