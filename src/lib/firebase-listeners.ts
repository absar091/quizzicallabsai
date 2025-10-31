import { onSnapshot, DocumentReference, CollectionReference } from 'firebase/firestore';

export class ReliableListener {
  private unsubscribe: (() => void) | null = null;
  private retryCount = 0;
  private maxRetries = 5;
  private retryDelay = 1000;
  private retryTimeout: NodeJS.Timeout | null = null;
  private isActive = false;
  private lastSuccessfulUpdate = Date.now();

  constructor(
    private ref: DocumentReference | CollectionReference,
    private callback: (data: any) => void,
    private errorCallback?: (error: Error) => void
  ) {}

  start() {
    if (this.isActive) return; // Prevent multiple starts
    this.isActive = true;
    this.setupListener();
  }

  stop() {
    this.isActive = false;
    
    // Clear retry timeout
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
    
    // Unsubscribe from Firebase
    if (this.unsubscribe) {
      try {
        this.unsubscribe();
      } catch (error) {
        console.warn('Error during unsubscribe:', error);
      }
      this.unsubscribe = null;
    }
    
    this.retryCount = 0;
  }

  private setupListener() {
    if (!this.isActive) return;

    // Clean up existing listener
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }

    try {
      // Handle different reference types
      if ('type' in this.ref && this.ref.type === 'document') {
        // Document reference
        this.unsubscribe = onSnapshot(
          this.ref as DocumentReference,
          (snapshot) => {
            if (!this.isActive) return;
            
            this.retryCount = 0;
            this.lastSuccessfulUpdate = Date.now();
            
            try {
              const data = snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
              this.callback(data);
            } catch (callbackError) {
              console.error('Callback error:', callbackError);
              this.errorCallback?.(callbackError as Error);
            }
          },
          (error) => {
            if (!this.isActive) return;
            console.error('Listener error:', error);
            this.handleError(error);
          }
        );
      } else {
        // Collection reference
        this.unsubscribe = onSnapshot(
          this.ref as CollectionReference,
          (snapshot) => {
            if (!this.isActive) return;
            
            this.retryCount = 0;
            this.lastSuccessfulUpdate = Date.now();
            
            try {
              const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              this.callback(data);
            } catch (callbackError) {
              console.error('Callback error:', callbackError);
              this.errorCallback?.(callbackError as Error);
            }
          },
          (error) => {
            if (!this.isActive) return;
            console.error('Listener error:', error);
            this.handleError(error);
          }
        );
      }
    } catch (error) {
      console.error('Failed to setup listener:', error);
      this.handleError(error as Error);
    }
  }

  private handleError(error: Error) {
    if (!this.isActive) return;

    // Check if it's a network error that we should retry
    const isRetryableError = 
      error.message.includes('network') ||
      error.message.includes('offline') ||
      error.message.includes('unavailable') ||
      error.message.includes('timeout');

    if (this.retryCount < this.maxRetries && isRetryableError) {
      this.retryCount++;
      const delay = Math.min(this.retryDelay * Math.pow(2, this.retryCount - 1), 30000);
      
      console.log(`Retrying listener in ${delay}ms (attempt ${this.retryCount}/${this.maxRetries})`);
      
      this.retryTimeout = setTimeout(() => {
        if (this.isActive) {
          this.setupListener();
        }
      }, delay);
    } else {
      console.error('Max retries reached or non-retryable error:', error);
      this.errorCallback?.(error);
    }
  }

  // Health check method
  isHealthy(): boolean {
    const timeSinceLastUpdate = Date.now() - this.lastSuccessfulUpdate;
    return this.isActive && timeSinceLastUpdate < 60000; // Healthy if updated within 1 minute
  }

  // Force restart the listener
  restart() {
    this.stop();
    setTimeout(() => {
      this.start();
    }, 1000);
  }
}