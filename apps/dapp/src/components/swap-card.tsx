"use client";

import React from "react";
import { ERC2MODULE_PRECOMPILE_ADDRESS } from "@bera/berajs";
import { ConnectButton } from "@bera/shared-ui";
import { Button } from "@bera/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@bera/ui/card";
import { Icons } from "@bera/ui/icons";

import { SwapKind, useSwap } from "~/hooks/useSwap";
import { ApproveTokenButton } from "./approve-token-button";
import PreviewDialog from "./preview-dialog";
import { SettingsPopover } from "./settings-popover";
import SwapInput from "./token-input";

export function SwapCard() {
  const {
    payload,
    setSwapKind,
    isConnected,
    setSelectedFrom,
    selectedFrom,
    allowance,
    selectedTo,
    fromAmount,
    setFromAmount,
    toAmount,
    setToAmount,
    previewSwapAmount,
    setSelectedTo,
  } = useSwap();

  console.log("payload", payload);
  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle className="center flex justify-between">
          Swap <SettingsPopover />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col gap-4">
          <SwapInput
            selected={selectedFrom}
            selectedTokens={[selectedFrom, selectedTo]}
            onTokenSelection={setSelectedFrom}
            amount={fromAmount ?? 0}
            setAmount={(amount) => {
              setSwapKind(SwapKind.GIVEN_IN);
              setFromAmount(Number(amount));
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 rounded-full hover:bg-transparent"
            onClick={() => {
              setSelectedFrom(selectedTo);
              setSelectedTo(selectedFrom);
            }}
          >
            <Icons.swap className="h-8 w-8" />
          </Button>

          <SwapInput
            selected={selectedTo}
            selectedTokens={[selectedFrom, selectedTo]}
            // onTokenSelection={setSelectedTo}
            amount={toAmount}
            setAmount={(amount) => {
              setSwapKind(SwapKind.GIVEN_OUT);
              setToAmount(Number(amount));
            }}
            hideBalance
            selectable={false}
          />

          {(Number(allowance?.formattedAllowance) ?? 0) < fromAmount ? (
            <ApproveTokenButton
              token={selectedFrom}
              spender={ERC2MODULE_PRECOMPILE_ADDRESS}
            />
          ) : isConnected ? (
            <PreviewDialog
              toToken={selectedTo}
              fromToken={selectedFrom}
              fromAmount={fromAmount ?? 0}
              toAmount={previewSwapAmount ?? 0}
              payload={payload}
            />
          ) : (
            <ConnectButton />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
