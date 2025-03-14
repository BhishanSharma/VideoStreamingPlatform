// Instead of wrapping the function every time in async and try-catch use this utility
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};

export { asyncHandler };

// OR

// const asyncHandler = (requestHandler) => async (req, res, next) => {
//   try {
//     await requestHandler();
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
