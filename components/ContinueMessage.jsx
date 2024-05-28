import { Typography, Button } from '@material-tailwind/react';

const ContinueMessage = ({ handleNext }) => (
  <div>
    <br />
    <div className="text-center">
      <Typography variant="h1">You got 10 correct!</Typography>
      <Typography variant="h3">You get to play more until you make a mistake</Typography>
      <br />
      <Button size="md" onClick={handleNext}>
        Continue
      </Button>
    </div>
  </div>
);

export default ContinueMessage;
