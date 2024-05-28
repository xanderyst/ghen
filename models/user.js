import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, 'Email already exists!'],
    required: [true, 'Email is required!'],
  },
  username: {
    type: String,
    required: [true, 'Username is required!'],
  },
  image: {
    type: String,
  },
  progress: {
    charactersToReview: [
      {
        unicode: {
          type: String
        },
        character: {
          type: String
        }
      }
    ],
    charactersLearned: [
      {
        unicode: {
          type: String
        },
        character: {
          type: String
        }
      }
    ],
    characterStartIndex: {
      type: Number,
      default: 0
    },
    grade: {
      type: Number,
      default: 1
    }
  },
  today: {
    guessHistory: [
      {
        unicode: {
          type: String
        },
        character: {
          type: String
        },
        attempt: {
          type: Number
        }
      }
    ],
    charactersArray: [
      {
        unicode: {
          type: String
        },
        character: {
          type: String
        }
      }
    ],
    characterIndex: {
      type: Number,
      default: 0
    }
  },
  lastLoggedIn: {
    type: Date,
    default: Date.now
  }
});

const User = models.User || model("User", UserSchema);

export default User;