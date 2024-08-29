from pydantic import BaseModel


class Resume(BaseModel):
    name: str
    content: str
