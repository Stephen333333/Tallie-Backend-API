export const catchErrors = (fn: any) => {
  return function (req: any, res: any, next: any) {
    return fn(req, res, next).catch((error: any) => {
      if (error.name == 'ValidationError') {
        console.error(error);
        return res.status(400).json({
          success: false,
          result: null,
          message: 'Required fields are not supplied',
          error: error,
        });
      } else {
        // Server Error
        console.error(error);
        console.error("error in catchErrors");
        return res.status(500).json({
          success: false,
          result: null,
          message: error.message,
          error: error,
        });
      }
    });
  };
};

export const notFound = (req: any, res: any, next: any) => {
  console.error('api url not found for: ' + req.originalUrl + " method: " + req.method);
  return res.status(404).json({
    success: false,
    message: "Api url doesn't exist ",
  });
};

export const catchAsync = <T extends (...args: any[]) => Promise<any>>(fn: T) => {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
};


export const productionErrors = (error: any, req: any, res: any, next: any) => {
  console.log(error);
  console.error("error in productionErrors");
  return res.status(500).json({
    success: false,
    message: error.message,
    error: error,
  });
};
