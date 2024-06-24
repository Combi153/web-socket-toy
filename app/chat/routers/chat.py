from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websocket.manager import ConnectionManager

router = APIRouter()
chat_manager = ConnectionManager()
board_manager = ConnectionManager()

@router.websocket("/ws")
async def websocket_endpoint2(websocket: WebSocket):
    await board_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            await board_manager.broadcast(data)
    except WebSocketDisconnect:
        chat_manager.disconnect(websocket)
        