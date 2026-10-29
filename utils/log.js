const TAG = '[demoqa-qa]';

export function createTestLog(testInfo) {
  const testScope = `w${testInfo.workerIndex}|r${testInfo.retry}|${testInfo.title}`;
  const withScope = (kind, message) => `${TAG} [${testScope}] [${kind}] ${message}`;
  return {
    start: () => console.log(`${TAG} [${testScope}] [start] Test execution started.`),
    end: () => console.log(`${TAG} [${testScope}] [end] Test execution completed.`),
    api: (message, ...rest) => console.log(withScope('api', message), ...rest),
    ui: (message, ...rest) => console.log(withScope('ui', message), ...rest),
    file: (message, ...rest) => console.log(withScope('file', message), ...rest),
  };
}
