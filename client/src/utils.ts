import { CoverLetter } from "./types";

const pushCoverLetter = (newCoverLetter: CoverLetter) => {
  const coverLetters = getCoverLetters();

  localStorage.setItem(
    "coverLetters",
    JSON.stringify([...coverLetters, newCoverLetter])
  );
  window.dispatchEvent(new Event("storage"));
};

const removeCoverLetter = (indx: number) => {
  const coverLetters = getCoverLetters();
  const aux = coverLetters.filter((_, i) => i !== indx);

  localStorage.setItem("coverLetters", JSON.stringify(aux));
  window.dispatchEvent(new Event("storage"));
};

const getCoverLetters = () => {
  const cover_letters = localStorage.getItem("coverLetters");

  if (cover_letters === null) return [] as CoverLetter[];
  else return JSON.parse(cover_letters) as CoverLetter[];
};

export { pushCoverLetter, removeCoverLetter, getCoverLetters };
