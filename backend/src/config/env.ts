export const env = {
    port: process.env.PORT || 4000,
    databaseUrl: process.env.DATABASE_URL || '',
    frontendUrl: process.env.FRONTEND_URL || '',
    reqresApiKey: process.env.REQRES_API_KEY || '',
    nodeEnv: process.env.NODE_ENV || 'development',
};