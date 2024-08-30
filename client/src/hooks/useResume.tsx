import { useState, useEffect } from "react";
import { Resume } from "../types";

const useResume = () => {
  const [resume, setResume] = useState<Resume>();

  // loads resume from local storage
  const loadResume = () => {
    const aux = localStorage.getItem("resume");
    if (aux !== null) {
      setResume(JSON.parse(aux));
    }
  };

  // initial load
  useEffect(loadResume, []);

  // update resume state when storage changes
  useEffect(() => {
    loadResume();

    const handleStorageChange = () => {
      loadResume();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return resume;
};

export default useResume;
