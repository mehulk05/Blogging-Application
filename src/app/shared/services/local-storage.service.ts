import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import * as localforage from 'localforage';
@Injectable({
	providedIn: 'root'
})
// eslint-disable-next-line import/prefer-default-export
export class LocalStorageService {

	constructor(@Inject(PLATFORM_ID) private platformId: object) {
		if (isPlatformBrowser(this.platformId)) {
			localforage.config({
				driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
				storeName: 'mastery',
				name: 'mastery',
			});
		}
	}

	storeItem(key: string, value: any) {
		if (isPlatformBrowser(this.platformId)) {
			return localStorage.setItem(key, typeof (value) === 'string' ? value : JSON.stringify(value));
		}
	}

	readStorage(key: string) {
		if (isPlatformBrowser(this.platformId)) {
			return localStorage.getItem(key);
		}
	}

	removeStorage(key: string) {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.removeItem(key);
		}
	}

	clearStorage() {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.clear();
		}
	}
	// store particular key details
	setDataInIndexedDB(key, value) {
		if (isPlatformBrowser(this.platformId)) {
			return localforage.setItem(key, JSON.stringify(value))
				.then(() => { })
				.catch(() => { });
		}
	}

	// fetch particular key details
	async getDataFromIndexedDB(key) {
		if (isPlatformBrowser(this.platformId)) {
			return new Promise((resolve, reject) => {
				localforage.getItem(key)
					.then((result: any) => {
						resolve(JSON.parse(result));
					})
					.catch((err) => {
						reject(err);
					});
			});
		}
	}

	// For Remove Particular Field/Key
	removeDataFromIndexedDB(key) {
		if (isPlatformBrowser(this.platformId)) {
			return new Promise((resolve, reject) => {
				localforage.removeItem(key)
					.then((result: any) => {
						const remove = 'Key Removed';
						return resolve(remove);
					}).catch((err) => {
						return reject(err);
					});
			});
		}
	}

	// Database has been entirely deleted.
	clearDataFromIndexedDB() {
		if (isPlatformBrowser(this.platformId)) {
			return localforage.clear();
		}
	}

}
