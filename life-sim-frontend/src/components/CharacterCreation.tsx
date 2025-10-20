import { useState } from 'react'
import { api, CharacterAttributes, CharacterCharacteristics, Character } from '../api'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Slider } from './ui/slider'

interface CharacterCreationProps {
  onCharacterCreated: () => void
}

export default function CharacterCreation({ onCharacterCreated }: CharacterCreationProps) {
  const [name, setName] = useState('')
  const [attributes, setAttributes] = useState<CharacterAttributes>({
    strength: 5,
    intelligence: 5,
    charisma: 5,
    agility: 5,
    luck: 5,
  })
  const [characteristics, setCharacteristics] = useState<CharacterCharacteristics>({
    hair_color: 'brown',
    eye_color: 'brown',
    skin_tone: 'medium',
    height: 'average',
    build: 'athletic',
  })
  const [preview, setPreview] = useState<Character | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAttributeChange = (key: keyof CharacterAttributes, value: number[]) => {
    setAttributes({ ...attributes, [key]: value[0] })
  }

  const handlePreview = async () => {
    if (!name) return
    setLoading(true)
    try {
      const character = await api.previewCharacter(name, attributes, characteristics)
      setPreview(character)
    } catch (error) {
      console.error('Preview failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!name) return
    setLoading(true)
    try {
      await api.createCharacter(name, attributes, characteristics)
      onCharacterCreated()
    } catch (error) {
      console.error('Character creation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 p-4 overflow-y-auto">
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-4xl font-bold text-center text-purple-300 mb-8">
          Create Your Character
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-purple-700">
            <CardHeader>
              <CardTitle className="text-purple-300">Character Details</CardTitle>
              <CardDescription className="text-gray-400">
                Customize your character's appearance and abilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-gray-300">Character Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter character name"
                  className="bg-gray-700 border-gray-600 text-white mt-2"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-300">Attributes</h3>
                
                {Object.entries(attributes).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <Label className="text-gray-300 capitalize">{key}</Label>
                      <span className="text-purple-400">{value}</span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={(val) => handleAttributeChange(key as keyof CharacterAttributes, val)}
                      min={1}
                      max={10}
                      step={1}
                      className="bg-gray-700"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-300">Appearance</h3>
                
                <div>
                  <Label className="text-gray-300">Hair Color</Label>
                  <Select value={characteristics.hair_color} onValueChange={(val) => setCharacteristics({...characteristics, hair_color: val})}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {['black', 'brown', 'blonde', 'red', 'white', 'gray', 'blue', 'purple'].map(color => (
                        <SelectItem key={color} value={color} className="text-white">{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300">Eye Color</Label>
                  <Select value={characteristics.eye_color} onValueChange={(val) => setCharacteristics({...characteristics, eye_color: val})}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {['brown', 'blue', 'green', 'hazel', 'gray', 'amber'].map(color => (
                        <SelectItem key={color} value={color} className="text-white">{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300">Skin Tone</Label>
                  <Select value={characteristics.skin_tone} onValueChange={(val) => setCharacteristics({...characteristics, skin_tone: val})}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {['pale', 'fair', 'light', 'medium', 'tan', 'olive', 'brown', 'dark'].map(tone => (
                        <SelectItem key={tone} value={tone} className="text-white">{tone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300">Height</Label>
                  <Select value={characteristics.height} onValueChange={(val) => setCharacteristics({...characteristics, height: val})}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {['short', 'average', 'tall', 'very tall'].map(h => (
                        <SelectItem key={h} value={h} className="text-white">{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300">Build</Label>
                  <Select value={characteristics.build} onValueChange={(val) => setCharacteristics({...characteristics, build: val})}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {['slim', 'athletic', 'muscular', 'stocky', 'heavy'].map(b => (
                        <SelectItem key={b} value={b} className="text-white">{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handlePreview}
                  disabled={!name || loading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Preview Character
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!name || loading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Create Character
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-purple-700">
            <CardHeader>
              <CardTitle className="text-purple-300">Character Preview</CardTitle>
              <CardDescription className="text-gray-400">
                See how your character will look
              </CardDescription>
            </CardHeader>
            <CardContent>
              {preview ? (
                <div className="space-y-4">
                  {preview.image_url && (
                    <div className="w-full aspect-square bg-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={preview.image_url}
                        alt={preview.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-purple-300">{preview.name}</h3>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-400">Strength:</div>
                      <div className="text-purple-400">{preview.attributes.strength}</div>
                      <div className="text-gray-400">Intelligence:</div>
                      <div className="text-purple-400">{preview.attributes.intelligence}</div>
                      <div className="text-gray-400">Charisma:</div>
                      <div className="text-purple-400">{preview.attributes.charisma}</div>
                      <div className="text-gray-400">Agility:</div>
                      <div className="text-purple-400">{preview.attributes.agility}</div>
                      <div className="text-gray-400">Luck:</div>
                      <div className="text-purple-400">{preview.attributes.luck}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 text-gray-500">
                  Click "Preview Character" to see your character
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
