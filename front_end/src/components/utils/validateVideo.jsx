
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; 

export function validateVideoFile(file) {
  if (!file) return "No file selected.";

  const { type, size } = file;

  if (!type.startsWith("video/")) {
    return "Only video files are allowed.";
  }

  if (size > MAX_VIDEO_SIZE) {
    return "Video size exceeds 10 MB limit.";
  }

  return null;
}
