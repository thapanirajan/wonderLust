
// Wraps an asynchronous function to catch any errors and pass them to the next middleware 
// It is basically try catch block 
module.exports = function wrapasync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
};
