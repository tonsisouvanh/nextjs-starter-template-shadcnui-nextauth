'use client';

import { QueryClientProvider, QueryClient, DefaultOptions } from '@tanstack/react-query';
import { useState } from 'react';

const defaultQueryClientOptions: DefaultOptions = {
  queries: {
    retry: 2, // Retry failed requests up to 3 times
  },
};

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: defaultQueryClientOptions }));

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
