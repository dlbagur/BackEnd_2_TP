process.loadEnvFile("./src/.env")

export const config={
    PORT: process.env.PORT || 8080,
    MONGO_URL: process.env.MONGO_URL,
    DB_NAME: process.env.DB_NAME,
    SECRET_SESSION: process.env.SECRET_SESSION,
    SECRET: process.env.SECRET
}
