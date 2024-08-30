import { useState, useEffect } from "react";
import { CoverLetter } from "../types";
import { getCoverLetters } from "../utils";

const useCoverLetters = (): [
  CoverLetter[],
  React.Dispatch<React.SetStateAction<CoverLetter[]>>
] => {
  const [coverLetters, setCoverLetters] = useState<Array<CoverLetter>>([]);

  // set cover letters from local storage
  const setCoverLettersFromStorage = () => {
    setCoverLetters(getCoverLetters());
  };

  // initial load
  useEffect(() => setCoverLetters(getCoverLetters()), []);

  // update cover letters state when storage changes
  useEffect(() => {
    setCoverLettersFromStorage();

    const handleStorageChange = () => {
      setCoverLettersFromStorage();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return [coverLetters, setCoverLetters];
};

export default useCoverLetters;
