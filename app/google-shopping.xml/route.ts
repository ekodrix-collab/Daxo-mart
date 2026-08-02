import { GET as getFeed } from "@/app/api/google-merchant/route";

export const revalidate = 3600;

export async function GET() {
  return getFeed();
}
