import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

interface ErrorSnackbarProps {
  isErrorOpen: boolean
  setIsErrorOpen: (open: boolean) => void
  errorMessage: string
}

export default function ErrorSnackbar({
  isErrorOpen,
  setIsErrorOpen,
  errorMessage,
}: ErrorSnackbarProps) {
  return (
    <Snackbar
      open={isErrorOpen}
      autoHideDuration={4000}
      onClose={() => setIsErrorOpen(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={() => setIsErrorOpen(false)} severity="error" variant="filled">
        {errorMessage}
      </Alert>
    </Snackbar>
  )
}
