var client_id = Date.now();
document.querySelector("#ws-id").textContent = client_id;
var ws = new WebSocket(`ws://localhost:8000/ws`);

ws.onmessage = function (event) {
    var data = JSON.parse(event.data);
    if (data.type === "chat") {
        var messages = document.getElementById('messages');
        var message = document.createElement('li');
        var content = document.createTextNode(data.message);
        message.appendChild(content);
        messages.appendChild(message);
    } else if (data.type === "draw") {
        const ctx = canvas.getContext('2d');
        if (data.action === 'start') {
            ctx.beginPath();
            ctx.moveTo(data.x, data.y);
        } else if (data.action === 'draw') {
            ctx.lineTo(data.x, data.y);
            ctx.stroke();
        }
    }
};

function sendMessage(event) {
    var input = document.getElementById("messageText");
    ws.send(JSON.stringify({ type: "chat", client_id: client_id, message: input.value }));
    input.value = '';
    event.preventDefault();
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;

canvas.addEventListener('mousedown', (event) => {
    drawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    ws.send(JSON.stringify({ type: 'draw', action: 'start', x: x, y: y }));
    ctx.beginPath();
    ctx.moveTo(x, y);
});

canvas.addEventListener('mousemove', (event) => {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    ws.send(JSON.stringify({ type: 'draw', action: 'draw', x: x, y: y }));
    ctx.lineTo(x, y);
    ctx.stroke();
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    ws.send(JSON.stringify({ type: 'draw', action: 'end' }));
});