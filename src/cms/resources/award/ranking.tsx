import { ImageInput } from "@davincicoding/cms/image";
import { Fieldset } from "@davincicoding/cms/layout";
import { Box, Button, Card, Chip } from "@mui/material";
import { IconConfetti } from "@tabler/icons-react";
import {
  ArrayInput,
  required,
  SimpleFormIterator,
  useSimpleFormIteratorItem,
} from "react-admin";
import { useController, useWatch } from "react-hook-form";

import type { IDocumentChoice } from "../../hooks";
import type { ICategoryDocument } from "../category/schema";
import type { IInfluencerDocument } from "../influencer/schema";
import type { IAwardDocument } from "./schema";
import { useDocumentChoices } from "../../hooks";

export function RankingSection() {
  const { field, fieldState } = useController<IAwardDocument, "ranking">({
    name: "ranking",
  });

  const categories = useWatch<IAwardDocument, "categories">({
    name: "categories",
  });
  const influencerChoices = useDocumentChoices<IInfluencerDocument>(
    "influencers",
    ({ name }) => name,
  );
  const categoryChoices = useDocumentChoices<ICategoryDocument>(
    "categories",
    ({ name }) => name.en,
  );

  const resolvedCategories = categories.reduce<
    Array<{ category: IDocumentChoice; nominees: Array<IDocumentChoice> }>
  >((acc, { category: categoryID, nominees: nomineesIDs }) => {
    const category = categoryChoices.items.find(({ id }) => id === categoryID);
    if (!category) return acc;

    const nominees = (nomineesIDs ?? []).reduce<Array<IDocumentChoice>>(
      (accNominees, nomineeID) => {
        const nominee = influencerChoices.items.find(
          ({ id }) => id === nomineeID,
        );
        if (!nominee) return accNominees;
        return [...accNominees, nominee];
      },
      [],
    );

    return [...acc, { category, nominees }];
  }, []);

  // FIXME this causes an error in the ArrayInput
  const handleInitRanking = () =>
    field.onChange(
      categories.reduce(
        (acc, { category, nominees }) => ({
          ...acc,
          [category]: {
            winnerImage: null,
            ranking: nominees,
          },
        }),
        {},
      ),
    );

  if (!field.value)
    return (
      <Button type="button" onClick={handleInitRanking}>
        Setup Ranking
      </Button>
    );

  return (
    <>
      {fieldState.invalid ? (
        <div style={{ display: "flex", justifyContent: "end", width: "100%" }}>
          <Button
            color="warning"
            type="button"
            onClick={() => field.onChange(null)}
          >
            Reset Ranking
          </Button>
        </div>
      ) : null}
      <Box
        sx={{
          display: "flex",
          alignItems: "start",
          gap: 2,
          paddingRight: 2,
        }}
      >
        {resolvedCategories.map(({ category, nominees }) => (
          <Fieldset key={category.id} label={category.name}>
            <AwardCategoryRanking
              categoryID={category.id}
              nominees={nominees}
            />
          </Fieldset>
        ))}
      </Box>
    </>
  );
}

function AwardCategoryRanking({
  categoryID,
  nominees,
}: {
  categoryID: ICategoryDocument["id"];
  nominees: Array<IDocumentChoice>;
}) {
  const ranking = useWatch<IAwardDocument, `ranking.${string}.ranking`>({
    name: `ranking.${categoryID}.ranking`,
  });
  return (
    <Box sx={{ width: 300, display: "grid", gap: 2 }}>
      <ImageInput
        label={false}
        source={`ranking.${categoryID}.winnerImage`}
        aspectRatio={1}
        PlaceholderIcon={IconConfetti}
        validate={required("Add a winner Image")}
        optimization={{
          compression: "profile-picture",
          resize: { square: 600 },
        }}
      />

      <ArrayInput
        label={false}
        source={`ranking.${categoryID}.ranking`}
        helperText={false}
        validate={required("Add category ranking")}
      >
        <SimpleFormIterator
          disableClear
          disableRemove
          disableAdd
          sx={{
            ".RaSimpleFormIterator-line": {
              borderBottom: "none",
            },
            ".RaSimpleFormIterator-form": {
              borderBottom: "none",
              minWidth: 0,
            },
            ".RaSimpleFormIterator-action": { marginBlock: "auto" },
            ".RaSimpleFormIterator-list:empty": {
              marginTop: "0.5rem",
            },
          }}
        >
          <RankedInfluencer ranking={ranking} nominees={nominees} />
        </SimpleFormIterator>
      </ArrayInput>
    </Box>
  );
}

function RankedInfluencer({
  ranking,
  nominees,
}: {
  ranking: Array<IInfluencerDocument["id"]>;
  nominees: Array<IDocumentChoice>;
}) {
  const { index } = useSimpleFormIteratorItem();
  const value = ranking[index];
  const choice = nominees.find(({ id }) => id === value);

  return (
    <Card
      variant="outlined"
      sx={{
        padding: 1,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      <Chip
        size="small"
        color="primary"
        sx={{ marginRight: 2 }}
        label={index + 1}
      />
      <span>{choice?.name}</span>
    </Card>
  );
}
