import React, { useRef, useState, useEffect } from 'react';
import { FaPhotoVideo } from 'react-icons/fa';
import { BsEmojiSmile } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';
import { showToast } from '../toast-notification/CustomToast';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react'; // ✅ emoji-picker-react

const PostCreationModalContent = ({
  postText,
  setPostText,
  mediaFile,
  setMediaFile,
  existingMediaUrl,
  previewURL,
  setPreviewURL,
}) => {

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef();
  const textareaRef = useRef();
  const [emojiTheme, setEmojiTheme] = useState("light");

  useEffect(() => {
    if (!mediaFile && existingMediaUrl && !previewURL) {
      setPreviewURL(existingMediaUrl);
    }
  }, [mediaFile, existingMediaUrl, previewURL]);



  //handle imoji theme dark or white 
  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setEmojiTheme(isDark ? "dark" : "light");
    };

    // Initial check
    updateTheme();

    // Observe class changes (optional for dynamic switching)
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const type = file.type;
    if (!type.startsWith("image/") && !type.startsWith("video/")) {
      showToast("Only image or video allowed", "error");
      return;
    }

    setMediaFile(file);
    setPreviewURL(URL.createObjectURL(file));
    e.target.value = null;
  };

  const removeMedia = () => {
    setMediaFile(null);
    setPreviewURL(null);
    fileInputRef.current.value = null;
  };
  // handle the imoji : show in the cursor place 
  const handleEmojiClick = (emojiData) => {
    const textarea = textareaRef.current;
    const emoji = emojiData.emoji;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = postText;

    const newText = text.slice(0, start) + emoji + text.slice(end);
    setPostText(newText);

    // Move cursor right after the emoji
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);


  };


  const isImage =
    (mediaFile && mediaFile.type.startsWith("image/")) ||
    (!mediaFile && previewURL && /\.(jpeg|jpg|png|gif|webp)$/i.test(previewURL));

  const isVideo =
    (mediaFile && mediaFile.type.startsWith("video/")) ||
    (!mediaFile && previewURL && /\.(mp4|webm|ogg)$/i.test(previewURL));


  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <textarea
          ref={textareaRef}
          placeholder="What's on your mind?"
          className="w-full text-md bg-transparent resize-none placeholder-gray-500 dark:placeholder-zinc-400 focus:outline-none min-h-[350px] scrollbar-hide"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        />

        {previewURL && (
          <div className="relative w-full">
            <button
              onClick={removeMedia}
              className="absolute top-2 right-2 z-10 bg-white dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 text-gray-700 dark:text-white rounded-full p-1"
            >
              <AiOutlineClose size={22} />
            </button>

            {isImage ? (
              <img
                src={previewURL}
                alt="Preview"
                className="w-full max-h-[400px] object-contain rounded-lg border border-zinc-500 dark:border-zinc-600"
              />
            ) : (
              <video
                src={previewURL}
                controls
                className="w-full max-h-[400px] object-contain rounded-lg border border-zinc-500 dark:border-zinc-600"
              />
            )}
          </div>
        )}
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 z-50">
          <EmojiPicker
            emojiStyle={EmojiStyle.NATIVE} // or use TWITTER / APPLE if desired
            onEmojiClick={handleEmojiClick}
            height={350}
            theme={emojiTheme}
          />
        </div>
      )}

      {/* Footer Icons */}
      <div className="flex items-center gap-6 p-4 border-t border-gray-200 dark:border-zinc-600">
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="text-zinc-500 dark:text-zinc-200 hover:text-green-500 dark:hover:text-green-500 transition-colors"
        >
          <FaPhotoVideo size={22} />
        </button>

        <button
          type="button"
          className="text-zinc-500 dark:text-zinc-200 hover:text-green-500 dark:hover:text-green-500 transition-colors"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          <BsEmojiSmile size={22} />
        </button>

        <input
          type="file"
          accept="image/*,video/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleMediaChange}
        />
      </div>
    </div>
  );
};

export default PostCreationModalContent;
