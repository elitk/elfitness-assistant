import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // remotePatterns: [new URL("https://static.vecteezy.com/system/resources/previews/009/734/564/non_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg")]

    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;