
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; 

export function validateImageFile(file) {
  if (!file) return "No file selected.";

  const { type, size } = file;

  if (!type.startsWith("image/")) {
    return "Only image files are allowed.";
  }

  if (size > MAX_IMAGE_SIZE) {
    return "Image size exceeds 2 MB limit.";
  }

  return null;
}
