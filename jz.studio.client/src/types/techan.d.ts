// src/techan.d.ts
declare global {
  interface Window {
    techan: any; // You can replace `any` with a more specific type if available
  }
}

// No need for `export` because it's a global augmentation
