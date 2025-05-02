import React, { useCallback, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import Icons from "../../shared/icons";
import { useAppDispatch, useAppSelector } from "../../shared/rdx-hooks";
import { updateMessages } from "../../shared/rdx-slice";
import { TMessage } from "../../shared/types";
import { socket_inst, sendMessage, joinChannel } from "../../shared/functions";

const TextBox = React.memo(() => {
  const routeParams = useParams();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textBoxRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector(state => state.main.user_profile);
  const channelId = routeParams.channelId || '';

  // Join the channel when it changes
  useEffect(() => {
    if (channelId) {
      joinChannel(channelId);
    }
  }, [channelId]);

  // Update placeholder text when channel changes
  useEffect(() => {
    updatePlaceholder('');
    if (textBoxRef.current) {
      textBoxRef.current.innerText = '';
    }
  }, [channelId]);

  // Update container height and placeholder text
  const updatePlaceholder = (text: string) => {
    document.documentElement.style.setProperty(
      '--text-box-placeholder',
      text ? '""' : `"Message #${channelId}"`
    );
  };

  const handleOnInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    // Update container height
    if (containerRef.current) {
      document.documentElement.style.setProperty(
        '--text-box-container-height',
        `${containerRef.current.clientHeight}px`
      );
    }

    // Update placeholder
    const target = e.currentTarget;
    updatePlaceholder(target.innerText);
  }, [channelId]);

  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    // Send message on Enter (but not with Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      const target = e.currentTarget;
      const message = target.innerText.trim();

      if (!message) return;

      // Create message object
      const messageObj: TMessage = {
        message: message,
        profile: userProfile,
        date: new Date().toLocaleString(),
        channelId: channelId
      };

      // Update messages in Redux
      dispatch(updateMessages(messageObj));

      // Send message through socket
      socket_inst.emit('send-message', messageObj);

      // Also call the sendMessage function for compatibility
      sendMessage(message, channelId, userProfile);

      // Clear input
      target.innerText = '';
      updatePlaceholder('');
    }
  }, [channelId, userProfile, dispatch]);

  // Handle paste to strip formatting
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  // Prevent default on Enter key
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid new line
    }
  }, []);

  // Equivalent to useLayoutEffect in the second implementation
  useEffect(() => {
    document.documentElement.style.setProperty('--text-box-placeholder', `"Message #${channelId}"`);
  }, [channelId]);

  return (
    <div ref={containerRef} className="text-box-container">
      <div
        ref={textBoxRef}
        className="text-box-main"
        contentEditable={true}
        onInput={handleOnInput}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onPaste={handlePaste}
      ></div>

      <div className="left-icon">
        <Icons.PlusCircle />
      </div>
      <div className="right-icons">
        <Icons.GiftBox />
        <Icons.GifIcon className='gif' />
        <Icons.SmileyFaceBox />
        <Icons.SmileyFace />
      </div>
    </div>
  );
});

export default TextBox;
