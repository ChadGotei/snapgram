import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import TopCreators from "@/components/shared/TopCreators"; // Import the sidebar component
import { useGetRecentPosts } from "@/lib/react-query/queryAndMutations";
import { Models } from "appwrite";

const Home = () => {
  const { data: posts, isLoading: isPostLoading } = useGetRecentPosts();

  return (
    <div className="flex flex-1 h-screen overflow-hidden"> {/* Flex container for main content and sidebar */}
      <div className="home-container flex-1 overflow-y-auto p-4"> {/* Scrollable main content */}
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home feed</h2>

          {isPostLoading ? (
            <Loader />
          ) : (
            <ul className="flex flex-col gap-9 w-full">
              {posts?.documents.map((post: Models.Document) => (
                <PostCard post={post} key={post.caption} />
              ))}
            </ul>
          )}
        </div>
      </div>

      <TopCreators /> {/* Sidebar component, will be hidden on non-xl screens */}
    </div>
  );
};

export default Home;
