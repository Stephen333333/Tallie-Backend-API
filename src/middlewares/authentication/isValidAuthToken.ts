import jwt from "jsonwebtoken";

export async function isValidAuthToken(req: any, res: any, next: any) {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET!;

    if (!token) {
      return res.status(401).json({
        success: false,
        result: null,
        message: `No authentication token, authorization denied. `,
        jwtExpired: true,
      });
    }

    let verified: {
      id: string;
      tenantCompanyId: string;
      role: string;
      isPro?: boolean;
    };
    try {
      verified = jwt.verify(token, jwtSecret as string) as unknown as {
        id: string;
        tenantCompanyId: string;
        role: string;
        isPro?: boolean;
      };
    } catch (err) {
      return res.status(401).json({
        success: false,
        result: null,
        message: `Token verification failed or expired, authorization denied.`,
        jwtExpired: true,
      });
    }
    
    req.verified = verified;
    next();
  } catch (error: any) {
    console.error(error);
    return res.status(503).json({
      success: false,
      result: null,
      message: error.message || "Internal Server Error",
      error: error,
      controller: "isValidAuthToken",
    });
  }
}
