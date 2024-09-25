const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:slug*',
                destination: 'http://api-caaliope-lb-148792663.eu-west-3.elb.amazonaws.com/:slug*',
            },
        ];
    },
};

export default nextConfig;
