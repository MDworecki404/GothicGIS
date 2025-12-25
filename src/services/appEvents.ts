type Listener<T, R> = (event: T) => Promise<R> | R

class GEvent<T, R = void> {
    private _listeners: Set<Listener<T, R>> = new Set()

    get numberOfListeners(): number {
        return this._listeners.size
    }

    addEventListener(listener: Listener<T, R>): () => void {
        this._listeners.add(listener)
        return () => {
            this.removeEventListener(listener)
        }
    }

    removeEventListener(listener: Listener<T, R>): boolean {
        if (this._listeners.has(listener)) {
            this._listeners.delete(listener)
            return true
        }

        return false
    }

    raiseEvent(event: T): void {
        ;[...this._listeners].forEach((cb) => {
            if (this._listeners.has(cb)) {
                void cb(event)
            }
        })
    }

    async awaitRaisedEvent(event: T): Promise<R[]> {
        const promises: (R | Promise<R>)[] = []
        ;[...this._listeners].forEach((cb) => {
            if (this._listeners.has(cb)) {
                promises.push(cb(event))
            }
        })
        return Promise.all(promises)
    }

    destroy(): void {
        this._listeners.clear()
    }
}

export default GEvent