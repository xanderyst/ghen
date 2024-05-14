// import PromptCard from "./PromptCard";

// const Profile = ({ name, desc, data, handleEdit, handleDelete }) => {
//   return (
//     <section className='w-full'>
//       <h1 className='head_text text-left'>
//         <span className='blue_gradient'>{name} Profile</span>
//       </h1>
//       <p className='desc text-left'>{desc}</p>

//       <div className='mt-10 prompt_layout'>
//         {data.map((post) => (
//           <PromptCard
//             key={post._id}
//             post={post}
//             handleEdit={() => handleEdit && handleEdit(post)}
//             handleDelete={() => handleDelete && handleDelete(post)}
//           />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Profile;

// components/ProfilePage.js
import React from 'react';
import { Typography } from '@material-tailwind/react';

const Profile = ({ progress }) => {
  const { charactersLearned = [], charactersToReview = [], grade = 1 } = progress;

  const formatCharacters = (characters) => {
    return characters.map((char) => char.character).join(' ');
  };

  return (
    <div className="p-4">
      <Typography variant="h2" className="mb-4">Profile</Typography>
      <div className="mb-8">
      <Typography variant="h4" className="mb-2">
          Grade {grade}
        </Typography>
        <Typography variant="h4" className="mb-2">
          Characters Learned ({charactersLearned.length})
        </Typography>
        <Typography variant="body1">{formatCharacters(charactersLearned)}</Typography>
      </div>
      <div>
        <Typography variant="h4" className="mb-2">
          Characters to Review ({charactersToReview.length})
        </Typography>
        <Typography variant="body1">{formatCharacters(charactersToReview)}</Typography>
      </div>
    </div>
  );
};

export default Profile;
