from fastapi import APIRouter, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import base64
from .utils import (
    extract_text_from_pdf_base64,
    scrape_job_listing,
    generate_cover_letter,
    is_base64,
)
from pydantic import BaseModel

router = APIRouter()


@router.post("/read-text-from-pdf")
async def post_resume(pdf_file: UploadFile):
    # assert that the file is a pdf
    if (
        not pdf_file.filename.endswith(".pdf")
        or not pdf_file.content_type == "application/pdf"
    ):
        raise HTTPException(400, "Not a pdf file")

    # read the content as base64 and extract the text
    content = await pdf_file.read()
    content = base64.b64encode(content).decode("utf-8")
    content = extract_text_from_pdf_base64(content)
    return JSONResponse(content, 200)


class GenerateCoverLetterRouteInput(BaseModel):
    url: str
    resume: str


@router.post("/generate-cover-letter")
async def generate_cover_letter_route(req: GenerateCoverLetterRouteInput):
    job_listing = scrape_job_listing(req.url)

    # extract text from resume if it comes as a base64 string
    if is_base64(req.resume):
        req.resume = extract_text_from_pdf_base64(req.resume)

    cover_letter = await generate_cover_letter(job_listing, req.resume)
    return cover_letter
