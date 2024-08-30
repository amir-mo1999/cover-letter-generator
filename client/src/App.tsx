import "@fontsource/roboto/400.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { ResumeUpload, CoverLettersList } from "./components";
import { useResume } from "./hooks";
import { CoverLetter } from "./types";
import { useState, useEffect } from "react";
import { generateCoverLetter } from "./api";
import moment from "moment";
import { pushCoverLetter } from "./utils";
import theme from "./theme";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";

function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function App() {
  const resume = useResume();
  const [url, setUrl] = useState<string>("");
  const [disableGenerate, setDisableGenerate] = useState<boolean>();
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarText, setSnackbarText] = useState<string>("");

  const handleCloseSnackBar = (
    _: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;

    setOpenSnackbar(false);
  };

  // disable generate button if resume or url is not set
  const checkDisableGenerate = () => {
    if (resume === undefined || !isValidURL(url)) {
      setDisableGenerate(true);
    } else setDisableGenerate(false);
  };
  useEffect(checkDisableGenerate, [resume, url]);

  const onUrlChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUrl(e.target.value);
  };

  // generates new cover letter and pushes it to local storage
  const onClickCreate = () => {
    if (resume !== undefined)
      generateCoverLetter({ url: url, resume: resume.content }).then((res) => {
        if (res === null) {
          setOpenSnackbar(true);
          setSnackbarText("Error Generating Cover Letter");
        } else {
          // create new cover letter
          const now = moment().format("MMMM Do YYYY, HH:mm");
          const newCoverLetter: CoverLetter = {
            job_url: url,
            cover_letter: res.cover_letter,
            job_title: res.job_title,
            company: res.company,
            generated_at: now,
          };

          pushCoverLetter(newCoverLetter);

          setOpenSnackbar(true);
          setSnackbarText("Generated Cover Letter");
        }
      });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "33%",
          backgroundColor: theme.palette.primary.main,
          justifyContent: "center",
          alignItems: "center",
          gap: "5px",
          paddingX: "10px",
        }}
        color="text.secondary"
      >
        <ResumeUpload sx={{ width: "50%" }}></ResumeUpload>
        {resume ? (
          <>
            <Typography>{resume ? resume.name : ""}</Typography>
            <Typography>
              Last uploaded: {resume ? resume.uploaded_at : ""}
            </Typography>
          </>
        ) : (
          <></>
        )}
        <Typography>Provide a URL to a job listing</Typography>
        <TextField
          value={url}
          onChange={onUrlChange}
          fullWidth
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: theme.palette.secondary.main,
              },
              "&:hover fieldset": {
                borderColor: theme.palette.secondary.main,
                borderWidth: "2px",
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.secondary.main,
              },
            },
            "& .MuiInputBase-input": {
              color: "text.secondary",
            },
          }}
        ></TextField>
        <Button
          disabled={disableGenerate}
          color="secondary"
          variant="contained"
          onClick={onClickCreate}
        >
          Generate Cover Letter
        </Button>
      </Box>
      <Box
        width="66%"
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <CoverLettersList />
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackBar}
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
    </>
  );
}

export default App;
