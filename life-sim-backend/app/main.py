from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta, datetime
import uuid

from app.models import (
    UserCreate, UserLogin, Token, CharacterCreate, Character,
    Place, GameObject, Action, GameState, GenerateImageRequest,
    GenerateActionRequest, User
)
from app.database import db
from app.auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
)
from app.ai_service import ai_service
from app.image_service import image_service

app = FastAPI()

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.post("/api/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    existing_user = db.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(user_data.password)
    user = db.create_user(user_data.email, user_data.username, hashed_password)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    user = db.get_user_by_email(user_data.email)
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/user/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "created_at": current_user.created_at
    }

@app.post("/api/character/create", response_model=Character)
async def create_character(
    character_data: CharacterCreate,
    current_user: User = Depends(get_current_user)
):
    character_id = str(uuid.uuid4())
    character = Character(
        id=character_id,
        name=character_data.name,
        attributes=character_data.attributes,
        characteristics=character_data.characteristics,
        image_url=None,
        created_at=datetime.now()
    )
    
    prompt = ai_service.generate_character_prompt(character)
    image_url = image_service.generate_placeholder_image(prompt, "CHARACTER")
    character.image_url = image_url
    
    db.create_character(character)
    
    game_state = db.get_game_state(current_user.id)
    if game_state:
        game_state.player_character = character
        db.update_game_state(current_user.id, game_state)
    
    return character

@app.post("/api/character/preview", response_model=Character)
async def preview_character(character_data: CharacterCreate):
    character_id = str(uuid.uuid4())
    character = Character(
        id=character_id,
        name=character_data.name,
        attributes=character_data.attributes,
        characteristics=character_data.characteristics,
        image_url=None,
        created_at=datetime.now()
    )
    
    prompt = ai_service.generate_character_prompt(character)
    image_url = image_service.generate_placeholder_image(prompt, "CHARACTER")
    character.image_url = image_url
    
    return character

@app.get("/api/game/state", response_model=GameState)
async def get_game_state(current_user: User = Depends(get_current_user)):
    game_state = db.get_game_state(current_user.id)
    if not game_state:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game state not found"
        )
    return game_state

@app.post("/api/game/generate-character", response_model=Character)
async def generate_random_character(current_user: User = Depends(get_current_user)):
    character = ai_service.generate_random_character()
    
    prompt = ai_service.generate_character_prompt(character)
    image_url = image_service.generate_placeholder_image(prompt, "CHARACTER")
    character.image_url = image_url
    
    db.create_character(character)
    
    game_state = db.get_game_state(current_user.id)
    if game_state:
        game_state.discovered_characters.append(character)
        db.update_game_state(current_user.id, game_state)
    
    return character

@app.post("/api/game/generate-place", response_model=Place)
async def generate_random_place(current_user: User = Depends(get_current_user)):
    place = ai_service.generate_random_place()
    
    prompt = ai_service.generate_place_prompt(place)
    image_url = image_service.generate_placeholder_image(prompt, "PLACE")
    place.image_url = image_url
    
    db.create_place(place)
    
    game_state = db.get_game_state(current_user.id)
    if game_state:
        game_state.discovered_places.append(place)
        game_state.current_place = place
        db.update_game_state(current_user.id, game_state)
    
    return place

@app.post("/api/game/generate-object", response_model=GameObject)
async def generate_random_object(current_user: User = Depends(get_current_user)):
    obj = ai_service.generate_random_object()
    
    prompt = ai_service.generate_object_prompt(obj)
    image_url = image_service.generate_placeholder_image(prompt, "OBJECT")
    obj.image_url = image_url
    
    db.create_object(obj)
    
    game_state = db.get_game_state(current_user.id)
    if game_state:
        game_state.inventory.append(obj)
        db.update_game_state(current_user.id, game_state)
    
    return obj

@app.post("/api/game/generate-action")
async def generate_random_action(
    request: GenerateActionRequest,
    current_user: User = Depends(get_current_user)
):
    action_text = ai_service.generate_random_action(request.context)
    
    action = Action(
        id=str(uuid.uuid4()),
        description=action_text,
        timestamp=datetime.now()
    )
    
    db.add_action_to_history(current_user.id, action)
    
    return {"action": action_text, "timestamp": action.timestamp}

@app.post("/api/game/travel-to-place/{place_id}")
async def travel_to_place(
    place_id: str,
    current_user: User = Depends(get_current_user)
):
    place = db.get_place(place_id)
    if not place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Place not found"
        )
    
    game_state = db.get_game_state(current_user.id)
    if game_state:
        game_state.current_place = place
        db.update_game_state(current_user.id, game_state)
    
    return {"message": f"Traveled to {place.name}", "place": place}
