import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import type { JSX } from "react"

const AdminRoute = ({ children }: { children: JSX.Element } ) => {
  const { user, loading } = useAuth()

  if(loading) {
    return <div>Loading...</div>
  }

  if(!user || user.role !== "admin"){
    return <Navigate to="/shop" replace />
  }

  return (
    children
  )
}

export default AdminRoute