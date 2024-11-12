import Loader from "@/components/shared/Loader";
import UserContent from "@/components/shared/UserContent";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/AuthContext";
import { useGetUsers } from "@/lib/react-query/queryAndMutations";
import { Models } from "appwrite";
import { useState } from "react";

const AllUsers = () => {
  const [searchValue, setSearchValue] = useState("");
  const { data: users, isLoading: isUsersLoading } = useGetUsers();
  const { user: currentUser } = useUserContext();

  let searchedUsers: Models.Document[] = [];

  if (searchValue && users?.documents) {
    searchedUsers = users.documents.filter((user) =>
      user.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  return (
    <div className="explore-container p-4">
      <div className="flex gap-3 mb-4">
        <img
          src="/assets/icons/people.svg"
          height={40}
          width={40}
          alt="People Icon"
          className="cursor-pointer"
        />
        <h2 className="h3-bold md:h2-bold">All Users</h2>
      </div>

      <div className="w-full max-w-lg mx-auto mb-4">
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />

          <Input
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
          />
        </div>
      </div>

      {isUsersLoading ? (
        <Loader />
      ) : searchValue ? (
        <UserContent users={searchedUsers || []} currentUser={currentUser} />
      ) : (
        <UserContent users={users?.documents || []} currentUser={currentUser} />
      )}
    </div>
  );
};

export default AllUsers;
