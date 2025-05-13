import { Button, type ButtonProps } from "@mui/material";
import { IconPlus } from "@tabler/icons-react";
import { useSimpleFormIterator } from "react-admin";

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
