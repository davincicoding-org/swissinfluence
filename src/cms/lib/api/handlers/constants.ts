import { NextResponse } from "next/server";
import type { ConstantsFetcher } from "./../../constants/config";

export const getConstants = async ({
  fetchConstants,
}: {
  fetchConstants: ConstantsFetcher;
}) => {
  const content = await fetchConstants();
  return NextResponse.json(content, { status: 200 });
};
