import path from 'path';
import * as ts from 'typescript';

beforeEach(() => {
  jasmine.addMatchers({
    toBeEmpty: () => ({
      compare: (actual, expected) => ({
        pass: actual.length === 0,
        message: 'Expected empty, but found ' + JSON.stringify(actual, null, 2)
      })
    })
  });
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
