import { useContext, useEffect, useState, createContext } from "react";

type User = {
  id: string;
  role: "user" | "admin";
}

const AuthContext = createContext<{
  user: User | null
  loading: boolean
}>({ user: null, loading: true })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:3000/users/me", {
      credentials: "include",
    })
    .then(res => res.ok ? res.json(): null)
    .then(data => {
      if(data?.user) {
        setUser({
          id: data.user._id,
          role: data.user.role,
        })
      }
    })
    .finally(() => setLoading(false))
  }, [])
  
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)