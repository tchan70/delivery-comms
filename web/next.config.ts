import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // web/ has its own lockfile beside the API's, so Next cannot infer the
  // workspace root and warns. The app uses no files outside web/.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
