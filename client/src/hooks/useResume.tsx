import { useState, useEffect } from "react";
import { Resume } from "../types";

const useResume = () => {
  const [resume, setResume] = useState<Resume>();

  useEffect(() => {
    const aux = localStorage.getItem("resume");
    if (aux !== null) {
      setResume(JSON.parse(aux));
    }
  }, []);

  return resume;
};

export default useResume;
