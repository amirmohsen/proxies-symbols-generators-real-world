module.exports = class AsyncQueue {
  constructor() {
    this.resolve = () => { };
    this.contents = [];
    this.isStreaming = false;
    this.promise = this.regeneratePromise();
  }

  add(...items) {
    this.verifyAdditionCount(items);
    const oldLength = this.length;
    this.contents.push(...items);
    if (this.isStreaming && !oldLength) {
      this.resolve();
    }
    return this;
  }

  next() {
    return this.contents.shift();
  }

  async *[Symbol.asyncIterator]() {
    this.verifyAtomicStreaming();
    this.isStreaming = true;
    this.promise = this.regeneratePromise();
    while (this.isStreaming) {
      const result = await this.waitForNext();
      this.promise = this.regeneratePromise();
      if (this.isStreaming) {
        yield result;
      }
    }
  }

  stopStream() {
    this.isStreaming = false;
    this.resolve();
    return this;
  }

  get length() {
    return this.contents.length;
  }

  get streaming() {
    return this.isStreaming;
  }

  async waitForNext() {
    if (!this.length) {
      await this.promise;
    }
    return this.next();
  }

  verifyAdditionCount(items) {
    if (!items.length) {
      throw new Error('You need to add at least one item to this queue');
    }
  }

  verifyAtomicStreaming() {
    if (this.isStreaming) {
      throw new Error('This queue is already streaming');
    }
  }

  regeneratePromise() {
    const promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
    return promise;
  }
}
