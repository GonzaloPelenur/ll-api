/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_SECRET: process.env.SPOTIFY_SECRET,
    SECRET: process.env.SECRET,
  },
};

export default nextConfig;
