import styled from "styled-components";
import { icons, pictures } from "../../../assets";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteUserMutation,
  useGetUserQuery,
} from "../../../services/usersService";
import LoadingUserProfile from "../../util/LoadingUserProfile";
import Box from "../../containers/Box";
import Label from "../../core/text/Label";
import Heading from "../../core/text/Heading";
import TweetList from "../../tweets/TweetList";
import RouterLink from "../../core/RouterLink";
import FollowButton from "../FollowButton";
import { User } from "../../../types";
import PageNotFound from "../../util/PageNotFound";
import { useEffect, useState } from "react";
import ReplyList from "../../replies/ReplyList";
import { useGetUserRepliesQuery } from "../../../services/repliesService";
import LoadingReplyList from "../../util/LoadingReplyList";
import {
  useGetLikedTweetsQuery,
  useGetTweetsQuery,
} from "../../../services/tweetsService";
import LoadingTweetList from "../../util/LoadingTweetList";
import Empty from "../../util/Empty";
import FlatButton from "../../core/buttons/FlatButton";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import { removeCredentials } from "../../../reducers/authReducer";
import storageService from "../../../services/storageService";
import { hide, show } from "../../../reducers/loadingStripeReducer";

const Banner = styled.div`
  position: relative;
  height: 170px;
  background: linear-gradient(45deg, #555555, #333333);
`;

const ProfilePicture = styled.img`
  position: absolute;
  width: 5em;
  height: 5em;
  box-sizing: border-box;
  overflow: hidden;
  border: 0.3em solid white;
  border-radius: 100em;
  bottom: -2.5em;
  left: 1em;
`;

const Username = styled(Label)`
  color: ${(props) => props.theme.colors.grey2};
`;

const ProfileHeader = ({ user }: { user: User }) => {
  return (
    <Box $bg="white" $gap="1.5em" $hide>
      <Banner>
        <ProfilePicture src={pictures.emptyProfilePicture} />
      </Banner>

      <Box $bg="white" $pad="l" $gap="1em">
        <Box>
          <Heading $level={3}>{user.fullName || "Twittur User"}</Heading>
          <Username>@{user.username}</Username>
        </Box>

        <Label>
          {user.bio || `This user does not appear to have any biography.`}
        </Label>
      </Box>
    </Box>
  );
};

const AdditionalInfoWrapper = styled(Box)`
  color: ${({ theme }) => theme.colors.grey2};
`;

const AdditionalInfo = ({ user }: { user: User }) => {
  const birthday = new Date(user.birthday);

  return (
    <Box $gap="1em" $pad="l" $bg="white">
      <AdditionalInfoWrapper $horizontal $center $gap="0.5em">
        {user.kind === "teacher" ? <icons.AwardIcon /> : <icons.InfoIcon />}

        {user.kind === "teacher" ? (
          <Label $size="extraSmall">TTPU Teacher ({user.subject})</Label>
        ) : (
          <Label $size="extraSmall">
            TTPU Student from {user.major} ({user.studentId})
          </Label>
        )}
      </AdditionalInfoWrapper>

      {user.country && (
        <AdditionalInfoWrapper $horizontal $center $gap="0.5em">
          <icons.MapPinIcon />
          <Label $size="extraSmall">{user.country}</Label>
        </AdditionalInfoWrapper>
      )}

      <AdditionalInfoWrapper $horizontal $center $gap="0.5em">
        <icons.CalendarIcon />
        <Label $size="extraSmall">
          {birthday.toDateString()} ({user.age} y.o.)
        </Label>
      </AdditionalInfoWrapper>
    </Box>
  );
};

const FollowWrapper = styled(Box)`
  justify-content: space-between;
`;

const FollowPanel = ({ user, id }: { user: User; id: string }) => {
  return (
    <FollowWrapper $pad="l" $bg="white" $horizontal $center>
      <Box $horizontal $gap="1.5em">
        <RouterLink to={`/users/${id}/followers`} $size="small">
          {user.followersCount} followers
        </RouterLink>

        <RouterLink to={`/users/${id}/following`} $size="small">
          {user.followingCount} following
        </RouterLink>
      </Box>

      <FollowButton user={user} />
    </FollowWrapper>
  );
};

type Section = "tweets" | "replies" | "likes" | "settings";

const SectionButton = styled.button<{ $active: boolean }>`
  width: 100%;
  color: ${(props) =>
    props.$active ? props.theme.colors.primary : props.theme.colors.grey2};
  padding: 0.7em;
  background-color: white;
  font-size: ${(props) => props.theme.fontSizes.small};
  /* font-weight: ${({ $active }) => ($active ? "bold" : "normal")}; */
  border: none;
  transition: 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.grey4};
    transition: 0.2s;
  }
`;

const UserTweets = ({ user }: { user: User }) => {
  const { data: tweets, isLoading } = useGetTweetsQuery(user.id);

  if (isLoading) return <LoadingTweetList />;

  return <TweetList tweets={tweets!} />;
};

const UserReplies = ({ user }: { user: User }) => {
  const { data: replies, isLoading } = useGetUserRepliesQuery(user.id);

  if (isLoading) return <LoadingReplyList />;

  return <ReplyList replies={replies!} />;
};

const LikedTweets = ({ user }: { user: User }) => {
  const { data: tweets, isLoading } = useGetLikedTweetsQuery(user.id);

  if (isLoading) return <LoadingTweetList />;

  if (!tweets) return <div>Some error occurred!</div>;

  if (tweets.length === 0) return <Empty />;

  return <TweetList tweets={tweets} />;
};

const NavButton = styled(FlatButton)`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  padding: 0.9em 1em;
`;

const DeleteButton = styled(NavButton)`
  color: #ff0037;

  &:hover {
    color: #ff0037;
  }
`;

const Settings = ({ user }: { user: User }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [deleteUser, { isLoading, isSuccess }] = useDeleteUserMutation();

  useEffect(() => {
    if (isLoading) dispatch(show());
  }, [dispatch, isLoading]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(hide());
      dispatch(removeCredentials());
      storageService.removeAuthUser();
      navigate("/");
    }
  }, [isSuccess, dispatch, navigate]);

  const handleSignOut = () => {
    storageService.removeAuthUser();

    dispatch(removeCredentials());
  };

  const handleDeleteProfile = async () => {
    if (confirm("Are you sure you want to delete your profile?")) {
      console.log("deleting profile...");

      await deleteUser(user.id);
    }
  };

  return (
    <Box $gap="0.1em">
      <NavButton
        label="Edit Profile"
        icon={<icons.EditIcon />}
        onClick={() => navigate("/edit-profile")}
      />
      <DeleteButton
        label="Delete Profile"
        icon={<icons.TrashIcon />}
        onClick={handleDeleteProfile}
      />
      <NavButton
        label="Log out"
        icon={<icons.LogOutIcon />}
        onClick={handleSignOut}
      />
    </Box>
  );
};

const UserPage = () => {
  const id = useParams().id;
  const myId = useAppSelector(({ auth }) => auth.id);
  const [section, setSection] = useState<Section>("tweets");
  const { data: user, isLoading, isError } = useGetUserQuery(id!);

  if (isLoading) return <LoadingUserProfile />;

  if (!user) return <PageNotFound />;

  if (isError) return <PageNotFound />;

  return (
    <Box $gap="0.1em" $width="500px">
      <ProfileHeader user={user} />

      <AdditionalInfo user={user} />

      <FollowPanel id={id!} user={user} />

      <Box $bg="white" $horizontal>
        <SectionButton
          $active={section === "tweets"}
          onClick={() => setSection("tweets")}
        >
          Tweets
        </SectionButton>
        <SectionButton
          $active={section === "replies"}
          onClick={() => setSection("replies")}
        >
          Replies
        </SectionButton>
        <SectionButton
          $active={section === "likes"}
          onClick={() => setSection("likes")}
        >
          Likes
        </SectionButton>
        {id === myId && (
          <SectionButton
            $active={section === "settings"}
            onClick={() => setSection("settings")}
          >
            Settings
          </SectionButton>
        )}
      </Box>

      {section === "tweets" && <UserTweets user={user} />}
      {section === "replies" && <UserReplies user={user} />}
      {section === "likes" && <LikedTweets user={user} />}
      {section === "settings" && id === myId && <Settings user={user} />}
    </Box>
  );
};

export default UserPage;
