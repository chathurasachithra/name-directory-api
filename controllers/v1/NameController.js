const ResponseService = require('../../services/ResponseService');
const NameService = require('../../services/NameService');

const NameController = {

  /**
   * List all names
   *
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  getList: async (req, res) => {
    try {
      const request = req.body;
      const result = await NameService.getList(request);
      ResponseService.success(res, result);
    } catch (err) {
      ResponseService.error(res, err.message);
    }
  },

  /**
   * List all names by filtering
   *
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  getAll: async (req, res) => {
    try {
      const request = req.body;
      const result = await NameService.getAll(request);
      ResponseService.success(res, result);
    } catch (err) {
      ResponseService.error(res, err.message);
    }
  },

  /**
   * Create new name
   * @param request
   * @param response
   * @returns {Promise<void>}
   */
  create: async (request, response) => {
    try {
      const result = await NameService.save(request.body);
      ResponseService.success(response, result);
    } catch (error) {
      ResponseService.error(response, error);
    }
  },

  /**
   * Update name by id
   * @param request
   * @param response
   * @returns {Promise<void>}
   */
  update: async (request, response) => {
    try {
      const nameId = request.params.id || null;
      const result = await NameService.update(request.body, nameId);
      ResponseService.success(response, result);
    } catch (error) {
      ResponseService.error(response, error);
    }
  },

  /**
   * Increase view count
   * @param request
   * @param response
   * @returns {Promise<void>}
   */
  updateViews: async (request, response) => {
    try {
      const name = request.params.name || null;
      const result = await NameService.updateViews(name);
      ResponseService.success(response, result);
    } catch (error) {
      ResponseService.error(response, error);
    }
  },



  /**
   * Remove name by id
   * @param request
   * @param response
   * @returns {Promise<void>}
   */
  remove: async (request, response) => {
    try {
      const nameId = request.params.id || null;
      const result = await NameService.remove(nameId);
      ResponseService.success(response, result);
    } catch (error) {
      ResponseService.error(response, error);
    }
  },

  /**
   * Get name data by Id
   * @param request
   * @param response
   * @returns {Promise<void>}
   */
  getById: async (request, response) => {
    try {
      const nameId = request.params.id || null;
      const result = await NameService.getById(nameId);
      ResponseService.success(response, result);
    } catch (error) {
      ResponseService.error(response, error);
    }
  },

  /**
   * Get static data
   *
   * @param request
   * @param response
   * @returns {Promise<void>}
   */
  getStaticData: async (request, response) => {
    try {
      const result = await NameService.getStaticData();
      ResponseService.success(response, result);
    } catch (error) {
      ResponseService.error(response, error);
    }
  },
};
module.exports = NameController;
