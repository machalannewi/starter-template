import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
      remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
        pathname: '/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zOHZ2RnRVcENLczJ3dksyUTFEMlRxeEdsYUwiLCJyaWQiOiJ1c2VyXzM4eVRiU1JES3pFZHZtVThwcU9ZcFQ5WGRUaSIsImluaXRpYWxzIjoiQ0oifQ',
      },
    ]
  }
};

export default nextConfig;
