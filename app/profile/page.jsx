"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [myPosts, setMyPosts] = useState([]);
  const [progress, setProgress] = useState({characterStartIndex: 0, charactersLearned: [], charactersToReview: [], grade: 1});

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();

      setMyPosts(data);
    };

    const fetchUser = async (userId) => {
      try {
          const response = await fetch(`/api/users/${userId}`);
          const data = await response.json();
          const tempProgress = data.progress;
          setProgress(tempProgress);
      } catch (error){
        console.log(error);
      }
    }

    if (session?.user.id) {
      fetchPosts();
      fetchUser(session?.user.id);
    }
  }, [session?.user.id]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    console.log('handleDelete post', post);
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });

        const filteredPosts = myPosts.filter((item) => item._id !== post._id);

        setMyPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    // <Profile
    //   name='My'
    //   desc='Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination'
    //   data={myPosts}
    //   handleEdit={handleEdit}
    //   handleDelete={handleDelete}
    // />
    <Profile
      name='My'
      desc='Welcome to your personalized profile page.'
      progress={progress}
    />
  );
};

export default MyProfile;