import { useCookies } from "react-cookie";

const ChatHeader = ({ user }) => {
  const [cookies, removeCookie] = useCookies(["user"]);

  const logout = () => {
    removeCookie("UserId", cookies.UserId);
    removeCookie("AuthToken", cookies.AuthToken);
    //reloading the page
    window.location.reload();
  };

  return (
    <div className="chat-container-header">
      <div className="profile">
        <div className="img-container" alt="hands together">
          <img src={user.url} alt={"photo of " + user.first_name} />
        </div>
        <h3>{user.first_name}</h3>
      </div>
      <i className="log-out-icon" onClick={logout}>
        ⇦
      </i>
    </div>
  );
};

export default ChatHeader;
