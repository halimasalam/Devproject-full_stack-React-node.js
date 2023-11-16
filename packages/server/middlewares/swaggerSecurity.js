const swaggerSecurity = (_req, _res, next) => {
  /* #swagger.security = [{
               "bearerAuth": []
        }] */
  next();
};

module.exports = swaggerSecurity;
