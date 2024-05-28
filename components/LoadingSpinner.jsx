import { Spinner, Typography } from '@material-tailwind/react';

const LoadingSpinner = () => (
  <div className="flex flex-row text-center">
    <Spinner className="h-12 w-12 mr-4 mt-2" />
    <Typography variant="h1">Loading...</Typography>
  </div>
);

export default LoadingSpinner;
