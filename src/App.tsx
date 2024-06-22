import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import {DynamicWagmiConnector} from "@dynamic-labs/wagmi-connector";
import {EthereumWalletConnectors} from "@dynamic-labs/ethereum";
import {ZeroDevSmartWalletConnectors} from "@dynamic-labs/ethereum-aa";
import Transaction from "./Transaction.tsx";
import {
  createConfig,
  WagmiProvider,
} from 'wagmi';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {http} from 'viem';
import {mainnet} from 'viem/chains';


const config = createConfig({
  chains: [mainnet],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function App() {
  return (
    <DynamicContextProvider
      settings={{
        // Find your environment id at https://app.dynamic.xyz/dashboard/developer
        environmentId: "REPLACE-WITH-YOUR-ENVIRONMENT-ID",
        walletConnectors: [EthereumWalletConnectors, ZeroDevSmartWalletConnectors],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <DynamicWidget/>
            <Transaction/>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
