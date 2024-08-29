import "@fontsource/roboto/300.css";
import Typography from "@mui/material/Typography";

import { ResumeUpload } from "./components";
import { useResume } from "./hooks";

function App() {
  const resume = useResume();

  return (
    <>
      <ResumeUpload></ResumeUpload>
      {resume ? (
        <>
          <Typography>{resume ? resume.name : ""}</Typography>
          <Typography>{resume ? resume.uploaded_at : ""}</Typography>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default App;
