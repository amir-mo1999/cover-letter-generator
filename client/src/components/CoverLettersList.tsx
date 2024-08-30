import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useCoverLetters } from "../hooks";
import React from "react";

const CoverLettersList: React.FC = () => {
  const [coverLetters] = useCoverLetters();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          overflow: "auto",
        }}
      ></Box>
      {coverLetters.map((coverLetter, indx) => (
        <React.Fragment key={indx}>
          <Typography>{coverLetter.generated_at}</Typography>
          <Typography overflow="clip" maxHeight="100px">
            {coverLetter.cover_letter}
          </Typography>
        </React.Fragment>
      ))}
    </>
  );
};

export default CoverLettersList;
