from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import httpx
import re
from ..services.ai_service import get_analysis

router = APIRouter()

class ScanRequest(BaseModel):
    url: Optional[str] = None
    text: Optional[str] = None
    player_name: Optional[str] = "Guardian"

class ScanResult(BaseModel):
    verdict: str  # SCAM, SAFE, SUSPICIOUS
    confidence: int
    scam_type: str
    flags: List[str]
    explanation: str
    what_to_do: str
    source: str
    fetched_content: Optional[str] = None

@router.post("/scan", response_model=ScanResult)
async def scan_resource(request: ScanRequest):
    """
    Scans a URL or text for scam patterns.
    If a URL is provided, it attempts to fetch the page content for deeper analysis.
    """
    if not request.url and not request.text:
        raise HTTPException(status_code=400, detail="Either URL or text must be provided")

    analysis_text = request.text or ""
    fetched_info = None

    if request.url:
        # Basic URL validation and cleanup
        url = request.url.strip()
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        
        try:
            async with httpx.AsyncClient(timeout=5.0, follow_redirects=True) as client:
                response = await client.get(url)
                # We only take a snippet of the content to avoid overwhelming the model
                content_type = response.headers.get('content-type', '')
                
                if 'text/html' in content_type:
                    # Very basic HTML tag removal for analysis
                    text_content = re.sub(r'<[^>]+>', ' ', response.text)
                    text_content = ' '.join(text_content.split())[:1000] # truncate
                    analysis_text += f"\n\n[Content from {url}]:\n{text_content}"
                    fetched_info = f"Successfully fetched content from {url} ({response.status_code})"
                else:
                    analysis_text += f"\n\n[URL Header Info]: {content_type}"
                    fetched_info = f"Resource at {url} is not a webpage ({content_type})"
        except Exception as e:
            analysis_text += f"\n\n[URL Error]: Could not fetch {url}. {str(e)}"
            fetched_info = f"Error fetching {url}: {str(e)}"

    # Use the existing AI service to analyze the aggregated text
    result = await get_analysis(analysis_text, request.player_name)
    
    return ScanResult(
        verdict=result.get("verdict", "SUSPICIOUS"),
        confidence=result.get("confidence", 50),
        scam_type=result.get("scam_type", "UNKNOWN"),
        flags=result.get("flags", []),
        explanation=result.get("explanation", "No explanation provided."),
        what_to_do=result.get("what_to_do", "Exercise caution."),
        source=result.get("source", "System Analysis"),
        fetched_content=fetched_info
    )
