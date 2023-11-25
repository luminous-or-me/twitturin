import { NewReply, Reply } from "../types";
import { api } from "./api";
import { tweetsApi } from "./tweetsService";

export const repliesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    reply: builder.mutation<Reply, NewReply>({
      query: ({ content, parent, parentId: id }) => ({
        url: parent === "tweet" ? `tweets/${id}/replies` : `replies/${id}`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["User", "Tweet"],
      async onQueryStarted({ parentId: id }, { dispatch, queryFulfilled }) {
        try {
          const { data: addedReply } = await queryFulfilled;

          dispatch(
            tweetsApi.util.updateQueryData("getTweets", undefined, (draft) => {
              const tweet = draft.find((t) => t.id === id);

              if (!tweet) return draft;

              const newTweet = {
                ...tweet,
                replies: tweet.replies.concat(addedReply),
                replyCount: tweet.replyCount + 1,
              };

              return draft.map((t) => (t.id !== id ? t : newTweet));
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    likeReply: builder.mutation<Reply, { id: string }>({
      query: ({ id }) => ({
        url: `replies/${id}/likes`,
        method: "POST",
      }),
      invalidatesTags: ["Tweet", "User"],
    }),
  }),
});

export const { useReplyMutation, useLikeReplyMutation } = repliesApi;
