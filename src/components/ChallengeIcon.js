import React from "react";
import colors from "../constants/colors";

import Icon from "./Icon";
import Score from "./Score";
import Spacer from "./Spacer";

const ChallengeIcon = ({
  onPress,
  color = colors.medium,
  score,
  size = 50,
}) => {
  return (
    <>
      <Spacer b={40}>
        <Score score={score} size={size} />
      </Spacer>
      <Icon
        name="heart"
        size={size - (5 / size) * 100}
        onPress={onPress}
        color={color}
      />
    </>
  );
};
export default ChallengeIcon;
