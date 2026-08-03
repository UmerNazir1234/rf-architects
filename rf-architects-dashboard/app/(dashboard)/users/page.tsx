"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { userService } from "@/services/user.service"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Plus } from "lucide-react"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "viewer" })
  const { toast } = useToast()

  useEffect(() => {
    const loadUsers = async () => {
      const response = await userService.getUsers()
      if (response.success && response.data) {
        setUsers(response.data.users)
      }
    }

    loadUsers()
  }, [])

  const refreshUsers = async () => {
    const response = await userService.getUsers()
    if (response.success && response.data) {
      setUsers(response.data.users)
    }
  }

  const handleRoleChange = async (id: string, role: string) => {
    setLoadingId(id)
    const response = await userService.updateUserRole(id, role)
    setLoadingId(null)
    if (response.success && response.data) {
      toast({ title: "Role updated" })
      setUsers((prev) => prev.map((user) => (user.id === id ? response.data : user)))
    } else {
      toast({ title: response.message || "Unable to update role", variant: "destructive" })
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    setLoadingId(id)
    const response = await userService.toggleUserActive(id, isActive)
    setLoadingId(null)
    if (response.success && response.data) {
      toast({ title: `User ${isActive ? "activated" : "deactivated"}` })
      setUsers((prev) => prev.map((user) => (user.id === id ? response.data : user)))
    } else {
      toast({ title: response.message || "Unable to update user", variant: "destructive" })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setLoadingId(deleteId)
    const response = await userService.deleteUser(deleteId)
    setLoadingId(null)
    if (response.success) {
      toast({ title: "User deleted" })
      setDeleteId(null)
      await refreshUsers()
    } else {
      toast({ title: response.message || "Unable to delete user", variant: "destructive" })
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingId("create")
    const response = await userService.createUser(newUser)
    setLoadingId(null)
    if (response.success && response.data) {
      toast({ title: "User created" })
      setIsCreateOpen(false)
      setNewUser({ name: "", email: "", password: "", role: "viewer" })
      await refreshUsers()
    } else {
      toast({ title: response.message || "Unable to create user", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage dashboard users and access levels</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger className={buttonVariants()}>
            <Plus className="mr-2 h-4 w-4" />
            Create User
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreateUser}>
              <DialogHeader>
                <DialogTitle>Create User</DialogTitle>
                <DialogDescription>
                  Add a new user and set their role.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" required value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Initial Password</Label>
                  <Input id="password" type="text" required value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(val) => setNewUser({ ...newUser, role: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={loadingId === "create"}>
                  {loadingId === "create" ? "Creating..." : "Create User"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {users?.map?.((user) => (
          <Card key={user._id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
                <Badge variant="outline">{user.role}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{user.isActive ? "Active account" : "Inactive account"}</p>
              <div className="grid gap-2">
                <select
                  className="rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  value={user.role}
                  onChange={(event) => handleRoleChange(user._id, event.target.value)}
                  disabled={loadingId === user._id}
                >
                  <option value="superadmin">superadmin</option>
                  <option value="editor">editor</option>
                  <option value="viewer">viewer</option>
                </select>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(user._id, !user.isActive)}
                    disabled={loadingId === user._id}
                  >
                    {user.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteId(user._id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete User?</AlertDialogTitle>
          <AlertDialogDescription>
            Deleting a user will remove them from the mock user list.
          </AlertDialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
