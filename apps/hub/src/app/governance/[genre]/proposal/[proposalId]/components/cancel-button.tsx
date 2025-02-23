import {
  GOVERNANCE_ABI,
  Proposal,
  governanceTimelockAbi,
  useBeraJs,
  useCancellerRole,
  useProposalState,
} from "@bera/berajs";
import { governanceTimelockAddress } from "@bera/config";
import { ActionButton, useTxn } from "@bera/shared-ui";
import { Button } from "@bera/ui/button";
import { Address } from "viem";
import { useGovernance } from "~/app/governance/[genre]/components/governance-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@bera/ui/dialog";
import { StatusBadge } from "~/app/governance/components/status-badge";
import { StatusEnum } from "~/app/governance/types";
import { Checkbox } from "@bera/ui/checkbox";
import { useState } from "react";

export const CancelButton = ({
  proposal,
  proposalTimelockId,
  title,
}: {
  proposal?: Proposal;
  proposalTimelockId?: Address;
  title: string;
}) => {
  const { data: cancellerRole } = useCancellerRole();
  const { governorAddress } = useGovernance();

  const {
    data: onChainProposalState,
    isLoading,
    mutate,
  } = useProposalState({
    proposalId: proposal?.onchainId,
    governorAddress,
  });

  const { account } = useBeraJs();

  const { write, ModalPortal } = useTxn({
    message: "Cancelling proposal",
    onSuccess: mutate,
  });

  const [confirmed, setConfirmed] = useState(false);

  if (!proposal) {
    return null;
  }

  // This ensures user
  const isCanceledOnChain = !isLoading && onChainProposalState === "canceled";

  const canCancel =
    !isCanceledOnChain &&
    ((proposal.status === StatusEnum.PENDING_EXECUTION &&
      account === cancellerRole) ||
      (proposal.status === StatusEnum.PENDING &&
        account === proposal.creator.address));

  return (
    <>
      {ModalPortal}
      {canCancel ? (
        <Dialog>
          <DialogTrigger>
            <Button>Cancel</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Cancel Proposal</DialogTitle>
            <DialogDescription>
              <p className="mb-4">This is an irreversible action.</p>
              <div className="rounded-sm border border-border p-4 ">
                <h3 className="font-semibold mb-3 line-clamp-1 text-base hyphens-auto text-foreground">
                  {title}
                </h3>
                <StatusBadge proposal={proposal} />
              </div>
              <div className="mt-6 mb-2 flex items-center gap-2">
                <Checkbox
                  id="confirm"
                  checked={confirmed}
                  onCheckedChange={() => setConfirmed(!confirmed)}
                />
                <label
                  htmlFor="confirm"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I confirm that I want to cancel this proposal
                </label>
              </div>
            </DialogDescription>
            <DialogFooter>
              <ActionButton>
                {canCancel ? (
                  <ActionButton>
                    <Button
                      disabled={!confirmed}
                      variant="destructive"
                      className="w-full"
                      onClick={() =>
                        write({
                          address:
                            proposal.status === StatusEnum.PENDING_EXECUTION
                              ? governanceTimelockAddress
                              : governorAddress,
                          abi:
                            proposal.status === StatusEnum.PENDING_EXECUTION
                              ? governanceTimelockAbi
                              : GOVERNANCE_ABI,
                          functionName: "cancel",

                          params: [
                            proposal.status === StatusEnum.PENDING_EXECUTION
                              ? proposalTimelockId!
                              : proposal.status === StatusEnum.PENDING
                                ? BigInt(proposal.onchainId)
                                : // This should never happen
                                  0n,
                          ],
                        })
                      }
                    >
                      Cancel
                    </Button>
                  </ActionButton>
                ) : null}
              </ActionButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
};
