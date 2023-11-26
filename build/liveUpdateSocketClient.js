export class LiveUpdateWebSocketClient {
    constructor(serverPath) {
        this.serverPath = serverPath;
        this.initWebSocket();
    }
    initWebSocket() {
        this.socket = new WebSocket(`ws://${this.serverPath}`);
        this.socket.addEventListener('open', this.handleOpen.bind(this));
        this.socket.addEventListener('message', this.handleMessage.bind(this));
        this.socket.addEventListener('close', this.handleClose.bind(this));
        this.socket.addEventListener('error', this.handleError.bind(this));
    }
    handleOpen(event) {
        console.log("Websockets connected");
    }
    handleMessage(event) {
        const message = event.data;
        console.log("Websockets: " + event.data);
        if (message === 'need_reload') {
            console.log('Need_reload!!!!');
            location.reload();
        }
    }
    handleClose(event) {
        console.log("Websockets is dead!");
        // Reconnect on close
        this.reconnect();
    }
    handleError(event) {
        console.error('WebSocket error:', event);
        // Reconnect on error
        this.reconnect();
    }
    reconnect() {
        console.log("Reconnecting...");
        // Close the current connection before reconnecting
        this.socket.close();
        // Reinitialize WebSocket after a 1-second delay
        setTimeout(() => {
            this.initWebSocket();
        }, 1000);
    }
    // Method to send data to the server
    send(data) {
        this.socket.send(data);
    }
    // Method to close the connection
    close() {
        this.socket.close();
    }
}
