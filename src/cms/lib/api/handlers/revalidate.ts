import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const REVALIDATE_TOKEN = "PXC2dxjBjl/ix2aeP/9lsztsslW1EgNIYR/u3G3i0Mc=";

export const revalidateCMS = async () => {
  const headersList = await headers();
  const authHeader = headersList.get("Authorization");

  if (!authHeader || authHeader !== `Bearer ${REVALIDATE_TOKEN}`)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    revalidateTag("cms");
    return NextResponse.json({ message: "Cache invalidated" }, { status: 200 });
  } catch (_error) {
    return NextResponse.json(
      { message: "Failed to invalidate cache" },
      { status: 500 },
    );
  }
};
