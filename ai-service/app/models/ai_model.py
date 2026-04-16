from pydantic import BaseModel

class AIResponse(BaseModel):
    filename: str
    message: str
    size: int