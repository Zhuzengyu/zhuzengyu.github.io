// common.js - 极简版公共脚本
document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单切换
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenu.innerHTML = navLinks.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-bars"></i>';
        });
        
        // 点击链接关闭菜单
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenu.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
    
    // 滚动效果
    function initScrollEffects() {
        const header = document.getElementById('main-header');
        const backToTop = document.getElementById('backToTop');
        
        if (header || backToTop) {
            window.addEventListener('scroll', function() {
                const scrollY = window.scrollY;
                
                // 导航栏效果
                if (header) {
                    header.classList.toggle('scrolled', scrollY > 50);
                }
                
                // 返回顶部按钮
                if (backToTop) {
                    backToTop.classList.toggle('visible', scrollY > 300);
                }
                
                // 章节动画
                const sections = document.querySelectorAll('section[id]');
                const triggerBottom = window.innerHeight * 0.8;
                
                sections.forEach(section => {
                    const sectionTop = section.getBoundingClientRect().top;
                    if (sectionTop < triggerBottom) {
                        section.classList.add('visible');
                    }
                });
            });
            
            // 初始检查
            window.dispatchEvent(new Event('scroll'));
        }
        
        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#') return;
                
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
                }
            });
        });
    }
    
    // 返回顶部功能
    function initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    // 复制IP功能（通用）
    function initCopyIP() {
        document.querySelectorAll('.copy-btn, .ip-copy-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const ip = 'mc.zzy10.top';
                const originalText = btn.innerHTML;
                
                try {
                    await navigator.clipboard.writeText(ip);
                    
                    // 成功反馈
                    btn.innerHTML = '<i class="fas fa-check"></i> 已复制';
                    btn.style.backgroundColor = '#388E3C';
                    
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.backgroundColor = '';
                    }, 2000);
                    
                } catch (err) {
                    // 降级方案
                    const textArea = document.createElement('textarea');
                    textArea.value = ip;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    
                    btn.innerHTML = '<i class="fas fa-check"></i> 已复制';
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                    }, 2000);
                }
            });
        });
    }
    
    // 外部链接警告
    function initExternalLinks() {
        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            if (!link.href.includes(window.location.hostname)) {
                link.addEventListener('click', function(e) {
                    // 排除一些信任的域名
                    const trustedDomains = ['qm.qq.com', 'github.com', 'mcsrvstat.us'];
                    const isTrusted = trustedDomains.some(domain => link.href.includes(domain));
                    
                    if (!isTrusted && !confirm('即将离开方块世界网站，访问第三方网站。\n\n是否继续？')) {
                        e.preventDefault();
                    }
                });
            }
        });
    }
    
    // 初始化所有功能
    initScrollEffects();
    initBackToTop();
    initCopyIP();
    initExternalLinks();
});