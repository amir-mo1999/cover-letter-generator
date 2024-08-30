import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { useCoverLetters } from "../hooks";
import React from "react";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandIcon from "@mui/icons-material/Expand";
import { removeCoverLetter } from "../utils";

const CoverLettersList: React.FC = () => {
  const [coverLetters] = useCoverLetters();

  const onDelete = (indx: number) => {
    const f = () => {
      removeCoverLetter(indx);
    };
    return f;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        height: "100%",
      }}
    >
      {coverLetters.map((coverLetter, indx) => (
        <Paper
          key={indx}
          elevation={8}
          sx={{
            padding: "10px",
            margin: "10px",
            overflow: "clip",
          }}
        >
          <Box paddingBottom={1}>
            <Box
              paddingBottom={0.5}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <Typography fontWeight="bold">{coverLetter.company}</Typography>
              <Typography fontWeight="bold">{coverLetter.job_title}</Typography>
              <Typography
                sx={{ fontWeight: "light", fontSize: 14, flex: 1 }}
                align="right"
              >
                {coverLetter.generated_at}
              </Typography>
            </Box>
            <Link href={coverLetter.job_url} underline="hover" target="_blank">
              {coverLetter.job_url}
            </Link>
          </Box>
          <Divider></Divider>
          <Typography maxHeight={100} overflow="clip" paddingTop="5px">
            {coverLetter.cover_letter}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Button variant="contained">
              <ExpandIcon />
            </Button>
            <Button variant="contained">
              <ContentCopyIcon />
            </Button>
            <Button onClick={onDelete(indx)} variant="contained">
              <DeleteIcon />
            </Button>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default CoverLettersList;
