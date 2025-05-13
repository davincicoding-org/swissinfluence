import { type ReactNode, useState } from "react";

import {
  Collapse,
  Divider,
  MenuItem,
  Typography,
  ListItemText,
} from "@mui/material";
import { useSidebarState } from "react-admin";

interface ISubmenuProps {
  text: string;
  children: ReactNode;
}

export function Submenu({ text, children }: ISubmenuProps) {
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <MenuItem onClick={handleClick}>
        <ListItemText primary={text} />
      </MenuItem>
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        sx={{
          "& .RaMenuItemLink-icon": {
            paddingLeft: 1,
          },
        }}
      >
        {children}
      </Collapse>
    </>
  );
}

export function MenuDivider({ label }: { label?: string }) {
  const [sidebarIsOpen] = useSidebarState();
  return (
    <Divider flexItem textAlign="left" sx={{ width: "100%", my: 1 }}>
      {label && sidebarIsOpen ? (
        <Typography variant="caption" color="textSecondary">
          {label}
        </Typography>
      ) : null}
    </Divider>
  );
}
