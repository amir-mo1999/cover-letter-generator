import { useState, useEffect } from "react";
import { CoverLetter } from "../types";

const useCoverLetters = (): [
  CoverLetter[],
  React.Dispatch<React.SetStateAction<CoverLetter[]>>
] => {
  const [coverLetters, setCoverLetters] = useState<Array<CoverLetter>>([]);

  // load cover letters from local storage
  const loadCoverLetters = () => {
    const aux = localStorage.getItem("coverLetters");
    if (aux !== null) {
      setCoverLetters(JSON.parse(aux));
    }
  };

  // initial load
  useEffect(loadCoverLetters, []);

  // update cover letters state when storage changes
  useEffect(() => {
    loadCoverLetters();

    const handleStorageChange = () => {
      loadCoverLetters();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return [coverLetters, setCoverLetters];
};

export default useCoverLetters;
