import nextJest from 'next/jest.js';

// next/jest compiles TSX with Next's own compiler, reads next.config and
// .env files, and stubs CSS Modules and images.
const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
};

export default createJestConfig(config);
