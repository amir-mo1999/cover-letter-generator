import Typography from "@mui/material/Typography";
import { useCoverLetters } from "../hooks";

const CoverLettersList: React.FC = () => {
  const [coverLetters] = useCoverLetters();

  return (
    <>
      {coverLetters.map((coverLetter, indx) => (
        <Typography key={indx}>{coverLetter.cover_letter}</Typography>
      ))}
    </>
  );
};

export default CoverLettersList;
