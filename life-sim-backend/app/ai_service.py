import random
import uuid
from datetime import datetime
from typing import List
from app.models import Character, Place, GameObject, CharacterAttributes, CharacterCharacteristics

class AIService:
    def __init__(self):
        self.hair_colors = ["black", "brown", "blonde", "red", "white", "gray", "blue", "purple"]
        self.eye_colors = ["brown", "blue", "green", "hazel", "gray", "amber"]
        self.skin_tones = ["pale", "fair", "light", "medium", "tan", "olive", "brown", "dark"]
        self.heights = ["short", "average", "tall", "very tall"]
        self.builds = ["slim", "athletic", "muscular", "stocky", "heavy"]
        
        self.first_names = ["Alex", "Jordan", "Morgan", "Casey", "Riley", "Avery", "Quinn", "Sage", 
                           "Rowan", "Phoenix", "River", "Sky", "Ash", "Blake", "Cameron", "Dakota"]
        self.last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", 
                          "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez"]
        
        self.place_types = ["tavern", "forest", "castle", "village", "cave", "mountain", "beach", 
                           "temple", "ruins", "marketplace", "library", "dungeon"]
        self.place_adjectives = ["ancient", "mysterious", "abandoned", "bustling", "peaceful", 
                                "dangerous", "enchanted", "hidden", "sacred", "forgotten"]
        
        self.object_types = ["sword", "shield", "potion", "scroll", "ring", "amulet", "book", 
                            "key", "gem", "artifact", "map", "compass"]
        self.object_adjectives = ["magical", "ancient", "rusty", "golden", "silver", "enchanted", 
                                 "cursed", "blessed", "mysterious", "powerful"]
        
        self.actions = [
            "You encounter a mysterious stranger who offers you a quest",
            "A sudden storm forces you to seek shelter",
            "You discover a hidden path leading to an unknown location",
            "A local merchant offers you a rare item for trade",
            "You hear rumors of a legendary treasure nearby",
            "A group of travelers invites you to join their journey",
            "You find an old map with cryptic markings",
            "A wild animal crosses your path",
            "You stumble upon an ancient inscription",
            "The ground trembles beneath your feet",
            "You hear distant music coming from the woods",
            "A shooting star lights up the night sky",
            "You find footprints leading into the darkness",
            "A mysterious fog rolls in, obscuring your vision",
            "You discover a campsite that was recently abandoned"
        ]
    
    def generate_random_character(self) -> Character:
        character_id = str(uuid.uuid4())
        name = f"{random.choice(self.first_names)} {random.choice(self.last_names)}"
        
        attributes = CharacterAttributes(
            strength=random.randint(1, 10),
            intelligence=random.randint(1, 10),
            charisma=random.randint(1, 10),
            agility=random.randint(1, 10),
            luck=random.randint(1, 10)
        )
        
        characteristics = CharacterCharacteristics(
            hair_color=random.choice(self.hair_colors),
            eye_color=random.choice(self.eye_colors),
            skin_tone=random.choice(self.skin_tones),
            height=random.choice(self.heights),
            build=random.choice(self.builds)
        )
        
        return Character(
            id=character_id,
            name=name,
            attributes=attributes,
            characteristics=characteristics,
            image_url=None,
            created_at=datetime.now()
        )
    
    def generate_random_place(self) -> Place:
        place_id = str(uuid.uuid4())
        place_type = random.choice(self.place_types)
        adjective = random.choice(self.place_adjectives)
        name = f"The {adjective.capitalize()} {place_type.capitalize()}"
        
        descriptions = [
            f"A {adjective} {place_type} that has stood for centuries.",
            f"This {place_type} is known throughout the land as {adjective}.",
            f"Few dare to venture into this {adjective} {place_type}.",
            f"Legends speak of the {adjective} {place_type} and its secrets.",
            f"The {place_type} appears {adjective} in the fading light."
        ]
        
        return Place(
            id=place_id,
            name=name,
            description=random.choice(descriptions),
            image_url=None,
            created_at=datetime.now()
        )
    
    def generate_random_object(self) -> GameObject:
        object_id = str(uuid.uuid4())
        object_type = random.choice(self.object_types)
        adjective = random.choice(self.object_adjectives)
        name = f"{adjective.capitalize()} {object_type.capitalize()}"
        
        descriptions = [
            f"A {adjective} {object_type} that radiates an unusual energy.",
            f"This {object_type} appears to be {adjective} and valuable.",
            f"The {adjective} {object_type} seems to have a story to tell.",
            f"You sense something special about this {adjective} {object_type}.",
            f"A {object_type} of {adjective} origin and unknown purpose."
        ]
        
        return GameObject(
            id=object_id,
            name=name,
            description=random.choice(descriptions),
            image_url=None,
            created_at=datetime.now()
        )
    
    def generate_random_action(self, context: str = "") -> str:
        base_action = random.choice(self.actions)
        if context:
            return f"{base_action}. {context}"
        return base_action
    
    def generate_character_prompt(self, character: Character) -> str:
        return (f"Portrait of a person named {character.name}, "
                f"{character.characteristics.height} height, "
                f"{character.characteristics.build} build, "
                f"{character.characteristics.hair_color} hair, "
                f"{character.characteristics.eye_color} eyes, "
                f"{character.characteristics.skin_tone} skin tone, "
                f"fantasy RPG character art, detailed, high quality")
    
    def generate_place_prompt(self, place: Place) -> str:
        return f"{place.name}, {place.description}, fantasy landscape art, detailed, atmospheric, high quality"
    
    def generate_object_prompt(self, obj: GameObject) -> str:
        return f"{obj.name}, {obj.description}, fantasy item art, detailed, high quality, isolated on dark background"

ai_service = AIService()
