import mongoose from "mongoose";

export async function reqConfiguration(req: any, res: any, next: any) {
  try {
    const verified: {
      id: string;
      tenantCompanyId: string;
      role: string;
      isPro?: boolean;
    } = req.verified;

    if (!verified) {
      return res.status(401).json({
        success: false,
        result: null,
        message: "Unauthorized",
        jwtExpired: true,
      });
    }
    // req configuration
    req.admin = {};
    req.admin._id = verified.id;
    req.admin.role = verified.role;
    req.admin.isPro = verified.isPro;
    req.body.tenantId = new mongoose.Types.ObjectId(verified.id);
    req.body.createdBy = verified.id;
    req.body.updatedBy = verified.id;

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
