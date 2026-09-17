const asyncHandler = (fn) => async (req, res, next) => {
  try {
    return await fn(req, res, next);
  } catch (error) {
    // 1. Check for .statusCode (from apiError) OR .code (standard Node errors)
    const statusCode = error.statusCode || error.code || 500;

    // 2. Log the actual error to your terminal so you can see what's wrong
    // console.error("AsyncHandler caught error:", error.message);

    // 3. Send the response
    res.status(typeof statusCode === 'number' && statusCode >= 100 && statusCode < 600 ? statusCode : 500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
    
  }
};

export default asyncHandler;