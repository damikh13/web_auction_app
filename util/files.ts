import { env } from "@/env";

export function get_image_url(file_key: string) {
    return `${env.NEXT_PUBLIC_BUCKET_URL}/${file_key}`;
}
