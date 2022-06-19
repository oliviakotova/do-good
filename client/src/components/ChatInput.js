import { useState } from "react";
import axios from "axios";
import Utils from "../Utilities";

let API_URL = Utils.API_URL;

const ChatInput = ({
  user,
  clickedUser,
  getUsersMessages,
  getClickedUserMessages,
}) => {
  const [textArea, setTextArea] = useState("");
  const userId = user?.user_id;
  const clickUserId = clickedUser?.user_id;

  const addMessage = async () => {
    const message = {
      timestamp: new Date().toISOString(),
      from_userId: userId,
      to_userId: clickUserId,
      message: textArea,
    };

    try {
      await axios.post(`${API_URL}/message`, {
        message,
      });
      getUsersMessages();
      getClickedUserMessages();
      setTextArea("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="chat-input">
      <textarea
        value={textArea}
        onChange={(e) => setTextArea(e.target.value)}
      />
      <button className="secondary-button" onClick={addMessage}>
        Submit
      </button>
    </div>
  );
};

export default ChatInput;
