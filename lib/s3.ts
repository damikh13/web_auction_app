import { env } from "@/env";
import {
    S3Client,
    ListBucketsCommand,
    ListObjectsV2Command,
    GetObjectCommand,
    PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3_client = new S3Client({
    region: "auto",
    endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
    },
});

export async function get_signed_url_for_s3_obj(key: string) {
    return await getSignedUrl(
        S3_client,
        new PutObjectCommand({
            Bucket: env.CLOUDFLARE_BUCKET_NAME,
            Key: key,
        }),
        { expiresIn: 3600 }
    );
}