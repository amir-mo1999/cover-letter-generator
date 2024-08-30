import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Autocomplete from "@mui/material/Autocomplete";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import { CoverLetter } from "../types";
import { useCoverLetters } from "../hooks";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandIcon from "@mui/icons-material/Expand";
import { pushCoverLetter, removeCoverLetter } from "../utils";
import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import theme from "../theme";

const CoverLettersList: React.FC = () => {
  const [coverLetters] = useCoverLetters();
  const [toExpandIndx, setToExpandIndx] = useState<number>();
  const [copySnackbarOpen, setCopySnackbarOpen] = useState<boolean>(false);
  const [deleteSnackbarOpen, setDeleteSnackbarOpen] = useState<boolean>(false);
  const [copySnackbarText, setCopySnackbarText] = useState<string>("");
  const [deletedCoverLetter, setDeletedCoverLetter] = useState<CoverLetter>();
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>("");
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [hiddenIndices, setHiddenIndices] = useState<number[]>([]);
  const [companies, setCompanies] = useState<Array<string>>([]);

  const updateHiddenIndices = () => {
    const excludedIndices: number[] = [];

    coverLetters.forEach((coverLetter, index) => {
      let isCompanySelected: boolean = true;
      if (selectedCompanies.length > 0)
        isCompanySelected = selectedCompanies.includes(coverLetter.company);

      const isJobTitleMatching = coverLetter.job_title
        .toLowerCase()
        .includes(selectedJobTitle.toLowerCase());

      if (!isCompanySelected || !isJobTitleMatching) {
        excludedIndices.push(index);
      }
    });
    setHiddenIndices(excludedIndices);
  };

  useEffect(updateHiddenIndices, [
    selectedCompanies,
    selectedJobTitle,
    coverLetters,
  ]);

  const updateCompanies = () => {
    const aux = coverLetters.map((coverLetter) => coverLetter.company);
    setCompanies(Array.from(new Set(aux)));
  };
  useEffect(updateCompanies, [coverLetters]);

  const onChangeSelectedCompanies = (
    _: React.SyntheticEvent<Element, Event>,
    newValue: string[]
  ) => {
    setSelectedCompanies(newValue);
  };

  const onChangeSearchJobTitle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSelectedJobTitle(e.target.value);
  };

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
      setCopySnackbarText("Cover Letter Copied");
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
        height: "100%",
      }}
    >
      <Box
        padding="10px"
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "centers",
          gap: 2,
        }}
      >
        <TextField
          value={selectedJobTitle}
          onChange={onChangeSearchJobTitle}
          placeholder="Job Title"
          sx={{
            width: 400,
            "& .MuiOutlinedInput-root": {
              borderRadius: "160px", // Adjust this value for more or less roundness
              backgroundColor: theme.palette.background.paper,
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            },
          }}
        ></TextField>
        <Autocomplete
          onChange={onChangeSelectedCompanies}
          multiple
          limitTags={3}
          options={companies}
          disablePortal
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{
                width: "full",
                minWidth: 400,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "160px",
                  backgroundColor: theme.palette.background.paper,
                },
                "& .MuiFilledInput-root": {
                  borderRadius: "160px",
                },
              }}
              placeholder="Company"
            />
          )}
        />
      </Box>
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
            elevation={5}
            sx={{
              display: hiddenIndices.includes(indx) ? "none" : undefined,
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
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ bgcolor: theme.palette.secondary.main }}
                />
                <Typography fontWeight="bold">
                  {coverLetter.job_title}
                </Typography>
                <Typography
                  sx={{ fontWeight: "light", fontSize: 14, flex: 1 }}
                  align="right"
                >
                  {coverLetter.generated_at}
                </Typography>
              </Box>
              <Link
                href={coverLetter.job_url}
                underline="hover"
                target="_blank"
              >
                {coverLetter.job_url}
              </Link>
            </Box>
            <Divider
              orientation="horizontal"
              flexItem
              sx={{ bgcolor: theme.palette.secondary.main }}
            />
            <Typography
              maxHeight={indx === toExpandIndx ? undefined : 140}
              overflow="clip"
              sx={{ whiteSpace: "pre-line", paddingY: 1 }}
            >
              {coverLetter.cover_letter}
            </Typography>
            <Divider
              orientation="horizontal"
              flexItem
              sx={{ bgcolor: theme.palette.secondary.main }}
            />

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
      </Box>
      <Snackbar
        open={copySnackbarOpen}
        autoHideDuration={2000}
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
