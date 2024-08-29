import "@fontsource/roboto/300.css";
import Typography from "@mui/material/Typography";

import { ResumeUpload } from "./components";
import { useResume } from "./hooks";

function App() {
  const resume = useResume();

  return (
    <>
      <Typography variant="h2">Hello</Typography>
      <ResumeUpload></ResumeUpload>
      <Typography>{resume ? resume.content : ""}</Typography>
    </>
  );
}

export default App;
