import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IUser } from "@/types";

type UserContentProps = {
  users: Models.Document[];
  currentUser: IUser;
};

const UserContent = ({ users, currentUser }: UserContentProps) => {
  
  if(users.length === 0) {
    return <p className="text-primary-500 mt-10 small-medium lg:base-medium">No user found</p>
  }

  return (
    <ul className="user-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {users?.map((user) => (
        <li className="mt-10" key={user.$id}>
          <div className="flex gap-4 justify-center items-center flex-col border-[3px] border-dark-4 p-6 rounded-[30px] hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <Link to={`/profile/${user.$id}`}>
              <img
                src={user.imageUrl || "/assets/images/profile-placeholder.svg"}
                alt="profile"
                className="h-14 w-14 rounded-full"
              />
            </Link>

            <div className="text-center flex gap-1 flex-col flex-1">
              <div className="h3-bold">{user.name}</div>
              <p className="text-sm text-light-3">@{user.username}</p>
            </div>

            <Button
              className="bg-[#877EFF] py-[10px] px-[20px] hover:bg-[#6f66e8]"
              disabled={user.$id === currentUser.id}
            >
              {currentUser.id === user.$id ? "You" : "Follow"}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default UserContent;
