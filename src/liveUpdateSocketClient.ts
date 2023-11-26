export class LiveUpdateWebSocketClient {
    private socket!: WebSocket;
    private serverPath: string;

    constructor(serverPath: string) {
        this.serverPath = serverPath;
        this.initWebSocket();
    }

    private initWebSocket() {
        this.socket = new WebSocket(`ws://${this.serverPath}`);
        this.socket.addEventListener('open', this.handleOpen.bind(this));
        this.socket.addEventListener('message', this.handleMessage.bind(this));
        this.socket.addEventListener('close', this.handleClose.bind(this));
        this.socket.addEventListener('error', this.handleError.bind(this));
    }

    private handleOpen(event: Event) {
        console.log("Websockets connected");
    }

    private handleMessage(event: MessageEvent) {
        const message: string = event.data;

        console.log("Websockets: " + event.data);
        if (message === 'need_reload') {
            console.log('Need_reload!!!!');
            location.reload();
        }
    }

    private handleClose(event: CloseEvent) {
        console.log("Websockets is dead!");
        // Reconnect on close
        this.reconnect();
    }

    private handleError(event: Event) {
        console.error('WebSocket error:', event);
        // Reconnect on error
        this.reconnect();
    }

    private reconnect() {
        console.log("Reconnecting...");
        // Close the current connection before reconnecting
        this.socket.close();

        // Reinitialize WebSocket after a 1-second delay
        setTimeout(() => {
            this.initWebSocket();
        }, 1000);
    }

    // Method to send data to the server
    public send(data: string) {
        this.socket.send(data);
    }

    // Method to close the connection
    public close() {
        this.socket.close();
    }
}
