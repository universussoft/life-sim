from typing import Dict, Optional, List
from datetime import datetime
import uuid
from app.models import User, GameState, Character, Place, GameObject, Action

class InMemoryDatabase:
    def __init__(self):
        self.users: Dict[str, User] = {}
        self.game_states: Dict[str, GameState] = {}
        self.characters: Dict[str, Character] = {}
        self.places: Dict[str, Place] = {}
        self.objects: Dict[str, GameObject] = {}
        
    def create_user(self, email: str, username: str, hashed_password: str) -> User:
        user_id = str(uuid.uuid4())
        user = User(
            id=user_id,
            email=email,
            username=username,
            hashed_password=hashed_password,
            created_at=datetime.now()
        )
        self.users[user_id] = user
        
        game_state = GameState(
            user_id=user_id,
            player_character=None,
            current_place=None,
            inventory=[],
            discovered_characters=[],
            discovered_places=[],
            action_history=[],
            last_updated=datetime.now()
        )
        self.game_states[user_id] = game_state
        
        return user
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        for user in self.users.values():
            if user.email == email:
                return user
        return None
    
    def get_user_by_id(self, user_id: str) -> Optional[User]:
        return self.users.get(user_id)
    
    def get_game_state(self, user_id: str) -> Optional[GameState]:
        return self.game_states.get(user_id)
    
    def update_game_state(self, user_id: str, game_state: GameState):
        game_state.last_updated = datetime.now()
        self.game_states[user_id] = game_state
    
    def create_character(self, character: Character) -> Character:
        self.characters[character.id] = character
        return character
    
    def get_character(self, character_id: str) -> Optional[Character]:
        return self.characters.get(character_id)
    
    def create_place(self, place: Place) -> Place:
        self.places[place.id] = place
        return place
    
    def get_place(self, place_id: str) -> Optional[Place]:
        return self.places.get(place_id)
    
    def create_object(self, obj: GameObject) -> GameObject:
        self.objects[obj.id] = obj
        return obj
    
    def get_object(self, object_id: str) -> Optional[GameObject]:
        return self.objects.get(object_id)
    
    def add_action_to_history(self, user_id: str, action: Action):
        game_state = self.game_states.get(user_id)
        if game_state:
            game_state.action_history.append(action)
            game_state.last_updated = datetime.now()

db = InMemoryDatabase()
