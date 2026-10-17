export function sourceFileError(info) {
  if (!info.isFile()) return "The selected item is not a file. Choose the video recording itself.";
  if (info.size === 0) return "The selected video is empty (0 bytes). Choose the complete recording.";
  if (!Number.isSafeInteger(info.size) || info.size < 0) return "The file size could not be read correctly. Choose the video again.";
  return null;
}
