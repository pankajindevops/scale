/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        NEXTAUTH_URL: "http://localhost:3000",
        MONGODB_URI: "mongodb://localhost:27017/scaledb",
        MONGODB_URL: "mongodb://localhost:27017/",
        EMAIL_ADDRESS: "no-reply@scale.ac",
        AWS_ACCESS_KEY_ID: '',
        AWS_SECRET_ACCESS_KEY: '',
        AWS_REGION: '',
        AWS_S3_IMG_BUCKET_NAME: '',
        AWS_S3_DOC_BUCKET_NAME: '',
        CLOUDINARY_CLOUD_NAME: '',
        CLOUDINARY_API_KEY: '',
        CLOUDINARY_API_SECRET: '',
        NEXTAUTH_SECRET: "skhkasdkas",
        SECRET: "RAMDOM_STRING",
        SMTP_HOST: "mail.youremail.com",
        SMTP_PORT: "465",
        SMTP_USER: "team@scale.ac",
        SMTP_PASSWORD: "asdsd",
        SMTP_FROM: "team@scale.ac",
        GITHUB_SECRET: "",
        GITHUB_ID: "",
        NEXT_GOOGLE_CLIENT_ID: "",
        NEXT_GOOGLE_CLIENT_SECRET: "",
        NEXT_GOOGLE_API_KEY: "",
        NEXT_LINKEDIN_CLIENT_ID: "",
        NEXT_LINKEDIN_CLIENT_SECRET: "",
        NEXT_FACEBOOK_CLIENT_ID: "",
        NEXT_FACEBOOK_CLIENT_SECRET: "",
        NEXT_PUBLIC_MICROSOFT_CLIENT_ID: "",
        NEXT_PUBLIC_MICROSOFT_AUTHORITY: "",
        NEXT_PUBLIC_MICROSOFT_REDIRECT_URI: "http://localhost:3000",
        TWITTER_CLIENT_ID: "",
        TWITTER_CLIENT_SECRET: "",
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.s3.amazonaws.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
}

module.exports = nextConfig
