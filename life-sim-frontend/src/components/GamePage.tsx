import { useState, useEffect } from 'react'
import { api, GameState } from '../api'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ScrollArea } from './ui/scroll-area'
import { User, MapPin, Package, Users, Sparkles, LogOut } from 'lucide-react'

interface GamePageProps {
  onLogout: () => void
}

export default function GamePage({ onLogout }: GamePageProps) {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [currentAction, setCurrentAction] = useState<string>('')

  useEffect(() => {
    loadGameState()
  }, [])

  const loadGameState = async () => {
    try {
      const state = await api.getGameState()
      setGameState(state)
    } catch (error) {
      console.error('Failed to load game state:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateCharacter = async () => {
    setActionLoading(true)
    try {
      const character = await api.generateCharacter()
      setCurrentAction(`You encountered ${character.name}!`)
      await loadGameState()
    } catch (error) {
      console.error('Failed to generate character:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleGeneratePlace = async () => {
    setActionLoading(true)
    try {
      const place = await api.generatePlace()
      setCurrentAction(`You discovered ${place.name}!`)
      await loadGameState()
    } catch (error) {
      console.error('Failed to generate place:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleGenerateObject = async () => {
    setActionLoading(true)
    try {
      const obj = await api.generateObject()
      setCurrentAction(`You found ${obj.name}!`)
      await loadGameState()
    } catch (error) {
      console.error('Failed to generate object:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleGenerateAction = async () => {
    setActionLoading(true)
    try {
      const result = await api.generateAction(gameState?.current_place?.name || '')
      setCurrentAction(result.action)
      await loadGameState()
    } catch (error) {
      console.error('Failed to generate action:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleTravelToPlace = async (placeId: string) => {
    setActionLoading(true)
    try {
      const result = await api.travelToPlace(placeId)
      setCurrentAction(result.message)
      await loadGameState()
    } catch (error) {
      console.error('Failed to travel:', error)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-purple-400 text-xl">Loading game...</div>
      </div>
    )
  }

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Failed to load game state</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-purple-300">Life Sim Game</h1>
          <Button
            onClick={onLogout}
            variant="outline"
            className="bg-gray-800 border-purple-700 text-purple-300 hover:bg-gray-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gray-800 border-purple-700">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Your Character
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gameState.player_character ? (
                  <div className="flex gap-4">
                    {gameState.player_character.image_url && (
                      <div className="w-32 h-32 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={gameState.player_character.image_url}
                          alt={gameState.player_character.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-purple-300 mb-2">
                        {gameState.player_character.name}
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-400">STR:</div>
                        <div className="text-purple-400">{gameState.player_character.attributes.strength}</div>
                        <div className="text-gray-400">INT:</div>
                        <div className="text-purple-400">{gameState.player_character.attributes.intelligence}</div>
                        <div className="text-gray-400">CHA:</div>
                        <div className="text-purple-400">{gameState.player_character.attributes.charisma}</div>
                        <div className="text-gray-400">AGI:</div>
                        <div className="text-purple-400">{gameState.player_character.attributes.agility}</div>
                        <div className="text-gray-400">LCK:</div>
                        <div className="text-purple-400">{gameState.player_character.attributes.luck}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400">No character created</div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-purple-700">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Current Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gameState.current_place ? (
                  <div className="space-y-4">
                    {gameState.current_place.image_url && (
                      <div className="w-full h-48 bg-gray-700 rounded-lg overflow-hidden">
                        <img
                          src={gameState.current_place.image_url}
                          alt={gameState.current_place.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-purple-300 mb-2">
                        {gameState.current_place.name}
                      </h3>
                      <p className="text-gray-400">{gameState.current_place.description}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400">No current location</div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-purple-700">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Actions
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Generate random events and discoveries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentAction && (
                  <div className="p-4 bg-purple-900 bg-opacity-30 rounded-lg border border-purple-700">
                    <p className="text-purple-300">{currentAction}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={handleGenerateCharacter}
                    disabled={actionLoading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Meet Character
                  </Button>
                  <Button
                    onClick={handleGeneratePlace}
                    disabled={actionLoading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Discover Place
                  </Button>
                  <Button
                    onClick={handleGenerateObject}
                    disabled={actionLoading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Find Object
                  </Button>
                  <Button
                    onClick={handleGenerateAction}
                    disabled={actionLoading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Random Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gray-800 border-purple-700">
              <CardHeader>
                <CardTitle className="text-purple-300">Game Info</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="inventory" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                    <TabsTrigger value="inventory" className="data-[state=active]:bg-purple-600">
                      Inventory
                    </TabsTrigger>
                    <TabsTrigger value="characters" className="data-[state=active]:bg-purple-600">
                      Characters
                    </TabsTrigger>
                    <TabsTrigger value="places" className="data-[state=active]:bg-purple-600">
                      Places
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="inventory" className="mt-4">
                    <ScrollArea className="h-96">
                      {gameState.inventory.length > 0 ? (
                        <div className="space-y-4">
                          {gameState.inventory.map((item) => (
                            <Card key={item.id} className="bg-gray-700 border-gray-600">
                              <CardContent className="p-4">
                                <div className="flex gap-3">
                                  {item.image_url && (
                                    <div className="w-16 h-16 bg-gray-600 rounded overflow-hidden flex-shrink-0">
                                      <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <h4 className="font-semibold text-purple-300">{item.name}</h4>
                                    <p className="text-sm text-gray-400">{item.description}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-400 text-center py-8">No items yet</div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="characters" className="mt-4">
                    <ScrollArea className="h-96">
                      {gameState.discovered_characters.length > 0 ? (
                        <div className="space-y-4">
                          {gameState.discovered_characters.map((character) => (
                            <Card key={character.id} className="bg-gray-700 border-gray-600">
                              <CardContent className="p-4">
                                <div className="flex gap-3">
                                  {character.image_url && (
                                    <div className="w-16 h-16 bg-gray-600 rounded overflow-hidden flex-shrink-0">
                                      <img
                                        src={character.image_url}
                                        alt={character.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <h4 className="font-semibold text-purple-300">{character.name}</h4>
                                    <div className="text-xs text-gray-400 mt-1">
                                      STR: {character.attributes.strength} | INT: {character.attributes.intelligence} | CHA: {character.attributes.charisma}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-400 text-center py-8">No characters met yet</div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="places" className="mt-4">
                    <ScrollArea className="h-96">
                      {gameState.discovered_places.length > 0 ? (
                        <div className="space-y-4">
                          {gameState.discovered_places.map((place) => (
                            <Card key={place.id} className="bg-gray-700 border-gray-600">
                              <CardContent className="p-4">
                                <div className="space-y-2">
                                  {place.image_url && (
                                    <div className="w-full h-24 bg-gray-600 rounded overflow-hidden">
                                      <img
                                        src={place.image_url}
                                        alt={place.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <h4 className="font-semibold text-purple-300">{place.name}</h4>
                                    <p className="text-sm text-gray-400">{place.description}</p>
                                    {gameState.current_place?.id !== place.id && (
                                      <Button
                                        onClick={() => handleTravelToPlace(place.id)}
                                        size="sm"
                                        className="mt-2 bg-purple-600 hover:bg-purple-700"
                                      >
                                        Travel Here
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-400 text-center py-8">No places discovered yet</div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
