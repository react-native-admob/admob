export default class AdError extends Error {
  name = 'AdError';
  constructor(public readonly message: string, public readonly code?: number) {
    super();
  }
}
