import { Box } from "@mui/material";
import { BooleanInput, DateInput, required, TextInput } from "react-admin";

import { Fieldset } from "../../components/layout";

export function EventSection() {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 4,
        width: "100%",
        alignItems: "start",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexShrink: 1,
          minWidth: "200px",
          maxWidth: "400px",
          gap: 1,
        }}
      >
        <TextInput
          source="title"
          variant="outlined"
          label="Title"
          validate={required("Add a Title")}
          helperText={false}
        />
        <DateInput source="date" variant="outlined" helperText={false} />
        <Fieldset legend="Location">
          <TextInput
            source="location.name"
            variant="outlined"
            label="Name"
            validate={required("Add a Location Name")}
            helperText={false}
          />
          <TextInput
            source="location.city"
            variant="outlined"
            label="City"
            validate={required("Add a City")}
            helperText={false}
          />
          <TextInput
            source="location.mapsURL"
            type="url"
            variant="outlined"
            label="Google Maps Link"
            validate={required("Add a Google Maps Link")}
            helperText={false}
          />
        </Fieldset>
        <Fieldset
          legend={
            <BooleanInput
              label="Ticket Sale"
              source="ticketSale.open"
              defaultValue
              helperText={false}
              sx={{
                ".MuiFormControlLabel-root": {
                  flexDirection: "row-reverse",
                  marginLeft: 1,
                  marginRight: 0,
                },
              }}
            />
          }
        >
          <TextInput
            source="ticketSale.url"
            type="url"
            variant="outlined"
            label="Tickets URL"
            helperText={false}
          />
        </Fieldset>
      </Box>
    </Box>
  );
}
