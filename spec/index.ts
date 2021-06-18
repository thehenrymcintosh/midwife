/* eslint-disable camelcase */
/* eslint-disable no-console */
import './loadEnv';
import find from 'find';
import Jasmine from 'jasmine';
import commandLineArgs from 'command-line-args';


// Setup command line options
const options = commandLineArgs([
    {
        name: 'testFile',
        alias: 'f',
        type: String,
    },
]);


// Init Jasmine
const jasmine = new Jasmine(null);

// Set location of test files
jasmine.loadConfig({
    random: true,
    spec_dir: 'spec',
    spec_files: [
        './tests/**/*.spec.ts',
    ],
    stopSpecOnExpectationFailure: true,
    failSpecWithNoExpectations: true,
});

// On complete callback function
jasmine.onComplete((passed: boolean) => {
    if (passed) {
        console.info('All tests have passed');
    } else {
        console.error('At least one test has failed');
    }
});

// Run all or a single unit-test
if (options['testFile']) {
    const testFile = options['testFile'] as string;
    find.file(testFile + '.spec.ts', './spec', (files) => {
        const file = files[0];
        if (typeof file !== "undefined") {
            jasmine.specFiles = [file];
            jasmine.execute();
        } else {
            console.error('Test file not found!');
        }
    });
} else {
    jasmine.execute();
}
