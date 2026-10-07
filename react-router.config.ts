import type { Config } from "@react-router/dev/config";

import { allPaths } from "./app/lib/paths";

export default {
  ssr: false,
  prerender: { paths: allPaths(), concurrency: 4 },
} satisfies Config;
