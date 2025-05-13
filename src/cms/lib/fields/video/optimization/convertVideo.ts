import StreamPot from "@streampot/client";

const streampot = new StreamPot({
  secret: "WmfDK1mEd8ub7vpvT3m1kuVEhMKi75IRI1lHuo5s57ab641b",
});

export const convertVideo = async (inputPath: string) => {
  const { outputs } = await streampot
    .input(inputPath)
    .output("output.mp4")
    .output("output.webm")
    .runAndWait();

  return outputs;
};
