import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import {DynamicWagmiConnector} from "@dynamic-labs/wagmi-connector";
import {EthereumWalletConnectors} from "@dynamic-labs/ethereum";
import {ZeroDevSmartWalletConnectors} from "@dynamic-labs/ethereum-aa";
import Transaction from "./Transaction.tsx";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <DynamicContextProvider
      settings={{
        // Find your environment id at https://app.dynamic.xyz/dashboard/developer
        environmentId: import.meta.env.VITE_DYNAMIC_ENVIRONMENT,
        walletConnectors: [EthereumWalletConnectors, ZeroDevSmartWalletConnectors],
      }}
    >
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <DynamicWidget/>
            <Transaction/>
          </DynamicWagmiConnector>
        </QueryClientProvider>
    </DynamicContextProvider>
  );
}
