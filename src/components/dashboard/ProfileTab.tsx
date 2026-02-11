import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import userApi from '../../services/apis/user-api'
import { useEffect, useState } from 'react'
import type { UserDTO } from '../../services/dto/user.dto'

const TextFieldTheme = createTheme({
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: '#ff0000',
        },
      },
    },
  },
})

export default function ProfileTab() {
  const userId = localStorage.getItem('id') || ''
  const [profile, setProfile] = useState<UserDTO>({
    id: userId,
    name: '',
    email: '',
    phoneNumber: '',
    username: '',
    password: '',
  })
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const { data: user } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () =>
      userApi.getEmployeeById(userId).then((res) => {
        setProfile(res)
        return res
      }),
  })

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (updatedUser: UserDTO) => userApi.updateEmployee(userId, updatedUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] })
    },
  })

  const inputValidation = () => {
    if (!profile.name?.trim() || !profile.email?.trim() || !profile.phoneNumber?.trim()) {
      setIsButtonDisabled(true)
    } else {
      setIsButtonDisabled(false)
    }
  }

  useEffect(() => {
    inputValidation()
  }, [profile])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setProfile((prev) => ({ ...prev, [id]: value }))
    inputValidation()
  }

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <Stack direction={'column'} spacing={2}>
        <ThemeProvider theme={TextFieldTheme}>
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            required
            value={profile?.name || ''}
            onChange={handleFormChange}
          />
        </ThemeProvider>
        <ThemeProvider theme={TextFieldTheme}>
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            required
            value={profile?.email || ''}
            onChange={handleFormChange}
          />
        </ThemeProvider>
        <ThemeProvider theme={TextFieldTheme}>
          <TextField
            id="phone"
            label="Phone Number"
            variant="outlined"
            required
            value={profile?.phoneNumber || ''}
            onChange={handleFormChange}
          />
        </ThemeProvider>
        <TextField
          id="username"
          label="Username"
          variant="outlined"
          value={profile?.username || ''}
          onChange={handleFormChange}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          onChange={handleFormChange}
        />
        <Button
          disabled={isButtonDisabled}
          variant="contained"
          color="primary"
          onClick={async () => await mutation.mutateAsync(profile)}
        >
          Save Changes
        </Button>
      </Stack>
    </div>
  )
}
