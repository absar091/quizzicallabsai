// User login credentials management for smart security notifications

import { UserLoginCredentials, DeviceInfo, createLoginCredentials, updateLoginCredentials, shouldSendLoginNotification } from './device-detection';

export class LoginCredentialsManager {
  private static instance: LoginCredentialsManager;
  private credentials: Map<string, UserLoginCredentials[]> = new Map();

  static getInstance(): LoginCredentialsManager {
    if (!LoginCredentialsManager.instance) {
      LoginCredentialsManager.instance = new LoginCredentialsManager();
    }
    return LoginCredentialsManager.instance;
  }

  /**
   * Store user login credentials
   */
  async storeLoginCredentials(userId: string, deviceInfo: DeviceInfo): Promise<void> {
    const existingCredentials = this.credentials.get(userId) || [];

    // Check if this device/browser combination already exists
    const existingCredential = existingCredentials.find(cred =>
      cred.device === deviceInfo.device &&
      cred.browser === deviceInfo.browser &&
      cred.os === deviceInfo.os
    );

    if (existingCredential) {
      // Update existing credentials
      const updatedCredentials = updateLoginCredentials(existingCredential, deviceInfo);
      const updatedList = existingCredentials.map(cred =>
        cred.id === existingCredential.id ? updatedCredentials : cred
      );
      this.credentials.set(userId, updatedList);

      // In a real app, you would save to database here
      await this.saveToDatabase(userId, updatedList);
    } else {
      // Create new credentials
      const newCredentials = createLoginCredentials(userId, deviceInfo);
      const updatedList = [...existingCredentials, newCredentials];
      this.credentials.set(userId, updatedList);

      // In a real app, you would save to database here
      await this.saveToDatabase(userId, updatedList);
    }
  }

  /**
   * Get user login credentials
   */
  async getLoginCredentials(userId: string): Promise<UserLoginCredentials[]> {
    if (this.credentials.has(userId)) {
      return this.credentials.get(userId)!;
    }

    // In a real app, you would load from database here
    const storedCredentials = await this.loadFromDatabase(userId);
    this.credentials.set(userId, storedCredentials);
    return storedCredentials;
  }

  /**
   * Check if login notification should be sent
   */
  async shouldSendNotification(userId: string, deviceInfo: DeviceInfo): Promise<boolean> {
    const storedCredentials = await this.getLoginCredentials(userId);
    return shouldSendLoginNotification(deviceInfo, storedCredentials);
  }

  /**
   * Mark device as trusted
   */
  async markDeviceAsTrusted(userId: string, deviceInfo: DeviceInfo): Promise<void> {
    const existingCredentials = await this.getLoginCredentials(userId);
    const credentialToUpdate = existingCredentials.find(cred =>
      cred.device === deviceInfo.device &&
      cred.browser === deviceInfo.browser &&
      cred.os === deviceInfo.os
    );

    if (credentialToUpdate) {
      const updatedCredentials = {
        ...credentialToUpdate,
        isTrusted: true,
        updatedAt: new Date().toISOString()
      };

      const updatedList = existingCredentials.map(cred =>
        cred.id === credentialToUpdate.id ? updatedCredentials : cred
      );

      this.credentials.set(userId, updatedList);
      await this.saveToDatabase(userId, updatedList);
    }
  }

  /**
   * Get user's trusted devices
   */
  async getTrustedDevices(userId: string): Promise<UserLoginCredentials[]> {
    const credentials = await this.getLoginCredentials(userId);
    return credentials.filter(cred => cred.isTrusted);
  }

  /**
   * Remove device from trusted list
   */
  async removeTrustedDevice(userId: string, deviceId: string): Promise<void> {
    const existingCredentials = await this.getLoginCredentials(userId);
    const updatedList = existingCredentials.filter(cred => cred.id !== deviceId);
    this.credentials.set(userId, updatedList);
    await this.saveToDatabase(userId, updatedList);
  }

  /**
   * Clear all credentials for a user
   */
  async clearUserCredentials(userId: string): Promise<void> {
    this.credentials.delete(userId);
    await this.clearDatabaseCredentials(userId);
  }

  /**
   * Get login statistics for a user
   */
  async getLoginStats(userId: string): Promise<{
    totalLogins: number;
    trustedDevices: number;
    lastLogin: string | null;
    firstLogin: string | null;
  }> {
    const credentials = await this.getLoginCredentials(userId);

    if (credentials.length === 0) {
      return {
        totalLogins: 0,
        trustedDevices: 0,
        lastLogin: null,
        firstLogin: null
      };
    }

    const totalLogins = credentials.reduce((sum, cred) => sum + cred.loginCount, 0);
    const trustedDevices = credentials.filter(cred => cred.isTrusted).length;
    const lastLogin = credentials.length > 0 ? credentials[0].lastLoginTime : null;
    const firstLogin = credentials.length > 0 ? credentials[0].firstLoginTime : null;

    return {
      totalLogins,
      trustedDevices,
      lastLogin,
      firstLogin
    };
  }

  // Database operations (mock implementations)
  private async saveToDatabase(userId: string, credentials: UserLoginCredentials[]): Promise<void> {
    // In a real application, save to your database (Firestore, MongoDB, etc.)
    console.log(`Saving ${credentials.length} login credentials for user ${userId} to database`);

    // Example Firestore implementation:
    // await db.collection('userLoginCredentials').doc(userId).set({
    //   credentials,
    //   updatedAt: new Date().toISOString()
    // });
  }

  private async loadFromDatabase(userId: string): Promise<UserLoginCredentials[]> {
    // In a real application, load from your database
    console.log(`Loading login credentials for user ${userId} from database`);

    // Example Firestore implementation:
    // const doc = await db.collection('userLoginCredentials').doc(userId).get();
    // return doc.exists ? doc.data().credentials : [];

    return [];
  }

  private async clearDatabaseCredentials(userId: string): Promise<void> {
    // In a real application, clear from database
    console.log(`Clearing login credentials for user ${userId} from database`);

    // Example Firestore implementation:
    // await db.collection('userLoginCredentials').doc(userId).delete();
  }
}

// Export singleton instance
export const loginCredentialsManager = LoginCredentialsManager.getInstance();
