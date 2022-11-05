import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

export function useAuth(){
  const data = useContext(AuthContext)
  
  return data
}