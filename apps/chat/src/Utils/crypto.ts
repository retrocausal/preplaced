// src/utils/crypto.ts
export class CryptoUtil {
  private static readonly dbName = "parley";
  private static readonly storeName = "keys";
  private static readonly keyName = "shaes";
  private static keyPromise: Promise<CryptoKey> | null = null; // Lock for concurrency

  // Open IndexedDB
  private static async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore(this.storeName);
      };
    });
  }

  // Get or generate the non-exportable key
  private static async getKey(): Promise<CryptoKey> {
    if (this.keyPromise) {
      return this.keyPromise;
    }

    this.keyPromise = new Promise(async (resolve, reject) => {
      const db = await this.openDB();

      // Check for existing key
      const read = db.transaction(this.storeName, "readonly");
      const store = read.objectStore(this.storeName);
      const getRequest = store.get(this.keyName);
      getRequest.onerror = () => reject(getRequest.error);
      read.onerror = () => reject(read.error);

      getRequest.onsuccess = () => {
        const key = getRequest.result as CryptoKey | null;
        if (key) {
          read.oncomplete = () => db.close();
          resolve(key);
          return;
        }

        // Generate new key
        crypto.subtle
          .generateKey(
            { name: "AES-GCM", length: 256 },
            false, // Non-extractable
            ["encrypt", "decrypt"]
          )
          .then((newKey) => {
            // Store key in new transaction
            const write = db.transaction(this.storeName, "readwrite");
            const store = write.objectStore(this.storeName);
            const putRequest = store.put(newKey, this.keyName);
            putRequest.onsuccess = () => {
              write.oncomplete = () => db.close();
              resolve(newKey);
            };
            putRequest.onerror = () => reject(putRequest.error);
            write.onerror = () => reject(write.error);
          })
          .catch(reject);
      };
    });

    try {
      const result = await this.keyPromise;
      this.keyPromise = null; // Clear lock
      return result;
    } catch (error) {
      this.keyPromise = null; // Clear lock on error
      throw error;
    }
  }

  static async deleteKey(): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const deleteRequest = store.delete(this.keyName);

      deleteRequest.onsuccess = () => {
        transaction.oncomplete = () => {
          db.close();
          resolve();
        };
      };
      deleteRequest.onerror = () => reject(deleteRequest.error);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // Convert string to ArrayBuffer
  private static encode(str: string): Uint8Array<ArrayBuffer> {
    return new TextEncoder().encode(str);
  }

  // Convert ArrayBuffer to string
  private static decode(buffer: ArrayBuffer): string {
    return new TextDecoder().decode(buffer);
  }

  // Encrypt data (serializable object or string)
  static async encrypt(data: any): Promise<string> {
    const key = await this.getKey();
    //create an array of length 12 with each element being 0 and of 8 bytes
    const buffer = new Uint8Array(12);
    //fill in 1s at random 0s to create a random integere as each element
    const iv = crypto.getRandomValues(buffer); // Random IV
    const encoded = this.encode(JSON.stringify(data));
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encoded
    );
    // Combine IV and ciphertext
    const combined = new Uint8Array([...iv, ...new Uint8Array(encrypted)]);
    return btoa(String.fromCharCode(...combined));
  }

  // Decrypt data
  static async decrypt(encrypted: string): Promise<any | null> {
    try {
      const key = await this.getKey();
      const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
      const iv = combined.slice(0, 12); // Extract IV
      const ciphertext = combined.slice(12); // Extract ciphertext
      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        ciphertext
      );
      return JSON.parse(this.decode(decrypted));
    } catch {
      return null; // Return null on decryption failure
    }
  }
}
