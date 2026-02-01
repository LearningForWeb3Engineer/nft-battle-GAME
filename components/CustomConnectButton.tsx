"use client";

import { useActiveAccount, useConnect, useDisconnect } from "thirdweb/react";
import { client } from "../client";
import { sepolia } from "thirdweb/chains";
import { createWallet } from "thirdweb/wallets";

export default function CustomConnectButton() {
  const account = useActiveAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = async () => {
    const wallets = [
      createWallet("io.metamask"),
      createWallet("com.coinbase.wallet"),
      createWallet("me.rainbow"),
    ];

    try {
      await connect(async () => {
        const wallet = createWallet("io.metamask");
        await wallet.connect({
          client,
          chain: sepolia,
        });
        return wallet;
      });
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  if (account) {
    return (
      <div className="flex items-center gap-3">
        <div className="bg-gray-700 px-4 py-2 rounded-lg text-white text-sm">
          {account.address.slice(0, 6)}...{account.address.slice(-4)}
        </div>
        <button
          onClick={() => disconnect(account)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          斷開連接
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
    >
      連接錢包
    </button>
  );
}
