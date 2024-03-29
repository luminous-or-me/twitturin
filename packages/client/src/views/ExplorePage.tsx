import useField from "../hooks/useField";
import { useSearchQuery } from "../services/searchService";
import Box from "../components/containers/Box";
import Input from "../components/core/inputs/Input";
import UserItem from "../components/users/UserItem";
import LoadingUserItem from "../components/util/LoadingUserItem";
import Empty from "../components/util/Empty";
import PageHeading from "../components/util/PageHeading";

type Props = {
  keyword: {
    value: string;
    onChange: (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => void;
    type?: string;
    placeholder?: string;
  };
};

const SearchField = ({ keyword }: Props) => {
  return (
    <Box $bg="white" $pad="l">
      <Input {...keyword} />
    </Box>
  );
};

const SearchLists = ({ keyword }: Props) => {
  const {
    data: results,
    isLoading,
    isFetching,
  } = useSearchQuery(keyword.value, {
    skip: !keyword.value,
  });

  if (isLoading || isFetching)
    return (
      <Box $gap="0.1em">
        <PageHeading label="Found Users" level={4} />

        <>
          <LoadingUserItem />
          <LoadingUserItem />
          <LoadingUserItem />
        </>
      </Box>
    );

  return (
    <Box $gap="0.1em">
      <PageHeading label="Found Users" level={4} />

      {keyword.value &&
        (results?.users.length === 0 ? (
          <Empty />
        ) : (
          <>
            {(results?.users || []).map((u) => (
              <UserItem key={u.id} user={u} />
            ))}
          </>
        ))}
    </Box>
  );
};

const ExplorePage = () => {
  const [, keyword] = useField("text", "Search");

  return (
    <Box $width="500px" $gap="0.1em">
      <PageHeading label="Explore" />

      <SearchField keyword={keyword} />

      <SearchLists keyword={keyword} />
    </Box>
  );
};

export default ExplorePage;
