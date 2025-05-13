document.addEventListener('DOMContentLoaded', () => {
  // 文件上传预览
  const avatarInput = document.getElementById('avatar');
  if (avatarInput) {
    avatarInput.addEventListener('change', function(e) {
      if (this.files && this.files[0]) {
        const file = this.files[0];
        // 检查文件类型
        if (!file.type.match('image.*')) {
          alert('请选择图片文件');
          this.value = '';
          return;
        }
        
        // 检查文件大小
        if (file.size > 2 * 1024 * 1024) { // 2MB
          alert('图片大小不能超过2MB');
          this.value = '';
          return;
        }
      }
    });
  }

  // 表单验证
  const messageForm = document.querySelector('.message-form');
  if (messageForm) {
    messageForm.addEventListener('submit', function(e) {
      const nameInput = document.getElementById('name');
      const contentInput = document.getElementById('content');
      
      if (!nameInput.value.trim()) {
        e.preventDefault();
        alert('请输入您的姓名');
        nameInput.focus();
        return;
      }
      
      if (!contentInput.value.trim()) {
        e.preventDefault();
        alert('请输入留言内容');
        contentInput.focus();
        return;
      }
    });
  }

  // 平滑滚动
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  scrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // 毛玻璃效果增强
  function updateGlassEffect() {
    const glassCards = document.querySelectorAll('.glass-card');
    glassCards.forEach(card => {
      card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 计算相对位置 (0-1)
        const relX = x / this.offsetWidth;
        const relY = y / this.offsetHeight;
        
        // 添加微妙的光照效果
        this.style.background = `
          linear-gradient(
            135deg,
            rgba(255, 255, 255, ${0.85 - relX * 0.1}) 0%,
            rgba(255, 255, 255, ${0.75 + relY * 0.1}) 100%
          )
        `;
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.background = '';
      });
    });
  }
  
  updateGlassEffect();
}); 