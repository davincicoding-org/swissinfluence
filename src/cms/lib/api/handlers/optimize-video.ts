import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import StreamPot from "@streampot/client";
import { currentConfig } from "../../config";

// Initialize StreamPot
const streampot = new StreamPot({
  secret: "WmfDK1mEd8ub7vpvT3m1kuVEhMKi75IRI1lHuo5s57ab641b",
});

export const handleOptimizeVideo = async (req: NextRequest) => {
  // try {
  const formData = await req.formData();
  const file = z.instanceof(File).parse(formData.get("file"));

  const tempFile = await currentConfig.uploadTempFile(file);

  const { outputs } = await streampot
    .input(tempFile.publicUrl)
    .output("output.mp4")
    .output("output.webm")
    .runAndWait();

  await tempFile.delete();

  return NextResponse.json(
    Object.entries(outputs).map(([name, src]) => ({
      src,
      type: `video/${name.split(".")[1]}`,
      name,
    })),
  );
  // } catch (error) {
  //   console.error("Error processing video:", error);
  //   return NextResponse.json(
  //     { error: "Video processing failed", details: error.message },
  //     { status: 500 },
  //   );
  // }
};
