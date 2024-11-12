import PostForm from "@/components/forms/PostForm";
import Loader from "@/components/shared/Loader";
import { toast } from "@/components/ui/use-toast";
import {
  useGetCurrentUser,
  useGetPostById,
} from "@/lib/react-query/queryAndMutations";
import { useEffect } from "react";

import { Navigate, useNavigate, useParams } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();
  const { data: user, isLoading: isUserLoading } = useGetCurrentUser();
  const { data: post, isPending } = useGetPostById(id || "");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserLoading) {
      if (post?.creator.$id !== user?.$id) {
        toast({
          title: "Permission denied",
        });

        // return <Navigate to={"/explore"} />;
        navigate("/explore");
      }
    }
  }, [user, id]);

  if (isPending) return <Loader />;

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 max-w-5xl justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            height={36}
            width={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit post</h2>
        </div>

        <PostForm action="Update" post={post} />
      </div>
    </div>
  );
};

export default EditPost;
