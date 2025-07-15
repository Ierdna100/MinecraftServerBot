import WebSocket from "ws";

const ws = new WebSocket("wss://localhost:7500");
ws.on("open", () => console.log("open"));
ws.on("message", (data) => killme(data));

function killme(data) {
    console.log(data);
}
