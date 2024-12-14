
export class LocalStorage {
	static getString(key: string): string | null {
		const item = localStorage.getItem(key)
		if (!item) return null
		return item
	}

	static setString(key: string, data: string) {
		localStorage.setItem(key, data)
	}

	static getObject<T = any>(key: string): T | null {
		const item = localStorage.getItem(key)
		if (!item) return null
		return JSON.parse(item) as T
	}

	static setObject(key: string, data: any) {
		localStorage.setItem(key, JSON.stringify(data))
	}

	static delete(key: string) {
		localStorage.removeItem(key)
	}

	static clear() {
		localStorage.clear()
	}
}
