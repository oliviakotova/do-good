import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Utils from "../Utilities";

let API_URL = Utils.API_URL;

const MatchesDisplay = ({ matches, setClickedUser }) => {
  const [matchedProfiles, setMatchedProfiles] = useState(null);
  const [cookies] = useCookies(null);

  //shoving and maping  users after filter reterning array users id
  const matchedUserIds = matches.map(({ user_id }) => user_id);
  const userId = cookies.UserId;

  // sending to localhost:8000/users an array of match user ids
  const getMatches = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        params: { userIds: JSON.stringify(matchedUserIds) },
      });
      setMatchedProfiles(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMatches();
  }, [matches]);

  //function whis that only maches users who mashed together

  const filteredIdentifiedProfiles = matchedProfiles?.filter(
    (matchedProfile) =>
      matchedProfile.matches.filter((profile) => profile.user_id === userId)
        .lengh > 0
  );
  //console.log(matchedProfiles);

  //if matches profili exist show eatch match profile vith index-key
  //if replace matchedProfile? to filteredIdentifiedProfiles then match will be between both chousen peoples
  return (
    <div className="matches-display">
      {matchedProfiles?.map((match) => (
        <div
          key={match.user_id}
          className="match-card"
          onClick={() => setClickedUser(match)}
        >
          <div className="img-container">
            <img src={match?.url} alt={match?.first_name + " profile"} />
          </div>
          <h3>{match?.first_name}</h3>
        </div>
      ))}
    </div>
  );
};

export default MatchesDisplay;
