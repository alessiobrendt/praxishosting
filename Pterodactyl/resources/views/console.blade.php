{!! $iconAssets !!}
<div class="bg-background-secondary dark:bg-background-secondary/80 border border-neutral rounded-lg p-6 mb-6 shadow-md">
    <div class="mb-4">
        <h3 class="text-xl font-semibold text-text-primary">
            <i class="ri-terminal-box-line mr-2"></i>Server Console
        </h3>
        <p class="text-text-secondary text-sm mt-1">Real-time server console via Pterodactyl websocket API</p>
    </div>

    <div id="console-container" class="bg-gray-900 rounded-lg p-4 mb-4" style="min-height: 400px; max-height: 600px; overflow-y: auto;">
        <div id="console-output" class="font-mono text-sm text-green-400 whitespace-pre-wrap" style="font-family: 'Courier New', monospace;">
            <div class="text-gray-500">Connecting to console...</div>
        </div>
    </div>

    <form id="console-form" method="POST" action="?tab=console&console_action=send_command" class="flex gap-2">
        @csrf
        <input type="text" id="console-input" name="command" 
            class="flex-1 px-4 py-2 rounded-md border border-neutral bg-background-primary text-text-primary font-mono"
            placeholder="Type command here and press Enter..."
            autocomplete="off">
        <button type="submit" class="px-6 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity">
            <i class="ri-send-plane-line mr-2"></i>Send
        </button>
    </form>

    <div class="mt-4 flex gap-2">
        <button id="clear-console" class="px-4 py-2 bg-gray-600 text-white rounded-md hover:opacity-90 transition-opacity text-sm">
            <i class="ri-delete-bin-line mr-2"></i>Clear
        </button>
        <button id="connect-console" class="px-4 py-2 bg-green-600 text-white rounded-md hover:opacity-90 transition-opacity text-sm">
            <i class="ri-plug-line mr-2"></i>Reconnect
        </button>
    </div>
</div>

<script>
(function() {
    const websocketData = @json($websocketData ?? []);
    const panelUrl = '{{ $panelUrl }}';
    const serverIdentifier = '{{ $serverIdentifier }}';
    
    let ws = null;
    let isConnected = false;
    const output = document.getElementById('console-output');
    const input = document.getElementById('console-input');
    const form = document.getElementById('console-form');
    const clearBtn = document.getElementById('clear-console');
    const connectBtn = document.getElementById('connect-console');

    function appendOutput(text, className = 'text-green-400') {
        const div = document.createElement('div');
        div.className = className;
        div.textContent = text;
        output.appendChild(div);
        output.scrollTop = output.scrollHeight;
    }

    function connectWebSocket() {
        if (ws && ws.readyState === WebSocket.OPEN) {
            return;
        }

        try {
            const token = websocketData.token || '';
            const socketUrl = websocketData.socket || `wss://${new URL(panelUrl).hostname.replace('https://', '').replace('http://', '')}/api/servers/${serverIdentifier}/ws`;
            
            ws = new WebSocket(`${socketUrl}?token=${token}`);

            ws.onopen = () => {
                isConnected = true;
                appendOutput('Connected to server console', 'text-green-400');
                connectBtn.textContent = 'Connected';
                connectBtn.classList.remove('bg-green-600');
                connectBtn.classList.add('bg-green-500');
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.event === 'console output' || data.event === 'stats') {
                        if (data.args && data.args.length > 0) {
                            appendOutput(data.args.join(' '));
                        }
                    } else if (data.event === 'token expiring') {
                        appendOutput('Token expiring, reconnecting...', 'text-yellow-400');
                        ws.close();
                        setTimeout(connectWebSocket, 1000);
                    }
                } catch (e) {
                    appendOutput(event.data, 'text-gray-400');
                }
            };

            ws.onerror = (error) => {
                appendOutput('WebSocket error occurred', 'text-red-400');
                isConnected = false;
                connectBtn.textContent = 'Reconnect';
                connectBtn.classList.remove('bg-green-500');
                connectBtn.classList.add('bg-green-600');
            };

            ws.onclose = () => {
                isConnected = false;
                appendOutput('Connection closed', 'text-gray-400');
                connectBtn.textContent = 'Reconnect';
                connectBtn.classList.remove('bg-green-500');
                connectBtn.classList.add('bg-green-600');
            };

        } catch (error) {
            appendOutput('Failed to connect: ' + error.message, 'text-red-400');
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const command = input.value.trim();
        if (!command || !isConnected) return;

        try {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    event: 'send command',
                    args: [command]
                }));
                appendOutput(`> ${command}`, 'text-blue-400');
                input.value = '';
            } else {
                // Fallback to HTTP API
                fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: new URLSearchParams(new FormData(form))
                }).then(() => {
                    appendOutput(`> ${command}`, 'text-blue-400');
                    input.value = '';
                });
            }
        } catch (error) {
            appendOutput('Error sending command: ' + error.message, 'text-red-400');
        }
    });

    clearBtn.addEventListener('click', () => {
        output.innerHTML = '';
        appendOutput('Console cleared', 'text-gray-500');
    });

    connectBtn.addEventListener('click', () => {
        if (ws) {
            ws.close();
        }
        setTimeout(connectWebSocket, 500);
    });

    // Auto-connect on load
    if (websocketData && websocketData.token) {
        connectWebSocket();
    } else {
        appendOutput('WebSocket data not available. Please ensure Client API key is configured.', 'text-yellow-400');
    }
})();
</script>
