from fastapi import APIRouter
from .utils import extract_text_from_pdf_base64
from .models import Resume

router = APIRouter()


@router.post("/resume")
def post_resume(resume: Resume):
    return extract_text_from_pdf_base64(resume.content)
