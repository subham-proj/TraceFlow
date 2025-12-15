export const validatePayload = (payload: any): string | null => {
  if (!payload || typeof payload !== "object") {
    return "Invalid payload format";
  }

  if (!payload.org_id || typeof payload.org_id !== "string") {
    return "Missing or invalid org_id";
  }

  if (!payload.project_id || typeof payload.project_id !== "string") {
    return "Missing or invalid project_id";
  }

  if (!payload.events || !Array.isArray(payload.events)) {
    return "Missing or invalid events array";
  }

  return null; // No error
};
