import styled from "styled-components";
import Box from "../../containers/Box";
import LoadingElement from "../LoadingElement";

const LoadingButton = styled(LoadingElement)`
  width: 40px;
`;

const LoadingProfilePicture = styled(LoadingElement)`
  border-radius: 10em;
`;

const LoadingTweetItem = () => {
  return (
    <Box
      $gap="1em"
      $pad="l"
      $bg="white"
      $horizontal
      $width="500px"
    >
      <LoadingProfilePicture $width="2em" $height="2em" />

      <Box $gap="1em" $width="300px">
        <Box $horizontal $center $gap="0.5em">
          <LoadingElement $height="1.2em" />

          <LoadingElement $height="1.2em" />
        </Box>

        <LoadingElement $height="1.2em" />

        <Box $horizontal $gap="0.5em">
          <LoadingButton />

          <LoadingButton />

          <LoadingButton />
        </Box>
      </Box>
    </Box>
  );
};

export default LoadingTweetItem;
