// server-status.js - 极简服务器状态检测
const ServerStatus = {
    config: {
        serverIP: 'mc.zzy10.top',
        checkInterval: 60000, // 1分钟
        apiEndpoints: [
            'https://api.mcsrvstat.us/2/',
            'https://api.mcstatus.io/v2/status/java/'
        ]
    },
    
    status: {
        online: false,
        players: 0,
        maxPlayers: 100,
        version: '未知',
        motd: '',
        lastUpdate: null
    },
    
    async check() {
        try {
            // 尝试第一个API
            const response = await fetch(`${this.config.apiEndpoints[0]}${this.config.serverIP}`);
            const data = await response.json();
            
            if (data.online) {
                this.status = {
                    online: true,
                    players: data.players?.online || 0,
                    maxPlayers: data.players?.max || 100,
                    version: data.version || '未知',
                    motd: data.motd?.clean || '',
                    lastUpdate: new Date()
                };
            } else {
                this.status = {
                    online: false,
                    players: 0,
                    maxPlayers: 100,
                    version: '未知',
                    motd: '服务器离线',
                    lastUpdate: new Date()
                };
            }
            
        } catch (error) {
            console.log('状态检测失败:', error);
            this.status = {
                ...this.status,
                online: false,
                lastUpdate: new Date()
            };
        }
        
        this.updateDisplay();
        this.saveToStorage();
        return this.status;
    },
    
    updateDisplay() {
        // 更新页面上的状态显示
        document.querySelectorAll('.server-status-text, .status-value').forEach(el => {
            if (el.classList.contains('status-online') || el.classList.contains('status-offline')) {
                el.textContent = this.status.online ? '在线' : '离线';
                el.className = this.status.online ? 'status-online' : 'status-offline';
            }
        });
        
        document.querySelectorAll('#playerCount, .player-count').forEach(el => {
            if (el) el.textContent = `${this.status.players}/${this.status.maxPlayers}`;
        });
        
        // 触发自定义事件
        document.dispatchEvent(new CustomEvent('serverStatusUpdate', {
            detail: this.status
        }));
    },
    
    saveToStorage() {
        try {
            localStorage.setItem('serverStatus', JSON.stringify(this.status));
            localStorage.setItem('serverStatusTime', Date.now().toString());
        } catch (e) {
            console.log('保存状态到本地存储失败');
        }
    },
    
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('serverStatus');
            const savedTime = localStorage.getItem('serverStatusTime');
            
            if (saved && savedTime) {
                const timeDiff = Date.now() - parseInt(savedTime);
                // 如果缓存不超过5分钟，使用缓存
                if (timeDiff < 300000) {
                    this.status = JSON.parse(saved);
                    this.updateDisplay();
                    return true;
                }
            }
        } catch (e) {
            console.log('从本地存储加载状态失败');
        }
        return false;
    },
    
    startAutoCheck() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(() => this.check(), this.config.checkInterval);
    },
    
    stopAutoCheck() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
};

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 先显示缓存的状态
    ServerStatus.loadFromStorage();
    
    // 立即检测一次
    ServerStatus.check();
    
    // 开始自动检测
    ServerStatus.startAutoCheck();
    
    // 页面卸载时停止检测
    window.addEventListener('beforeunload', () => {
        ServerStatus.stopAutoCheck();
    });
});

// 全局函数
window.checkServerStatus = () => ServerStatus.check();
window.getServerStatus = () => ServerStatus.status;