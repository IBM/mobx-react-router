import path from 'path';
import * as ts from 'typescript';

expect.extend({
  toBeEmpty(received, expected) {
    return {
      message: () => 'Expected empty, but found ' + JSON.stringify(received, null, 2),
      pass: received.length === 0
    };
  }
});

describe('types', () => {
  it('can diagnose types without errors', () => {
    const files = [path.join(__dirname, '/types-test')];
    const options = { noEmit: true, jsx: 'react' };
    const program = ts.createProgram(files, options);
    const diagnosticErrors = ts.getPreEmitDiagnostics(program)
      .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error)
      .map((diagnostic) => diagnostic.messageText);

    expect(diagnosticErrors).toBeEmpty();
  });
});
