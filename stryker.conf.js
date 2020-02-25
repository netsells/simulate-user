module.exports = function(config) {
    config.set({
        mutator: 'javascript',
        packageManager: 'yarn',
        reporters: ['clear-text', 'progress', 'html', 'dashboard'],
        testRunner: 'jest',
        transpilers: [],
        coverageAnalysis: 'off',
        thresholds: {
            high: 90,
            low: 89,
            break: 89,
        },
    });
};
