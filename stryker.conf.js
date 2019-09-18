module.exports = function(config) {
    config.set({
        mutator: 'javascript',
        packageManager: 'yarn',
        reporters: ['clear-text', 'progress', 'html'],
        testRunner: 'jest',
        transpilers: [],
        coverageAnalysis: 'off',
        thresholds: {
            high: 90,
            low: 90,
            break: 90,
        },
    });
};
