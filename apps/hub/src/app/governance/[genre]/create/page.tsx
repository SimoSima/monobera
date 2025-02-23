import React from "react";
import { type Metadata } from "next";
import NewProposal from "./components/new-proposal";
import { NativeDapps, PROPOSAL_GENRE } from "../../governance-genre-helper";

export const metadata: Metadata = {
  title: "Create Proposal",
  description: "Create a new proposal on Berachain",
};
export default function Create({
  params,
}: {
  params: any;
}) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <NewProposal genre={params.genre as PROPOSAL_GENRE} />
    </div>
  );
}

export async function generateStaticParams() {
  return NativeDapps.map((dapp) => ({
    genre: dapp.slug,
  }));
}
