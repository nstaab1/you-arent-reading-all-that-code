import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // The empty prefix reads plain environment variables, so the end-to-end
  // flows can start the app on ports that leave `npm run dev` alone.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    server: {
      port: Number(env.WEB_PORT ?? 5173),
      strictPort: true,
      proxy: {
        '/api': `http://localhost:${env.FEED_PORT ?? 4000}`,
      },
    },
  };
});
