import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import { CoverLetter } from "../types";
import { useCoverLetters } from "../hooks";
import React from "react";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandIcon from "@mui/icons-material/Expand";
import { pushCoverLetter, removeCoverLetter } from "../utils";
import { useState } from "react";

const CoverLettersList: React.FC = () => {
  const [coverLetters] = useCoverLetters();
  const [toExpandIndx, setToExpandIndx] = useState<number>();
  const [copySnackbarOpen, setCopySnackbarOpen] = useState<boolean>(false);
  const [deleteSnackbarOpen, setDeleteSnackbarOpen] = useState<boolean>(false);
  const [copySnackbarText, setCopySnackbarText] = useState<string>("");
  const [deletedCoverLetter, setDeletedCoverLetter] = useState<CoverLetter>();

  const onDelete = (indx: number) => {
    const f = () => {
      setDeleteSnackbarOpen(true);
      setDeletedCoverLetter(coverLetters[indx]);
      removeCoverLetter(indx);
    };
    return f;
  };

  const onUndoDelete = () => {
    if (deletedCoverLetter) {
      pushCoverLetter(deletedCoverLetter);
      setDeletedCoverLetter(undefined);
      setDeleteSnackbarOpen(false);
    }
  };

  const onClickExpand = (indx: number) => {
    const f = () => {
      if (indx === toExpandIndx) setToExpandIndx(undefined);
      else setToExpandIndx(indx);
    };
    return f;
  };

  const onClickCopy = (indx: number) => {
    const fallbackCopyTextError = () => {
      setCopySnackbarOpen(true);
      setCopySnackbarText("Could not Copy Cover Letter to Clipboard");
    };

    const fallbackCopyTextSuccess = () => {
      setCopySnackbarOpen(true);
      setCopySnackbarText("Copied");
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

  const handleCloseCopySnackbar = (
    _: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;

    setCopySnackbarOpen(false);
  };

  const handleCloseDeleteSnackbar = (
    _: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;

    setDeleteSnackbarOpen(false);
  };

  const deleteSnackbarAction = (
    <Button color="secondary" size="small" onClick={onUndoDelete}>
      UNDO
    </Button>
  );

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
        open={copySnackbarOpen}
        autoHideDuration={1000}
        onClose={handleCloseCopySnackbar}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <SnackbarContent
          message={copySnackbarText}
          sx={{
            textAlign: "center",
            justifyContent: "center",
          }}
        />
      </Snackbar>
      <Snackbar
        open={deleteSnackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseDeleteSnackbar}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <SnackbarContent
          message="Deleted Cover Letter"
          action={deleteSnackbarAction}
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
