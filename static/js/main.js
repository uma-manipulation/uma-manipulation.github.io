document.addEventListener('DOMContentLoaded', function () {
  // Gallery videos: play when visible, pause when scrolled away
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          if (video.paused) {
            video.play().catch(() => {});
          }
        } else if (!video.paused) {
          video.pause();
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.gallery-video').forEach((video) => {
      video.removeAttribute('autoplay');
      videoObserver.observe(video);
    });
  }

  // Teaser figure: play once at 1x when scrolled into view, then settle on the static figure
  const teaserVideo = document.getElementById('teaser-video');
  const teaserImage = document.getElementById('teaser-image');
  if (teaserVideo && teaserImage) {
    const showStaticTeaser = () => {
      teaserVideo.style.display = 'none';
      teaserImage.style.display = 'block';
    };
    if ('IntersectionObserver' in window) {
      const teaserObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            teaserVideo.playbackRate = 1;
            teaserVideo.play().catch(showStaticTeaser);
          } else if (!teaserVideo.paused) {
            teaserVideo.pause();
          }
        });
      }, { threshold: 0.3 });
      teaserObserver.observe(teaserVideo);
      teaserVideo.addEventListener('ended', () => {
        teaserObserver.unobserve(teaserVideo);
        showStaticTeaser();
      });
    } else {
      showStaticTeaser();
    }
  }

  // Copy BibTeX to clipboard (no-op while the BibTeX section is commented out)
  const copyBtn = document.getElementById('copy-bibtex');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      const text = document.getElementById('bibtex-text').textContent;
      navigator.clipboard.writeText(text).then(() => {
        this.textContent = 'Copied!';
        setTimeout(() => { this.textContent = 'Copy'; }, 2000);
      });
    });
  }
});
