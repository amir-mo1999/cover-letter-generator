import "@fontsource/roboto/400.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { ResumeUpload } from "./components";
import { useResume } from "./hooks";
import theme from "./theme";
import { useState, useEffect } from "react";
import { generateCoverLetter } from "./api";

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

  const onClickCreate = () => {
    if (resume !== undefined)
      generateCoverLetter({ url: url, resume: resume.content });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "33%",
          backgroundColor: "#503C80",
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
    </>
  );
}

export default App;
