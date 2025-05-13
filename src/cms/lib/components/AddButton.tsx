import { Button, type ButtonProps } from "@mui/material";
import { useSimpleFormIterator } from "react-admin";
import { IconPlus } from "@tabler/icons-react";

export interface IAddButtonProps
  extends Omit<ButtonProps, "children" | "onClick"> {
  label: string;
}
export function AddButton({ label, ...buttonProps }: IAddButtonProps) {
  const { add } = useSimpleFormIterator();

  return (
    <Button
      variant="outlined"
      startIcon={<IconPlus size={16} />}
      onClick={() => add()}
      {...buttonProps}
    >
      {label}
    </Button>
  );
}
