// Stolen from Chase lmao

export class Stream<T> {
    protected index: number = 0;
    constructor(protected items: T[]) {}

    /**
     * Returns next item and advance pointer
     * @returns {T} Next item
     */
    public next(): T {
        return this.items[this.incrementPointer()];
    }

    /**
     * Returns item from an index ahead without advancing pointer
     * @returns {T} Next item
     */
    public peek(advanceIndexBy = 0): T {
        return this.items[this.index + advanceIndexBy];
    }

    /**
     * Advance pointer until specified value is reached and return everything it read over
     * @param value Value to search for
     * @returns {T[]} Array of values pointer advanced over
     */
    public readUntil(value: T, readLast = true): T[] {
        const result: T[] = [];
        while (!this.eof() && this.peek() != value) {
            result.push(this.next());
        }

        if (readLast) {
            this.next();
        }

        return result;
    }

    /**
     * Advance pointer until specified value is reached
     * @param value Predicate that returns true once value is found, or value to search for
     */
    public skipUntil(value: (arg: T) => boolean): T | undefined;
    public skipUntil(value: T): T | undefined;
    public skipUntil(value: T | ((arg: T) => boolean)): T | undefined {
        const predicate = this.isPredicate(value) ? value : (e: T) => e == value;

        while (!this.eof()) {
            const next = this.next();
            if (!predicate(next)) {
                continue;
            } else {
                return next;
            }
        }

        return undefined;
    }

    /**
     * Checks if the end of the stream is reached
     * @returns True if the end of stream is reached
     */
    public eof(): boolean {
        return this.index >= this.items.length;
    }

    /**
     * Set the pointer to the first position
     */
    public reset(): void {
        this.index = 0;
    }

    /**
     * Acquire items in stream
     * @returns {T[]} Array of items stream goes over
     */
    public _all(): T[] {
        return this.items;
    }

    protected incrementPointer(): number {
        return this.index++;
    }

    protected isPredicate<T>(value: T | ((arg: T) => boolean)): value is (arg: T) => boolean {
        return typeof value == "function";
    }
}
