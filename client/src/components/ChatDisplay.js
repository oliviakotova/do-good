import axios from "axios";
import { useState, useEffect } from "react";
import Chat from "./Chat";
import ChatInput from "./ChatInput";

//display user and this clicked user
const ChatDisplay = ({ user, clickedUser }) => {
  //if user exist
  const userId = user?.user_id;
  //and user clicked exist
  const clickedUserId = clickedUser?.user_id;
  const [usersMessages, setUsersMessages] = useState(null);
  const [clickedUsersMessages, setClickedUsersMessages] = useState(null);

  // get messages from user to corresponding(chosen) user
  const getUsersMessages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/messages", {
        params: { userId: userId, correspondingUserId: clickedUserId },
      });

      setUsersMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // get messages from corresponding(chosen) user to logged user
  const getClickedUsersMessages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/messages", {
        params: { userId: clickedUserId, correspondingUserId: userId },
      });

      setClickedUsersMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  //getClickedUsersMessages()
  useEffect(() => {
    getUsersMessages();
    getClickedUsersMessages();
  }, []);

  const messages = [];

  //console.log("userMessages", usersMessages);

  usersMessages?.forEach((message) => {
    //object
    const formattedMessage = {};
    //create property called name
    formattedMessage["name"] = user?.first_name;
    //create property called img/avatar
    formattedMessage["img"] = user?.url;
    //create property for actuall message
    formattedMessage["message"] = message.message;
    formattedMessage["timestamp"] = message.timestamp;
    //push messages into array const formattedMessage = {};
    messages.push(formattedMessage);
  });

  clickedUsersMessages?.forEach((message) => {
    //object
    const formattedMessage = {};
    //create property called name
    formattedMessage["name"] = clickedUser?.first_name;
    //create property called img/avatar
    formattedMessage["img"] = clickedUser?.url;
    //create property for actuall message
    formattedMessage["message"] = message.message;
    formattedMessage["timestamp"] = message.timestamp;
    //push messages into array const formattedMessage = {};
    messages.push(formattedMessage);
  });

  //console.log("userMessages", usersMessages);
  //console.log("formattedMessage", messages);

  //sort massages from first to next
  const descendingOrderMessages = messages?.sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp)
  );

  return (
    <>
      <Chat descendingOrderMessages={descendingOrderMessages} />
      <ChatInput
        user={user}
        clickedUser={clickedUser}
        getUsersMessages={getUsersMessages}
        getClickedUsersMessages={getClickedUsersMessages}
      />
    </>
  );
};

export default ChatDisplay;
