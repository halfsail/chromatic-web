class GameStateStore {
  // Main view navigation
  // Current screen ('home', 'game', 'completed', 'ad', 'splashscreen')
  screen = $state('home');
  
  // Overlay modal state (null when no modal is open)
  activeModal = $state(null);

  // day slider index
  daySliderIndex = $state(0);

  // --- Screen Navigation Methods ---
  goTo(screen) {
    this.screen = screen;
    this.activeModal = null; // Auto-close open modals on main screen transition
  }

  // --- Modal Navigation Methods ---
  openModal(modal) {
    this.activeModal = modal;
  }

  closeModal() {
    this.activeModal = null;
  }

  // Helper getter
  get isModalOpen() {
    return this.activeModal !== null;
  }
}

export const gameState = new GameStateStore();