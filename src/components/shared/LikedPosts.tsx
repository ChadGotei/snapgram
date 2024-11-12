import { useGetCurrentUser } from "@/lib/react-query/queryAndMutations";
import GridPostList from "./GridPostList";

const LikedPosts = () => {
  const { data: currentUser } = useGetCurrentUser();
  
  const likedPosts = currentUser?.liked || [];

  return (
    <>
      {likedPosts.length === 0 ? (
        <p className="text-light-4">No liked posts</p>
      ) : (
        <GridPostList posts={likedPosts} showStats={false} />
      )}
    </>
  );
};

export default LikedPosts;
