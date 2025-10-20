import { useState, useEffect } from 'react'
import './App.css'
import { api } from './api'
import AuthPage from './components/AuthPage'
import CharacterCreation from './components/CharacterCreation'
import GamePage from './components/GamePage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasCharacter, setHasCharacter] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        await api.getCurrentUser()
        setIsAuthenticated(true)
        
        const gameState = await api.getGameState()
        if (gameState.player_character) {
          setHasCharacter(true)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        api.clearToken()
      }
    }
    setLoading(false)
  }

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleCharacterCreated = () => {
    setHasCharacter(true)
  }

  const handleLogout = () => {
    api.clearToken()
    setIsAuthenticated(false)
    setHasCharacter(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-purple-400 text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />
  }

  if (!hasCharacter) {
    return <CharacterCreation onCharacterCreated={handleCharacterCreated} />
  }

  return <GamePage onLogout={handleLogout} />
}

export default App
