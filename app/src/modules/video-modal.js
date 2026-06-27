// 视频弹窗：点击「AI 视频」卡片打开本地 mp4，含 loading spinner；Esc/遮罩/关闭按钮关闭
export function initVideoModal() {
  const videoCard = document.getElementById("video-card");
  const videoModal = document.getElementById("video-modal");
  const videoPlayer = document.getElementById("video-player");
  const videoLoading = document.getElementById("video-loading");
  const videoClose = videoModal.querySelector(".video-modal-close");
  const videoBackdrop = videoModal.querySelector(".video-modal-backdrop");

  videoPlayer.addEventListener("canplay", () => {
    videoLoading.classList.add("hidden");
  });

  function openVideoModal(e) {
    e.preventDefault();
    e.stopPropagation();
    if (videoPlayer.readyState >= 3) {
      videoLoading.classList.add("hidden");
    } else {
      videoLoading.classList.remove("hidden");
    }
    videoModal.classList.add("active");
    videoPlayer.play();
  }

  function closeVideoModal() {
    videoModal.classList.remove("active");
    videoPlayer.pause();
  }

  videoCard.addEventListener("click", openVideoModal);
  videoClose.addEventListener("click", closeVideoModal);
  videoBackdrop.addEventListener("click", closeVideoModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && videoModal.classList.contains("active")) closeVideoModal();
  });
}
