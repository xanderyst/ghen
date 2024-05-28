import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from '@material-tailwind/react';

const SignInDialog = ({ open, handleOpen }) => (
  <Dialog size="xs" open={open} handler={handleOpen}>
    <DialogBody>
      <Typography variant="h5">
        Sign in to save progress!
      </Typography>
    </DialogBody>
    <DialogFooter>
      <Button variant="gradient" color="green" onClick={handleOpen}>
        <span>Ok</span>
      </Button>
    </DialogFooter>
  </Dialog>
);

export default SignInDialog;
