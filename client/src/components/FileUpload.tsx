import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import UploadIcon from "@mui/icons-material/Upload";
import { SetStateAction } from "react";
import { SxProps } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface FileUploadProps {
  setFile: React.Dispatch<SetStateAction<File | undefined>>;
  text?: string;
  sx?: SxProps;
}

const FileUpload: React.FC<FileUploadProps> = ({ setFile, text, sx }) => {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFile(file);
    }
  };

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<UploadIcon />}
      color="secondary"
      sx={sx}
    >
      {text}
      <VisuallyHiddenInput
        type="file"
        accept="application/pdf"
        onChange={handleUpload}
      />
    </Button>
  );
};

export default FileUpload;
