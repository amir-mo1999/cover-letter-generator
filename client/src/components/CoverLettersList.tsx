import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";

import { useCoverLetters } from "../hooks";
import React from "react";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandIcon from "@mui/icons-material/Expand";
import { removeCoverLetter } from "../utils";
import { useState } from "react";

const CoverLettersList: React.FC = () => {
  const [coverLetters] = useCoverLetters();
  const [toExpandIndx, setToExpandIndx] = useState<number>();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarText, setSnackbarText] = useState<string>("");

  const onDelete = (indx: number) => {
    const f = () => {
      removeCoverLetter(indx);
    };
    return f;
  };

  const onClickExpand = (indx: number) => {
    const f = () => {
      if (indx === toExpandIndx) setToExpandIndx(undefined);
      else setToExpandIndx(indx);
    };
    return f;
  };

  const onClickCopy = (indx: number) => {
    console.log(snackbarOpen, snackbarText);
    const fallbackCopyTextError = () => {
      setSnackbarOpen(true);
      setSnackbarText("Could not Copy Cover Letter to Clipboard");
    };

    const fallbackCopyTextSuccess = () => {
      setSnackbarOpen(true);
      setSnackbarText("Copied");
    };

    const f = () => {
      if (!navigator.clipboard || !navigator.clipboard.writeText)
        fallbackCopyTextError();
      else {
        navigator.clipboard
          .writeText(coverLetters[indx].cover_letter)
          .then(() => {
            fallbackCopyTextSuccess();
          })
          .catch(() => {
            fallbackCopyTextError();
          });
      }
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
          <Typography
            maxHeight={indx === toExpandIndx ? undefined : 140}
            overflow="clip"
            sx={{ whiteSpace: "pre-line", paddingY: 1 }}
          >
            {coverLetter.cover_letter}
          </Typography>
          <Divider></Divider>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              paddingTop: 1,
            }}
          >
            <Button onClick={onClickExpand(indx)} variant="contained">
              <ExpandIcon />
            </Button>
            <Button onClick={onClickCopy(indx)} variant="contained">
              <ContentCopyIcon />
            </Button>
            <Button onClick={onDelete(indx)} variant="contained">
              <DeleteIcon />
            </Button>
          </Box>
        </Paper>
      ))}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={100000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <SnackbarContent
          message={snackbarText}
          sx={{
            textAlign: "center",
            justifyContent: "center",
          }}
        />
      </Snackbar>
    </Box>
  );
};

export default CoverLettersList;
