// Source - https://stackoverflow.com/a
// Posted by ajwl, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-17, License - CC BY-SA 4.0

module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  }
};
