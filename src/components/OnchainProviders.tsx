'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia } from 'wagmi/chains';
import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { type ReactNode, useState } from 'react';
import { type State, WagmiProvider } from 'wagmi';

const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
      preference: 'smartWalletOnly',
      // @ts-ignore
      keysUrl: '', // TODO: add keys url
    }),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
  },
});

export function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          // @ts-ignore
          chain={baseSepolia}
          config={{
            appearance: {
              mode: 'auto',
              theme: 'base',
            },
          }}
        >
          {props.children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
