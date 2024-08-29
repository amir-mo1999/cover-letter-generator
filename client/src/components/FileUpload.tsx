import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { SetStateAction } from "react";

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
}

const FileUpload: React.FC<FileUploadProps> = ({ setFile }) => {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log("Uploading resume");

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
      startIcon={<CloudUploadIcon />}
    >
      Upload files
      <VisuallyHiddenInput
        type="file"
        accept="application/pdf"
        onChange={handleUpload}
      />
    </Button>
  );
};

export default FileUpload;
