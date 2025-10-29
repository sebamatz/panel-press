export const normalizeRowForSave = (row: Record<string, any>) => {
    const normalized: Record<string, any> = { ...row };
    Object.keys(normalized).forEach((key) => {
      const fieldLower = key.toString().toLowerCase();
      const value = normalized[key];
      if ((fieldLower === "gemisi" || fieldLower === "lamarina") && value != null) {
        if (Array.isArray(value)) {
          normalized[key] = value.map((v) => (v && typeof v === "object" && v.id != null) ? v.id : v);
        } else if (typeof value === "object") {
          normalized[key] = value.name != null ? value.name : value;
        }
      }
    });
    return normalized;
  }

  export function parseValues(values?: string | null): any[] {
    if (!values) return [];
    if (typeof values === "object") return values as any[];
    try {
      const cleaned = (values as string)
        .replace(/\n/g, "")
        .replace(/\r/g, "")
        .trim();
      const parsed = JSON.parse(cleaned);
      // If object with nested array (e.g. { gemisi: [...] }) return inner array
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const firstKey = Object.keys(parsed)[0];
        if (Array.isArray((parsed as any)[firstKey])) {
          return (parsed as any)[firstKey];
        }
      }
      return parsed;
    } catch (e) {
      console.error("Failed to parse values:", values, e);
      return [];
    }
  }
  