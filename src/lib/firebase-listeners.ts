import { onSnapshot, DocumentReference, CollectionReference } from 'firebase/firestore';

export class ReliableListener {
  private unsubscribe: (() => void) | null = null;
  private retryCount = 0;
  private maxRetries = 3;
  private retryDelay = 1000;

  constructor(
    private ref: DocumentReference | CollectionReference,
    private callback: (data: any) => void,
    private errorCallback?: (error: Error) => void
  ) {}

  start() {
    this.setupListener();
  }

  stop() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  private setupListener() {
    this.unsubscribe = onSnapshot(
      this.ref,
      (snapshot) => {
        this.retryCount = 0; // Reset on success
        if ('exists' in snapshot) {
          // Document snapshot
          this.callback(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
        } else {
          // Collection snapshot
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          this.callback(data);
        }
      },
      (error) => {
        console.error('Listener error:', error);
        this.handleError(error);
      }
    );
  }

  private handleError(error: Error) {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      setTimeout(() => {
        this.stop();
        this.setupListener();
      }, this.retryDelay * this.retryCount);
    } else {
      this.errorCallback?.(error);
    }
  }
}