from fastapi import FastAPI, Request, WebSocket
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.chat.routers import chat

app = FastAPI()

app.include_router(chat.router, tags=["chat"])
app.mount("/static", StaticFiles(directory="static", html=True), name="static")
templates = Jinja2Templates(directory="templates")


@app.get("/room", response_class=HTMLResponse)
async def room(request: Request):
    return templates.TemplateResponse(request=request, name="room.html")
