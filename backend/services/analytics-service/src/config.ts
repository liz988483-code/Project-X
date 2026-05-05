export const config = {
  port: Number(process.env.PORT || 3004),
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : ['*']
}
