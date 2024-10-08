
type Platform = "android" | "ios";
type Field = "Strategy" | "Mapping" | "Construction" | "Stabilization";

export type Feature = {
  [K in `${Platform}${Field}`]?: string;
} & {
  androidProgress?: string;
  iosProgress?: string;
};

export const calculateProgress = (feature: Feature, platform: "android" | "ios") => {
  const fields: ("Strategy" | "Mapping" | "Construction" | "Stabilization")[] = ["Strategy", "Mapping", "Construction", "Stabilization"];
  const sum = fields.reduce(
    (acc, field) => acc + Number(feature[`${platform}${field}`] || 0),
    0
  );
  return ((sum / (fields.length * 100)) * 100).toFixed(2);
};

export const calculateTotalProgress = (feature: Feature) => {
  const androidProgress = Number(feature.androidProgress || 0);
  const iosProgress = Number(feature.iosProgress || 0);
  return ((androidProgress + iosProgress) / 2).toFixed(2);
};