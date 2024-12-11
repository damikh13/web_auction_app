import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "pub-ae637999cfca425ba6af10a9b6fbef1e.r2.dev",
                protocol: "https",
                port: "",
            },
            {
                hostname: "lh3.googleusercontent.com",
                protocol: "https",
                port: "",
            },
        ],
    },
};

export default nextConfig;
