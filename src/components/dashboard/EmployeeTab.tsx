import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Button from '@mui/material/Button'
import EmployeeInfoForm from './EmployeeInfoForm'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import userApi from '../../services/apis/user-api'
import type { UserDTO } from '../../services/dto/user.dto'
import GroupsIcon from '@mui/icons-material/Groups'
// import MessageIcon from '@mui/icons-material/Message'

export default function EmployeeTab() {
  const { data: employeesData } = useQuery({
    queryKey: ['users'],
    queryFn: userApi.getEmployees,
  })

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: userApi.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const mutationUpdateEmployee = useMutation({
    mutationFn: (params: { id: string; data: Omit<UserDTO, 'id'> }) =>
      userApi.updateEmployee(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const mutationDeleteEmployee = useMutation({
    mutationFn: (id: string) => userApi.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const [selectedEmployee, setSelectedEmployee] = useState<UserDTO | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleDelete = (id: string | null) => {
    if (id) {
      mutationDeleteEmployee.mutate(id)
    }
  }

  const handleEdit = (employee: UserDTO) => {
    setSelectedEmployee(employee)
    setIsFormOpen(true)
  }

  const handleAddNew = () => {
    setSelectedEmployee(null)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (data: Omit<UserDTO, 'id'>) => {
    if (selectedEmployee && selectedEmployee.id) {
      mutationUpdateEmployee.mutateAsync({ id: selectedEmployee.id, data: data })
    } else {
      const reformatData: Omit<UserDTO, 'id' | 'username' | 'password'> = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: 'EMPLOYEE',
      }
      mutation.mutateAsync(reformatData)
    }
    setIsFormOpen(false)
    setSelectedEmployee(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Employee List</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Total employees: {employeesData?.length ?? 0}
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleAddNew}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <PersonAddIcon className="w-4 h-4" />
            Add Employee
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <EmployeeInfoForm
            employee={selectedEmployee}
            onSubmit={handleFormSubmit}
            onClose={() => {
              setIsFormOpen(false)
              setSelectedEmployee(null)
            }}
          />
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        <AnimatePresence>
          {employeesData && employeesData.length > 0 ? (
            employeesData.map((employee, index) => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{employee.name}</h3>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Username</p>
                        <p className="text-foreground font-medium">{employee.username}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Email</p>
                        <p className="text-foreground font-medium">{employee.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Phone number</p>
                        <p className="text-foreground font-medium">{employee.phoneNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-6">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => handleEdit(employee)}
                        variant="outlined"
                        className="gap-2"
                      >
                        <EditIcon className="w-4 h-4" />
                        Edit
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => handleDelete(employee.id)}
                        variant="outlined"
                        className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <DeleteIcon className="w-4 h-4" />
                        Delete
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-card border border-border rounded-lg"
            >
              <GroupsIcon className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No employees yet</p>
              <Button onClick={handleAddNew} className="mt-4 gap-2">
                <PersonAddIcon className="w-4 h-4" />
                Add First Employee
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
