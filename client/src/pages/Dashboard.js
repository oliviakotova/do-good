import Curd from "react-tinder-card";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ChatContainer from "../components/ChatContainer";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [identifiedUsers, setIdentifiedUsers] = useState(null);
  const [lastDirection, setLastDirection] = useState();
  const [cookies] = useCookies(["user"]);

  const userId = cookies.UserId;
  //console.log(userId)
  const getUser = async () => {
    try {
      await axios
        .get("http://localhost:8000/user", {
          params: { userId },
        })
        .then((response) => {
          setUser(response.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  //console.log('1', user)

  // get all identified users
  const getIdentifiedUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/identified-users",
        {
          params: { ident: user?.interest },
        }
      );
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
  // useEffect(() => {
  //   getUser();
  //   getIdentifiedUsers();
  // }, [user, identifiedUsers]);

  //console.log("user", user);
  //console.log("identified users", identifiedUsers);

  const updateMatches = async (matchedUserId) => {
    try {
      await axios.put("http://localhost:8000/addmatch", {
        userId,
        matchedUserId,
      });
      getUser();
    } catch (error) {
      console.log(error);
    }
  };

  //console.log(user);

  const swiped = (direction, swipedUserId) => {
    if (direction === "right") {
      updateMatches(swipedUserId);
    }
    //console.log("removing: " + nameToDelete);
    setLastDirection(direction);
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
  };
  // matched users ids + logged user
  const matchedUserIds = user?.matches
    .map(({ user_id }) => user_id)
    .concat(userId);

  //filter for matching users
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
              {filteredIdentifiedUsers?.map((identifiedUser) => (
                <Curd
                  className="swipe"
                  key={identifiedUser.user_id}
                  onSwipe={(dir) => swiped(dir, identifiedUser.user_id)}
                  onCardLeftScreen={() => outOfFrame(identifiedUser.first_name)}
                >
                  <div
                    style={{
                      backgroundImage: "url(" + identifiedUser.url + ")",
                    }}
                    className="curd"
                  >
                    <h3>{identifiedUser.first_name}</h3>
                  </div>
                </Curd>
              ))}
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
