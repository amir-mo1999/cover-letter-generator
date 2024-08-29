import FileUpload from "./FileUpload";
import { useState, useEffect } from "react";
import { Resume } from "../types";
import moment from "moment";

const ResumeUpload: React.FC = () => {
  const [file, setFile] = useState<File>();

  const onFileUpload = () => {
    if (file) {
      // set file reader object
      const reader = new FileReader();

      // on load event handler removes the data URL prefix and sets file content
      reader.onload = function (e) {
        const result = e.target?.result;
        if (typeof result === "string") {
          // retrieve content
          const content = result.split(",")[1];

          // get cur time
          const now = moment().format("MMMM Do YYYY, HH:mm");

          // create resume object
          const resume: Resume = {
            name: file.name,
            content: content,
            uploaded_at: now,
          };

          // save resume to local storage
          localStorage.setItem("resume", JSON.stringify(resume));
        }
      };

      // read resume file
      reader.readAsDataURL(file);
    }
  };

  useEffect(onFileUpload, [file]);

  return <FileUpload setFile={setFile}></FileUpload>;
};

export default ResumeUpload;
