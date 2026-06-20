(function () {
  'use strict';

  function loadSlideBg(slide) {
    if (!slide || slide.dataset.bgLoaded === '1') return;
    var url = slide.getAttribute('data-bg');
    if (!url) return;
    var img = new Image();
    img.onload = function () {
      slide.style.backgroundImage = "url('" + url + "')";
      slide.dataset.bgLoaded = '1';
    };
    img.src = url;
  }

  function preloadSlideRange(slides, index, total) {
    loadSlideBg(slides[index]);
    if (total > 1) loadSlideBg(slides[(index + 1) % total]);
  }

  window.initHeroSliderPerf = function (slides, showSlideFn) {
    if (!slides.length) return;
    preloadSlideRange(slides, 0, slides.length);
    var originalShow = showSlideFn;
    return function (index) {
      originalShow(index);
      preloadSlideRange(slides, index, slides.length);
    };
  };

  function initParticleCanvas() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    if (window.matchMedia('(max-width: 768px)').matches) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var W, H, running = true, rafId;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    var colors = ['rgba(99,102,241,.6)', 'rgba(14,165,233,.6)', 'rgba(236,72,153,.5)', 'rgba(16,185,129,.5)'];
    for (var i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        r: Math.random() * 2 + .5,
        dx: (Math.random() - .5) * .4,
        dy: (Math.random() - .5) * .4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * .5 + .2
      });
    }

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      particles.forEach(function (p) {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(draw);
    }

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        running = entries[0].isIntersecting;
        if (running) draw();
        else if (rafId) cancelAnimationFrame(rafId);
      }, { threshold: 0.05 });
      obs.observe(canvas);
    } else {
      draw();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticleCanvas);
  } else {
    initParticleCanvas();
  }
})();
