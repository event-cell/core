import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { TRPCRouter } from 'server/src/router/index.js';

export const trpc = createTRPCClient<TRPCRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
}); 