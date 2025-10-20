from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from datetime import datetime

class User(BaseModel):
    id: str
    email: EmailStr
    username: str
    hashed_password: str
    created_at: datetime

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class CharacterAttributes(BaseModel):
    strength: int
    intelligence: int
    charisma: int
    agility: int
    luck: int

class CharacterCharacteristics(BaseModel):
    hair_color: str
    eye_color: str
    skin_tone: str
    height: str
    build: str

class Character(BaseModel):
    id: str
    name: str
    attributes: CharacterAttributes
    characteristics: CharacterCharacteristics
    image_url: Optional[str] = None
    created_at: datetime

class CharacterCreate(BaseModel):
    name: str
    attributes: CharacterAttributes
    characteristics: CharacterCharacteristics

class Place(BaseModel):
    id: str
    name: str
    description: str
    image_url: Optional[str] = None
    created_at: datetime

class GameObject(BaseModel):
    id: str
    name: str
    description: str
    image_url: Optional[str] = None
    created_at: datetime

class Action(BaseModel):
    id: str
    description: str
    timestamp: datetime

class GameState(BaseModel):
    user_id: str
    player_character: Optional[Character] = None
    current_place: Optional[Place] = None
    inventory: List[GameObject] = []
    discovered_characters: List[Character] = []
    discovered_places: List[Place] = []
    action_history: List[Action] = []
    last_updated: datetime

class GenerateImageRequest(BaseModel):
    prompt: str
    entity_type: str

class GenerateActionRequest(BaseModel):
    context: str
