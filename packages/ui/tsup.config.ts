import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@/lib/utils',
    '@/components/ui/*',
    '@/hooks/use-toast',
    '@/hooks/use-mobile'
  ],
  banner: {
    js: '"use client"',
  },
})
