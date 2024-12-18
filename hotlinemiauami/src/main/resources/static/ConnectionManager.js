class ConnectionManager {
    constructor() {
        this.serverStatus = true;
        this.activeStatus = true;
        this.pollInterval = null;
        this.username = null;
    }

    startPolling() {
        
        if(this.pollInterval) return;

        console.log("Starting connection poll...");
        this.pollInterval = setInterval(async () => {
            console.log("Connection poll again...");
            try {
                const serverResponse = await fetch('/api/status/connection');
                if (serverResponse.ok) {
                    if (!this.serverStatus) {
                        console.log('Server reconnected');
                    }
                    this.serverStatus = true;
                } else {
                    throw new Error('Server unreachable');
                }

                if(this.username) {
                    const activeResponse = await fetch('/api/status/users');
                    if(activeResponse.ok) {
                        const { connectedUsers } = await activeResponse.json();
                        if(connectedUsers.includes(this.username)) {
                            this.activeStatus = true;
                        } else {
                            console.warn('User is innactive.');
                            this.activeStatus = false;
                            this.stopPolling();
                        }
                    } else {
                        throw new Error('Server unreachable');
                    }
                }

            } catch (error) {
                if (this.serverStatus) {
                    console.log('Server disconnected');
                }
                this.serverStatus = false;
                this.activeStatus = false;
            }

            if(this.activeStatus && this.serverStatus) {
                console.log('ONLINE');
            } else {
                console.log('OFFLINE');
            }
        }, 4000);
    }

    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
            console.log("Polling stopped...");
        }
    }

    getStatus() {
        return this.serverStatus;
    }

    setUsername(username) {
        this.username = username;
    }

    getUsername() {
        return this.username;
    }

    notifyServerStatus(isConnected) {
        console.log(isConnected ? "Connected" : "Disconnected");
    }

    async sendUpdate() {
        console.log("Being active...");
        if(!this.username) {
            console.log("No user logged in");
            return
        }
        try {
            await fetch('/api/status/activity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: this.username })
            });
        } catch(error) {
            console.error('Failed to send activity update: ', error);
        }
    }
}
export default ConnectionManager;
