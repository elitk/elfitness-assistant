import type { NextConfig } from "next";
import { URL } from "url";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    // remotePatterns: [new URL("https://static.vecteezy.com/system/resources/previews/009/734/564/non_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg")]
    remotePatterns: [new URL("https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png")]
  }
};

export default nextConfig;
