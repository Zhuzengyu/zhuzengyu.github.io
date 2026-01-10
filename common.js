// common.js - 优化版
document.addEventListener('DOMContentLoaded', function() {
    // 快速移除加载动画
    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader) {
        setTimeout(() => {
            pageLoader.classList.add('hidden');
        }, 300);
        
        // 如果3秒后还在显示，强制隐藏
        setTimeout(() => {
            if (!pageLoader.classList.contains('hidden')) {
                pageLoader.classList.add('hidden');
            }
        }, 3000);
    }
    
    // 移动端菜单切换
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                navLinks.classList.toggle('active');
                
                // 切换菜单图标
                if (navLinks.classList.contains('active')) {
                    mobileMenu.innerHTML = '✕';
                } else {
                    mobileMenu.innerHTML = '☰';
                }
            }
        });
    }
    
    // 点击页面其他地方关闭菜单
    document.addEventListener('click', function(e) {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (navLinks && navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !mobileMenu.contains(e.target)) {
            navLinks.classList.remove('active');
            if (mobileMenu) {
                mobileMenu.innerHTML = '☰';
            }
        }
    });
    
    // 点击导航链接关闭菜单（移动端）
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            const navLinks = document.querySelector('.nav-links');
            const mobileMenu = document.querySelector('.mobile-menu');
            
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileMenu) {
                    mobileMenu.innerHTML = '☰';
                }
            }
        });
    });
    
    // 平滑滚动
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // 跳过锚点和外部链接
                if (href === '#' || href === '#!' || this.getAttribute('target') === '_blank') {
                    return;
                }
                
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const headerHeight = 80;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - headerHeight;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // 更新URL哈希（不滚动）
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            });
        });
    }
    
    // 滚动效果
    function initScrollEffects() {
        const header = document.getElementById('main-header');
        const backToTop = document.getElementById('backToTop');
        const sections = document.querySelectorAll('section:not(.hero)');
        
        let scrollTimeout;
        
        function updateScroll() {
            // 导航栏效果
            if (header) {
                const scrolled = window.scrollY > 50;
                header.classList.toggle('scrolled', scrolled);
            }
            
            // 返回顶部按钮
            if (backToTop) {
                const showBackToTop = window.scrollY > 300;
                backToTop.classList.toggle('visible', showBackToTop);
            }
            
            // 章节动画
            if (sections.length > 0) {
                const triggerBottom = window.innerHeight * 0.85;
                
                sections.forEach(section => {
                    const sectionTop = section.getBoundingClientRect().top;
                    
                    if (sectionTop < triggerBottom) {
                        section.classList.add('visible');
                    }
                });
            }
        }
        
        // 使用requestAnimationFrame优化滚动性能
        function onScroll() {
            if (scrollTimeout) {
                cancelAnimationFrame(scrollTimeout);
            }
            
            scrollTimeout = requestAnimationFrame(updateScroll);
        }
        
        window.addEventListener('scroll', onScroll, { passive: true });
        updateScroll(); // 初始检查
    }
    
    // 复制IP功能
    function initCopyIP() {
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const ip = 'mc.zzy10.top';
                const originalText = btn.textContent;
                const originalBgColor = btn.style.backgroundColor;
                
                // 禁用按钮防止重复点击
                btn.disabled = true;
                btn.style.opacity = '0.8';
                
                try {
                    // 尝试使用现代Clipboard API
                    await navigator.clipboard.writeText(ip);
                    
                    // 成功反馈
                    btn.textContent = '✓ 已复制';
                    btn.style.backgroundColor = '#388E3C';
                    
                    // 3秒后恢复
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.backgroundColor = originalBgColor;
                        btn.disabled = false;
                        btn.style.opacity = '1';
                    }, 2000);
                    
                } catch (err) {
                    // 降级方案：使用传统方法
                    try {
                        const textArea = document.createElement('textarea');
                        textArea.value = ip;
                        textArea.style.position = 'fixed';
                        textArea.style.opacity = '0';
                        document.body.appendChild(textArea);
                        textArea.select();
                        
                        const successful = document.execCommand('copy');
                        document.body.removeChild(textArea);
                        
                        if (successful) {
                            btn.textContent = '✓ 已复制';
                            btn.style.backgroundColor = '#388E3C';
                            
                            setTimeout(() => {
                                btn.textContent = originalText;
                                btn.style.backgroundColor = originalBgColor;
                                btn.disabled = false;
                                btn.style.opacity = '1';
                            }, 2000);
                        } else {
                            throw new Error('复制失败');
                        }
                    } catch (fallbackErr) {
                        // 最终降级方案：显示IP让用户手动复制
                        alert(`复制失败，请手动复制：\n\n${ip}`);
                        btn.disabled = false;
                        btn.style.opacity = '1';
                    }
                }
            });
        });
    }
    
    // 外部链接警告
    function initExternalLinks() {
        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            if (link.href && !link.href.includes(window.location.hostname)) {
                link.addEventListener('click', function(e) {
                    // 排除特定域名（如QQ链接）
                    const excludedDomains = ['qm.qq.com', 'github.com', 'mc.zzy10.top'];
                    const isExcluded = excludedDomains.some(domain => link.href.includes(domain));
                    
                    if (!isExcluded && !confirm('您即将离开方块世界网站，前往第三方网站。\n\n是否继续访问？')) {
                        e.preventDefault();
                        return false;
                    }
                    
                    // 添加loading状态
                    link.classList.add('external-link-loading');
                    setTimeout(() => {
                        link.classList.remove('external-link-loading');
                    }, 1000);
                });
            }
        });
    }
    
    // 表单增强（如果有表单的话）
    function initForms() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function(e) {
                // 防止快速重复提交
                const submitBtn = this.querySelector('[type="submit"]');
                if (submitBtn && submitBtn.classList.contains('submitting')) {
                    e.preventDefault();
                    return false;
                }
                
                if (submitBtn) {
                    submitBtn.classList.add('submitting');
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
                    
                    // 10秒后自动恢复（防止卡死）
                    setTimeout(() => {
                        if (submitBtn.classList.contains('submitting')) {
                            submitBtn.classList.remove('submitting');
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = submitBtn.getAttribute('data-original-text') || '提交';
                        }
                    }, 10000);
                }
            });
        });
    }
    
    // 返回顶部功能
    function initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // 更新URL（回到顶部）
                if (history.pushState) {
                    history.pushState(null, null, window.location.pathname);
                }
            });
        }
    }
    
    // 图片懒加载
    function initLazyLoad() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
    
    // 初始化所有功能
    function initAll() {
        initSmoothScroll();
        initScrollEffects();
        initCopyIP();
        initExternalLinks();
        initForms();
        initBackToTop();
        initLazyLoad();
        
        // 添加CSS类表示JS已加载
        document.documentElement.classList.add('js-enabled');
    }
    
    // 初始化
    initAll();
    
    // 当服务器状态可用时，绑定更新
    if (window.serverStatus) {
        window.serverStatus.onStatusChange((status) => {
            // 自动更新页面上的状态显示
            updateServerStatusUI(status);
        });
    }
    
    // 更新服务器状态UI的辅助函数
    function updateServerStatusUI(status) {
        // 更新状态文本
        document.querySelectorAll('.server-status .status-online, .server-status .status-offline').forEach(el => {
            el.textContent = status.online ? "在线" : "离线";
            el.className = status.online ? "status-online" : "status-offline";
        });
        
        // 更新玩家数量
        document.querySelectorAll('#player-count, .player-count').forEach(el => {
            if (el) {
                el.textContent = `${status.players}/${status.maxPlayers}`;
                el.setAttribute('title', `${status.players} 位玩家在线`);
            }
        });
        
        // 更新最后更新时间
        const time = new Date(status.timestamp || Date.now()).toLocaleTimeString();
        document.querySelectorAll('.last-update-time').forEach(el => {
            if (el) {
                el.textContent = `最后更新: ${time}`;
                el.setAttribute('title', new Date(status.timestamp).toLocaleString());
            }
        });
        
        // 更新MOTD
        document.querySelectorAll('.server-motd').forEach(el => {
            if (el && status.motd) {
                el.textContent = status.motd;
            }
        });
        
        // 更新延迟显示
        document.querySelectorAll('.server-latency').forEach(el => {
            if (el && status.latency) {
                el.textContent = `延迟: ${status.latency}ms`;
                el.style.color = status.latency < 100 ? '#4CAF50' : 
                                status.latency < 200 ? '#FF9800' : '#F44336';
            }
        });
    }
    
    // 页面卸载前的清理
    window.addEventListener('beforeunload', function() {
        // 停止服务器状态更新
        if (window.serverStatus) {
            window.serverStatus.stopAutoUpdate();
        }
    });
});

// 添加一些全局辅助函数
if (!window.blocksWorld) {
    window.blocksWorld = {
        // 格式化时间
        formatTime: function(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleTimeString('zh-CN');
        },
        
        // 格式化日期
        formatDate: function(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleDateString('zh-CN');
        },
        
        // 格式化相对时间
        formatRelativeTime: function(timestamp) {
            const now = Date.now();
            const diff = now - timestamp;
            
            if (diff < 60000) return '刚刚';
            if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
            if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
            return `${Math.floor(diff / 86400000)}天前`;
        },
        
        // 复制文本到剪贴板
        copyToClipboard: async function(text) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                try {
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    return true;
                } catch (fallbackErr) {
                    return false;
                }
            }
        },
        
        // 防抖函数
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // 节流函数
        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    };
}