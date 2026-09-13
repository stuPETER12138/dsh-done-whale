/** Official completion reminders plus the selected session finishing in a hidden tab. */
export function createStatusTracker() {
  const running = new Map();
  const hiddenDone = new Set();

  return (state, pending, visible) => {
    let done = false;
    let waiting = false;
    const ids = new Set();
    for (const row of Object.values(state.byId)) {
      if (row.origin === 'subagent') continue;
      ids.add(row.id);
      if (running.get(row.id) && !row.running && row.id === state.current && !visible) {
        hiddenDone.add(row.id);
      }
      if (row.running || (visible && row.id === state.current)) hiddenDone.delete(row.id);
      running.set(row.id, row.running);
      done ||= row.completed === true || hiddenDone.has(row.id);
      waiting ||= pending.has(row.id);
    }
    for (const id of running.keys()) {
      if (!ids.has(id)) {
        running.delete(id);
        hiddenDone.delete(id);
      }
    }
    return done ? 'green' : waiting ? 'amber' : 'black';
  };
}
