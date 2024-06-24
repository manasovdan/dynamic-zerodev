import { useCallback, useRef, useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import contractAbi from "./0x34bE7f35132E97915633BC1fc020364EA5134863.json";

import "./transaction.css";

import Loading from "./Loading.tsx";
import Typewriter from "./Typewriter.tsx";


import {
  useDynamicContext,
  usePasskeyRecovery,
} from "@dynamic-labs/sdk-react-core";

import { isZeroDevConnector } from "@dynamic-labs/ethereum-aa";
import {encodeFunctionData} from "viem";

const nftAddress = "0x17c4bb82d2f8b3220f508c0a4ef6be52be061701";

function Transaction() {
  const [isMinting, setIsMinting] = useState(false);
  const [hasMinted, setHasMinted] = useState(false);
  const { initPasskeyRecoveryProcess } = usePasskeyRecovery();
  const { primaryWallet, user } = useDynamicContext();
  const { address, isConnected } = useAccount();

  const alias = user?.alias || "Anon";

  const { data: balance = 0, refetch } = useContractRead({
    address: nftAddress,
    abi: contractAbi,
    functionName: "balanceOf",
    args: [address],
    // enabled: isConnected,
  });

  const mint = useCallback(async () => {
    const vcs = user?.verifiedCredentials;

    const verifiedCredential = vcs?.find((vc) => vc.walletName === "turnkeyhd");
    const hasAuthenticator =
      verifiedCredential?.walletProperties?.isAuthenticatorAttached;

    if (!hasAuthenticator) {
      await initPasskeyRecoveryProcess();
    }

    const connector = primaryWallet?.connector;

    if (!connector) {
      console.error("no connector");
      return;
    }

    setIsMinting(true);

    if (isZeroDevConnector(connector)) {
      try {
        const kernelClient = connector.getAccountAbstractionProvider();

        if (!kernelClient) return;

          const userOp = {
            target: nftAddress as `0x${string}`,
            data: encodeFunctionData({
              abi: contractAbi,
              functionName: "mint",
              args: [address , BigInt(1)],
            }) as `0x${string}`,
          };
          const hash = await kernelClient.sendUserOperation(userOp);

        //   const hash = await kernelClient.sendUserOperation([
        //   {
        //     callData: await kernelClient.account!.encodeCallData({
        //       abi: contractAbi,
        //       args: [address],
        //       functionName: "mint",
        //     }),
        //     target: nftAddress as `0x${string}`,
        //   },
        // ]);


        // const userOpHash = await kernelClient.sendUserOperation({
        //   userOperation: {
        //     callData: await kernelClient.account!.encodeCallData({
        //       to: nftAddress as `0x${string}`,
        //       value: BigInt(0),
        //       data: encodeFunctionData({
        //         abi: contractAbi,
        //         functionName: "mint",
        //         args: [address, BigInt(1)],
        //       }),
        //     }),
        //   },
        // })


        console.log(hash);
        setIsMinting(false);
        setHasMinted(true);
      } catch (e) {
        setIsMinting(false);
        console.log(e);
      }
    }
  }, [address, initPasskeyRecoveryProcess, user?.verifiedCredentials, primaryWallet?.connector]);

  const interval = useRef<any>();

  const handleClick = useCallback(() => {
    mint();
    interval.current = setInterval(() => {
      refetch();
    }, 1000);
    setTimeout(() => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    }, 100000);
  }, [mint, refetch]);

  useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current);
    }
  }, [balance, interval]);

  const mintAgain = () => {
    setHasMinted(false);
    setIsMinting(false);
    return handleClick();
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1rem",
        paddingTop: "2rem",
      }}
    >
      {isConnected && (
        <>
          {hasMinted && (
            <>
              <strong style={{ fontSize: "1.5rem" }}>NFT Count</strong>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "medium",
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  border: "10px solid #2B8DE3",
                }}
              >{`${balance ?? 0}`}</div>
            </>
          )}
          {!isMinting && !hasMinted && (
            <Typewriter
              text={`Hey ${alias}, let's get you your first two NFTs! Click Mint below.`}
            />
          )}
          <Loading isLoading={isMinting} />
          {primaryWallet && !hasMinted && (
            <button className="mint-button" onClick={() => handleClick()}>
              Mint
            </button>
          )}
          {primaryWallet && hasMinted && (
            <button className="mint-button" onClick={() => mintAgain()}>
              Mint Again
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default Transaction;
