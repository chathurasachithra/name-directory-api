const ResponseService = {
  /**
   * Error Response
   * @param res
   * @param error
   */
  error: (res, error) => {
    // TODO @chathuras: add logs
    console.log(error.stack);

    res.status(400).json({
      statusCode: 400,
      message: 'error',
      data: null,
      error: `${error}`,
      errorMessage: error.message,
    });
  },

  /**
   * Unauthorized Response
   * @param res
   * @param error
   */
  unauthorized: (res, error) => {
    // TODO @chathuras: add logs
    console.log(error.stack);

    res.status(401).json({
      statusCode: 401,
      message: 'error',
      data: null,
      error: `${error}`,
      errorMessage: error.message,
    });
  },

  /**
   * Success Response
   * @param res
   * @param data
   */
  success: (res, data) => {
    res.status(200).json({
      statusCode: 200, message: 'success', data, error: null, errorMessage: null,
    });
  },

  /**
   * @deprecated use success() and error() methods
   * @param res
   * @param code
   * @param data
   * @returns {*|request.Request|Promise<any>}
   */
  response: (res, code, data) => {
    console.warn(data, 'Calling a deprecated method! use success() or error()');

    if (code === '200') {
      ResponseService.success(res, data);
    } else {
      const errorMessage = (typeof data === 'string') ? data : JSON.stringify(data);
      const error = (data instanceof Error) ? data : new Error(errorMessage);

      res.status(400).json({
        statusCode: 400,
        message: 'error',
        data: error.message,
        error: `${error}`,
        errorMessage: error.message,
      });
    }
  },
};

module.exports = ResponseService;
