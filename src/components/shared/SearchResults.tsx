import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostList";

type SearchResultPosts = {
  isSearchFetching: boolean;
  searchedPosts: Models.Document[];
};

const SearchResults = ({
  isSearchFetching,
  searchedPosts,
}: SearchResultPosts) => {
  if (isSearchFetching) {
    return <Loader />;
  }

  if (searchedPosts && searchedPosts.documents.length > 0) {
    // console.log("first");
    return <GridPostList posts={searchedPosts.documents} />;
  }

  return (
    <p className="text-light-4 text-center mt-10">No search result found</p>
  );
};

export default SearchResults;
