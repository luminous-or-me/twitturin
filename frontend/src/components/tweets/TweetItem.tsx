import styled from "styled-components";
import { Tweet } from "../../types";
import emptyProfilePicture from "../../assets/images/empty-profile-picture.png";
import emptyHeart from "../../assets/icons/heart.svg";
import filledHeart from "../../assets/icons/filledHeart.svg";
import repliesIcon from "../../assets/icons/replies.svg";
import shareIcon from "../../assets/icons/share.svg";
import VerticalList from "../lists/VerticalList";
import HorizontalList from "../lists/HorizontalList";
import IconButton from "../core/IconButton";
import RouterLink from "../core/RouterLink";
import { useLikeTweetMutation } from "../../services/api";
import { useUnlikeTweetMutation } from "../../services/api";
import { useAppSelector } from "../../hooks/store";
import { useNavigate } from "react-router-dom";

const Wrapper = styled(HorizontalList)`
  background-color: white;
  border: 2px solid ${(props) => props.theme.colors.grey4};
  border-radius: 5px;
  padding: 1em;
  min-width: 500px;
`;

const FullName = styled(RouterLink)`
  color: ${(props) => props.theme.colors.grey1};
  font-weight: bold;
`;

const Username = styled(RouterLink)`
  color: ${(props) => props.theme.colors.grey2};
  font-size: ${(props) => props.theme.fontSizes.extraSmall};
`;

const ProfilePicture = styled.img`
  width: 2em;
  height: 2em;
  box-sizing: border-box;
  border-radius: 10em;
`;

const Body = styled(VerticalList)`
  padding-left: 1em;
  gap: 1em;
`;

const TweetItem = ({ tweet }: { tweet: Tweet }) => {
  const [like] = useLikeTweetMutation();
  const [unlike] = useUnlikeTweetMutation();
  const navigate = useNavigate();
  const userId = useAppSelector(({ auth }) => auth.id);

  const likedByMe = userId && tweet.likedBy.map((u) => u.id).includes(userId);

  const handleLike = async () => {
    if (!userId) {
      navigate("/login");
    } else {
      if (!likedByMe) await like(tweet.id);
      else await unlike({ id: tweet.id, userId });
    }
  };

  return (
    <Wrapper>
      <RouterLink to={`/users/${tweet.author.id}`}>
        <ProfilePicture src={emptyProfilePicture} />
      </RouterLink>

      <Body>
        <HorizontalList $center $gap="0.5em">
          <FullName to={`/users/${tweet.author.id}`}>
            {tweet.author.fullName || "Twittur User"}
          </FullName>

          <Username to={`/users/${tweet.author.id}`}>
            @{tweet.author.username}
          </Username>
        </HorizontalList>

        <RouterLink to={`/tweets/${tweet.id}`}>{tweet.content}</RouterLink>

        <HorizontalList $gap="0.5em">
          {likedByMe ? (
            <IconButton
              icon={filledHeart}
              label={tweet.likes}
              onClick={handleLike}
            />
          ) : (
            <IconButton
              icon={emptyHeart}
              label={tweet.likes}
              onClick={handleLike}
            />
          )}

          <RouterLink to={`/tweets/${tweet.id}`}>
            <IconButton icon={repliesIcon} label={tweet.replyCount} />
          </RouterLink>

          <IconButton icon={shareIcon} label={0} />
        </HorizontalList>
      </Body>
    </Wrapper>
  );
};

export default TweetItem;
