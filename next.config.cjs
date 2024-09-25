const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

module.exports = () => {
    const rewrites = () => {
        return [
            {
                source: '/api/:path*',
                destination: `${API_URL}/:path*`
            },
        ]
    };
    return {
        rewrites
    }
};
