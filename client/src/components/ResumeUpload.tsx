import FileUpload from "./FileUpload";
import { useState, useEffect } from "react";

const ResumeUpload: React.FC = () => {
  const [resume, setResume] = useState<File>();

  const onResumeUpload = () => {
    if (resume) {
      console.log("Adding resume to local storage");

      // set file reader object
      const reader = new FileReader();

      // on load event handler removes the data URL prefix and sets file content
      reader.onload = function (e) {
        const result = e.target?.result;
        if (typeof result === "string") {
          // retrieve content
          const content = result.split(",")[1];

          console.log("Base64 Encoded String:", content);

          // save file name and content to local storage
          localStorage.setItem(
            "resume",
            JSON.stringify({ name: resume.name, content: content })
          );
        }
      };

      // read resume file
      reader.readAsDataURL(resume);
    }
  };

  useEffect(onResumeUpload, [resume]);

  return <FileUpload setFile={setResume}></FileUpload>;
};

export default ResumeUpload;
