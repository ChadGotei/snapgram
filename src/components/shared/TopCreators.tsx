import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { useGetUsers } from "@/lib/react-query/queryAndMutations";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const TopCreators = () => {
  const { data: users, isLoading: isUsersLoading } = useGetUsers();
  const { user: currentUser } = useUserContext();

  const topUsers = users?.documents.slice(0, 5) || [];

  return (
    <div className="hidden xl:flex flex-col xl:w-1/4 p-4 overflow-y-auto max-h-screen"> 
      <h2 className="h3-bold md:h2-bold my-5">Top Creators</h2>

      {isUsersLoading ? (
        <Loader />
      ) : (
        <ul className="flex flex-col gap-4">
          {topUsers.map((user) => (
            <li key={user.$id} className="flex flex-col items-center border-2 border-dark-4 p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300">
              <Link to={`/profile/${user.$id}`}>
                <img
                  src={user.imageUrl || "/assets/images/profile-placeholder.svg"}
                  alt={user.name}
                  className="h-14 w-14 rounded-full mb-2"
                />
              </Link>

              <div className="text-center mb-2">
                <h3 className="font-bold">{user.name}</h3>
                <p className="text-sm text-light-3">@{user.username}</p>
              </div>

              <Button
                className="bg-[#877EFF] py-2 px-4 hover:bg-[#6f66e8]"
                disabled={user.$id === currentUser.id}
              >
                {currentUser.id === user.$id ? "You" : "Follow"}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopCreators;
