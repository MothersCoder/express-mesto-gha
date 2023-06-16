const ERROR = {
  uploadData: {
    code: 400,
    message: [],
  },
  getData: {
    code: 404,
    message: 'not found',
  },
  server: {
    code: 500,
    message: 'Internal Server Error',
  },
};

module.exports = ERROR;
