import TinderCard from "react-tinder-card";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ChatContainer from "../components/ChatContainer";
import axios from "axios";
import Utils from "../Utilities";

let API_URL = Utils.API_URL;

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [identifiedUsers, setIdentifiedUsers] = useState(null);
  const [lastDirection, setLastDirection] = useState();
  const [cookies] = useCookies(["user"]);
  const userId = cookies.UserId;

  const getUser = async () => {
    try {
      await axios
        .get(`${API_URL}/user`, { params: { userId } })
        .then((response) => {
          setUser(response.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getIdentifiedUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/identified-users`, {
        params: { ident: user?.interest },
      });
      setIdentifiedUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      getIdentifiedUsers();
    }
  }, [user]);

  const updateMatches = async (matchedUserId) => {
    try {
      await axios.put(`${API_URL}/addmatch`, {
        userId,
        matchedUserId,
      });
      getUser();
    } catch (error) {
      console.log(error);
    }
  };

  const swiped = (direction, swipedUserId) => {
    if (direction === "right") {
      updateMatches(swipedUserId);
    }
    setLastDirection(direction);
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
  };

  const matchedUserIds = user?.matches
    .map(({ user_id }) => user_id)
    .concat(userId);

  const filteredIdentifiedUsers = identifiedUsers?.filter(
    (identifiedUser) => !matchedUserIds.includes(identifiedUser.user_id)
  );

  return (
    <>
      {user && (
        <div className="dashboard">
          <ChatContainer user={user} />
          <div className="swipe-container">
            <div className="curd-container">
              {filteredIdentifiedUsers?.length > 0 ? (
                filteredIdentifiedUsers.map((identifiedUser) => {
                  if (!identifiedUser.url) {
                    return (
                      <p key={identifiedUser.user_id}>No image available</p>
                    );
                  }
                  return (
                    <TinderCard
                      className="swipe"
                      key={identifiedUser.user_id}
                      onSwipe={(dir) => swiped(dir, identifiedUser.user_id)}
                      onCardLeftScreen={() =>
                        outOfFrame(identifiedUser.first_name)
                      }
                    >
                      <div
                        style={{
                          backgroundImage: `url(${identifiedUser.url})`,
                        }}
                        className="curd"
                      >
                        <h3>{identifiedUser.first_name}</h3>
                      </div>
                    </TinderCard>
                  );
                })
              ) : (
                <p>No users available to swipe</p>
              )}
              <div className="swipe-info">
                {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
