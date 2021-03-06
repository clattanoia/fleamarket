module.exports = {
  transform: {
    '^.+\\.js?$': 'babel-jest'
  },
  rootDir: __dirname,
  // testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  testMatch: ['<rootDir>/src/**/*.spec.js'],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    'react': 'nervjs',
    'react-addons-test-utils': 'nerv-test-utils',
    'react-dom': 'nervjs',
    'weui': '<rootDir>/__mock__/styleMock.js',
    '\\.(css|less|sass|scss)$': '<rootDir>/__mock__/styleMock.js'
  },
  coverageDirectory: '<rootDir>/coverage',
  coveragePathIgnorePatterns: ['/.temp/', '/__mock__/'],
};


