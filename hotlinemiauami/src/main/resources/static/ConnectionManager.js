class ConnectionManager {
    constructor(game) {
        this.game = game;
        this.serverStatus = true;
        this.pollInterval = null;
        this.alreadyDisconnected = false;
    }

    /*
    startPolling() {
        
        if(this.pollInterval) return;

        console.log("Starting connection poll...");
        this.pollInterval = setInterval(async () => {
            console.log("Connection poll again...");
            await this.fetchServerStatus();
            if(this.serverStatus) {
                console.log("Entering user fetches...");
                if(this.username) {
                    this.fetchActiveStatus();
                }
                //this.fetchConnectedUsers();
            } else {
                this.connectedUsers = 0
                this.game.events.emit('connected-users-updated', this.connectedUsers);
            }
        }, 1000);
    }
    */

    startPolling(interval = 1000) {
        this.stopPolling();
        this.alreadyDisconnected = false;

        console.log("Starting poll...")

        this.fetchServerStatus();

        this.pollInterval = setInterval(() => {
            this.fetchServerStatus();
        }, interval)
    }

    stopPolling() {
        if(this.pollInterval) {

            console.log("Stopping poll...");

            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }



    async fetchServerStatus() {

        if(this.alreadyDisconnected) {
            return;
        }

        try {
            const serverResponse = await fetch('/api/status/connection');
            if (serverResponse.ok) {
                if (!this.serverStatus) {
                    console.log('Server reconnected');
                }
                this.serverStatus = true;
                this.game.events.emit('server-status-updated', this.serverStatus);
            } else {
                this.handleOffline();
            }
        } catch(error) {
            this.handleOffline();
        }
    }

    handleOffline() {
        if(!this.alreadyDisconnected) {
            console.log('Server disconnected');
            this.serverStatus = false;
            this.alreadyDisconnected = true;
            this.game.events.emit('server-status-updated', this.serverStatus);
        }
    }

    async fetchActiveStatus() {
        try {
            const usersResponse = await fetch('/api/status/users');
            if(usersResponse.ok) {
                const { connectedUsers } = await usersResponse.json();
                if(connectedUsers.includes(this.username)) {
                    this.activeStatus = true;
                    this.game.events.emit('user-status-updated', this.activeStatus);
                } else {
                    console.warn('User is innactive.');
                    this.activeStatus = false;
                    this.stopPolling();
                    this.game.events.emit('user-status-updated', this.activeStatus);
                }
            } else {
                this.activeStatus = false;
                this.game.events.emit('user-status-updated', this.activeStatus);
                throw new Error('Server unreachable');
            }
        } catch (error) {
            console.log("Error fetching users:", error);
            this.activeStatus = false;
            this.game.events.emit('user-status-updated', this.activeStatus);
        }
    }

    async fetchConnectedUsers() {
        try {
            const usersResponse = await fetch('/api/status/connected-users');
            if (usersResponse.ok) {
                const data = await usersResponse.json();
                const connectedUsers = data.connectedUsers;
                this.connectedUsers = connectedUsers;
                this.game.events.emit('connected-users-updated', this.connectedUsers);
            } else {
                console.error('Error fetching connected users:', usersResponse.statusText);
                this.connectedUsers = 0;
                this.game.events.emit('connected-users-updated', this.connectedUsers);
            }
        } catch (error) {
            console.error('Error connecting to server:', error);
            this.connectedUsers = 0
            this.game.events.emit('connected-users-updated', this.connectedUsers);
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
