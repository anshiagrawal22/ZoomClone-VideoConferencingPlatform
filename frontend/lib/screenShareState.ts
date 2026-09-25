/**
 * Simple in-memory bridge for passing a screen-share MediaStream across a
 * client-side navigation.
 *
 * Why this exists: getDisplayMedia() must be called synchronously inside a
 * user-gesture handler (e.g. a button click). We call it on the dashboard,
 * store the resulting stream here, then the meeting-room component consumes
 * it on mount. The stream stays alive because it lives outside React state.
 */

let _pending: MediaStream | null = null;

export function setPendingScreenStream(stream: MediaStream): void {
  _pending = stream;
}

/** Returns the stored stream and clears the slot. Call once from the meeting room. */
export function consumePendingScreenStream(): MediaStream | null {
  const s = _pending;
  _pending = null;
  return s;
}
