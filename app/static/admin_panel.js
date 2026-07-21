(function () {
  const layout = document.querySelector('.layout');
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');

  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modalClose');
  const modalCancel = document.getElementById('modalCancel');
  const editForm = document.getElementById('editForm');

  const inputId = document.getElementById('entryId');
  const inputName = document.getElementById('entryName');
  const inputDate = document.getElementById('entryDate');
  const inputDesc = document.getElementById('entryDescription');

  const notification = document.getElementById('notification');
  const notificationText = document.getElementById('notification-text');

  document.addEventListener("DOMContentLoaded", function () {
    const timeoutMinutes = Number(window.sessionTimeoutMinutes || 30);
    const warningMinutes = Number(window.sessionWarningMinutes || 5);
    const timeoutUrl = window.sessionTimeoutUrl;

    const timeoutMs = timeoutMinutes * 60 * 1000;
    const warningDelayMs =
      (timeoutMinutes - warningMinutes) * 60 * 1000;

    let warningTimer;
    let logoutTimer;
    let countdownInterval;
    let timeoutModal;

    const modalElement = document.getElementById("timeoutModal");
    const countdownElement =
      document.getElementById("timeoutCountdown");

    if (modalElement && window.bootstrap) {
      timeoutModal = new bootstrap.Modal(modalElement, {
        backdrop: "static",
        keyboard: false
      });
    }

    function updateCountdown(totalSeconds) {
      if (!countdownElement) {
        return;
      }

      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      countdownElement.textContent =
        `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    function stopCountdown() {
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
    }

    function hideTimeoutWarning() {
      stopCountdown();

      if (timeoutModal) {
        timeoutModal.hide();
      }
    }

    function showTimeoutWarning() {
      let secondsRemaining = warningMinutes * 60;

      updateCountdown(secondsRemaining);

      if (timeoutModal) {
        timeoutModal.show();
      }

      stopCountdown();

      countdownInterval = setInterval(function () {
        secondsRemaining -= 1;

        updateCountdown(Math.max(secondsRemaining, 0));

        if (secondsRemaining <= 0) {
          stopCountdown();
        }
      }, 1000);
    }

    function logoutForInactivity() {
      stopCountdown();

      if (timeoutUrl) {
        window.location.href = timeoutUrl;
      }
    }

    function resetInactivityTimer() {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);

      hideTimeoutWarning();

      warningTimer = setTimeout(
        showTimeoutWarning,
        warningDelayMs
      );

      logoutTimer = setTimeout(
        logoutForInactivity,
        timeoutMs
      );
    }

    const activityEvents = [
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "click"
    ];

    activityEvents.forEach(function (eventName) {
      document.addEventListener(
        eventName,
        resetInactivityTimer,
        true
      );
    });

    const continueButton =
      document.getElementById("continueSessionButton");

    if (continueButton) {
      continueButton.addEventListener(
        "click",
        resetInactivityTimer
      );
    }

    resetInactivityTimer();
  });

  // Modal open helpers
  function openModal() {
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    inputName.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
  }

  modalClose?.addEventListener('click', closeModal);
  modalCancel?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Attach edit button handlers
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.edit-btn');
    if (!btn) return;

    const id = btn.dataset.id;
    const name = btn.dataset.name || '';
    const date = btn.dataset.date || '';
    const description = btn.dataset.description || '';

    inputId.value = id;
    inputName.value = name;
    inputDate.value = date;
    inputDesc.value = description;

    openModal();
  });
})();
