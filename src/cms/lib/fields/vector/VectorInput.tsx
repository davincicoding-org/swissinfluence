import { useCallback } from "react";

import { TextInput, type TextInputProps } from "react-admin";
import { useDropzone } from "react-dropzone";
import { useController } from "react-hook-form";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IVectorInputProps extends TextInputProps {}

export function VectorInput({ ...inputProps }: IVectorInputProps) {
  const { field } = useController({
    name: inputProps.source,
  });

  const onDrop = useCallback(async ([file]: Array<File>) => {
    if (!file) return;
    const content = await file.text();

    field.onChange(content);
    // Do something with the files
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- ignore
    onDrop,
    accept: { "image/svg+xml": [".svg"] },
  });

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
    >
      <TextInput
        placeholder="Paste SVG here"
        rows={10}
        variant="outlined"
        sx={{ ".MuiInputBase-input": { whiteSpace: "pre" } }}
        {...inputProps}
        multiline
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 8,
          marginBottom: inputProps.helperText !== false ? 26 : undefined,
        }}
      >
        {field.value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt="SVG Preview"
            src={`data:image/svg+xml;utf8,${encodeURIComponent(String(field.value))}`}
            style={{
              height: "240px",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              backgroundColor: "#424242",
              borderRadius: 4,
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the SVG here ...</p>
            ) : (
              <p>Drop an SVG here, or click to select</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
