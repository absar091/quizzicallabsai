// 🔄 Enhanced real-time listener with retry logic and proper cleanup
import { onSnapshot, DocumentReference, CollectionReference, Unsubscribe } from 'firebase/firestore';

export class ReliableListener {
  private unsubscribe: Unsubscribe | null = null;
  private retryCount = 0;
  private maxRetries = 5;
  private retryDelay = 1000; // Start with 1 second
  private isActive = false;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(
    private ref: DocumentReference | CollectionReference,
    private onData: (data: any) => void,
    private onError?: () => void
  ) {}

  start(): void {
    if (this.isActive) {
      console.warn('ReliableListener already active');
      return;
    }
    
    this.isActive = true;
    this.setupListener();
  }

  stop(): void {
    this.isActive = false;
    
    if (this.unsubscribe) {
      try {
        this.unsubscribe();
        this.unsubscribe = null;
      } catch (error) {
        console.warn('Error unsubscribing listener:', error);
      }
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    this.retryCount = 0;
  }

  private setupListener(): void {
    if (!this.isActive) return;

    try {
      this.unsubscribe = onSnapshot(
        this.ref,
        (snapshot) => {
          try {
            // Reset retry count on successful connection
            this.retryCount = 0;
            this.retryDelay = 1000;

            if ('docs' in snapshot) {
              // Collection snapshot
              const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
              this.onData(data);
            } else {
              // Document snapshot
              if (snapshot.exists()) {
                const data = {
                  id: snapshot.id,
                  ...snapshot.data()
                };
                this.onData(data);
              } else {
                this.onData(null);
              }
            }
          } catch (dataError) {
            console.error('Error processing snapshot data:', dataError);
            this.handleError();
          }
        },
        (error) => {
          console.error('Firebase listener error:', error);
          this.handleError();
        }
      );
    } catch (setupError) {
      console.error('Error setting up listener:', setupError);
      this.handleError();
    }
  }

  private handleError(): void {
    if (!this.isActive) return;

    // Clean up current listener
    if (this.unsubscribe) {
      try {
        this.unsubscribe();
        this.unsubscribe = null;
      } catch (error) {
        console.warn('Error cleaning up failed listener:', error);
      }
    }

    // Check if we should retry
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      
      console.log(`Retrying listener setup (attempt ${this.retryCount}/${this.maxRetries}) in ${this.retryDelay}ms`);
      
      this.reconnectTimer = setTimeout(() => {
        if (this.isActive) {
          this.setupListener();
        }
      }, this.retryDelay);
      
      // Exponential backoff with jitter
      this.retryDelay = Math.min(this.retryDelay * 2 + Math.random() * 1000, 30000);
    } else {
      console.error('Max retries reached for Firebase listener');
      if (this.onError) {
        this.onError();
      }
    }
  }

  // Health check method
  isHealthy(): boolean {
    return this.isActive && this.unsubscribe !== null && this.retryCount < this.maxRetries;
  }

  // Force reconnect method
  forceReconnect(): void {
    if (this.isActive) {
      this.stop();
      setTimeout(() => this.start(), 100);
    }
  }
}

// Utility function to create a reliable listener
export function createReliableListener(
  ref: DocumentReference | CollectionReference,
  onData: (data: any) => void,
  onError?: () => void
): ReliableListener {
  return new ReliableListener(ref, onData, onError);
}

// Export for backward compatibility
export default ReliableListener;