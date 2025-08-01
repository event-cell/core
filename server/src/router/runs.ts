import { initTRPC } from '@trpc/server';
import { z } from 'zod';

import { getCurrentHeat } from '../utils/index.js';

const t = initTRPC.create();

export const runs = t.router({
  count: t.procedure
    .output(z.number())
    .query(() => getCurrentHeat()),
});
