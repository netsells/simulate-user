module.exports = function(config) {
    config.set({
        mutator: 'javascript',
        packageManager: 'yarn',
        reporters: ['clear-text', 'progress', 'html'],
        testRunner: 'jest',
        transpilers: [],
        coverageAnalysis: 'off'
    });
};
