const { date } = require("joi");

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found', req.originalUrl);
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack,
  });
}

function timeSign(req, res, next) {
  res.setHeader("Accepted-at", new Date().toISOString());
  next();
}

//  const timeSign = (req, res, next) => {
//   res.setHeader("b-Time", new Date().toISOString());
//   next();
// };

// const timeSign = function (req, res, next) {
//      res.setHeader('Accepted-at', new Date().toISOString());
//      next();
// };
  

module.exports = {
  notFound,
  errorHandler,
  timeSign
};
