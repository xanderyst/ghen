import { Typography, Button } from '@material-tailwind/react';

const LevelUpMessage = ({ grade, handleNext }) => (
  <div className="text-center">
    <Typography variant="h1">Congrats! You have graduated from grade {grade - 1}</Typography>
    <br />
    <Button size="md" onClick={handleNext}>
      Yay!
    </Button>
  </div>
);

export default LevelUpMessage;
