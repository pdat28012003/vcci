// Component Loader - Load HTML components dynamically
class ComponentLoader {
  constructor() {
    this.components = new Map();
    this.loadedComponents = new Set();
  }

  // Register component
  register(name, path) {
    this.components.set(name, path);
  }

  // Load single component
  async loadComponent(name, targetSelector) {
    try {
      const path = this.components.get(name);
      if (!path) {
        throw new Error(`Component '${name}' not found`);
      }

      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load component: ${response.statusText}`);
      }

      const html = await response.text();
      const targetElement = document.querySelector(targetSelector);
      
      if (targetElement) {
        targetElement.innerHTML = html;
        this.loadedComponents.add(name);
        console.log(`✅ Component '${name}' loaded successfully`);
      } else {
        throw new Error(`Target element '${targetSelector}' not found`);
      }
    } catch (error) {
      console.error(`❌ Error loading component '${name}':`, error);
    }
  }

  // Load multiple components
  async loadComponents(componentMap) {
    const promises = Object.entries(componentMap).map(([name, selector]) =>
      this.loadComponent(name, selector)
    );
    
    await Promise.all(promises);
    console.log('🎉 All components loaded successfully');
  }

  // Check if component is loaded
  isLoaded(name) {
    return this.loadedComponents.has(name);
  }

  // Get loaded components list
  getLoadedComponents() {
    return Array.from(this.loadedComponents);
  }
}

// Initialize component loader
const componentLoader = new ComponentLoader();

// Register all components
componentLoader.register('header', './components/header.html');
componentLoader.register('hero', './components/hero.html');
componentLoader.register('registration', './components/registration.html');
componentLoader.register('gallery', './components/gallery.html');
componentLoader.register('footer', './components/footer.html');

// Auto-load components when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Loading components...');
  
  try {
    // Load all components
    await componentLoader.loadComponents({
      'header': '#header-container',
      'hero': '#hero-container',
      'registration': '#registration-container',
      'gallery': '#gallery-container',
      'footer': '#footer-container'
    });

    // Initialize scripts after components are loaded
    if (typeof initializeScripts === 'function') {
      initializeScripts();
    }

    // Hide loading screen
    setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
          loadingScreen.remove();
        }, 500);
      }
    }, 1000);

  } catch (error) {
    console.error('❌ Error loading components:', error);
    
    // Hide loading screen even if there's an error
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        loadingScreen.remove();
      }, 500);
    }
  }
});

// Export for use in other files
window.ComponentLoader = ComponentLoader;
window.componentLoader = componentLoader;