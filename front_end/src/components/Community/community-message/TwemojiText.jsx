import React, { useEffect, useRef } from "react";
import twemoji from "twemoji";

const isSingleEmoji = (text) => {
  const cleaned = text.trim();
  // Regex that matches exactly one emoji (unicode + variation selectors)
  const match = cleaned.match(/^(?:\p{Extended_Pictographic}\uFE0F?|\p{Emoji_Presentation})$/u);
  return match !== null;
};

const TwemojiText = ({ text }) => {
  const spanRef = useRef(null);
  const oneEmojiOnly = isSingleEmoji(text);

  useEffect(() => {
    if (spanRef.current) {
      spanRef.current.innerHTML = twemoji.parse(text, {
        folder: "72x72",
        ext: ".png",
        base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
        className: oneEmojiOnly
          ? "inline-block w-12 h-12 mx-1 align-middle"
          : "inline-block w-5 h-5 mx-0.5 align-middle",
      });
    }
  }, [text, oneEmojiOnly]);

  return <span ref={spanRef} className="inline" />;
};

export default TwemojiText;
