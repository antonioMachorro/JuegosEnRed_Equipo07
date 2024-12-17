class ConnectionManager {
    constructor() {
        this.serverStatus = true; 
        this.pollInterval = null;
    }

    startPolling() {
        console.log("Starting connection poll...");
        this.pollInterval = setInterval(async () => {
            console.log("Connection poll again...");
            try {
                const response = await fetch('/api/status/connection');
                if (response.ok) {
                    if (!this.serverStatus) {
                        console.log('Server reconnected');
                        this.notifyServerStatus(true); 
                    }
                    this.serverStatus = true;
                } else {
                    throw new Error('Server unreachable');
                }
            } catch (error) {
                if (this.serverStatus) {
                    console.log('Server disconnected');
                    this.notifyServerStatus(false); 
                }
                this.serverStatus = false;
            }
        }, 5000);
    }

    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
        }
    }

    getStatus() {
        return this.serverStatus;
    }

    notifyServerStatus(isConnected) {
        console.log(isConnected ? "Connected" : "Disconnected");
        /*
        const statusElement = document.getElementById('server-status');
        if (statusElement) {
            statusElement.textContent = isConnected
                ? 'Server is connected'
                : 'Server is disconnected';
            statusElement.style.color = isConnected ? 'green' : 'red';
        }
            */
    }
}
export default ConnectionManager;
