# Life Sim Game

A life simulation game built with Node.js, FastAPI, and React featuring AI-generated content.

## Features

- **User Authentication**: Secure registration and login system with JWT tokens
- **Character Creation**: Create custom characters with adjustable attributes (Strength, Intelligence, Charisma, Agility, Luck) and physical characteristics (hair color, eye color, skin tone, height, build)
- **AI-Generated Images**: Placeholder images generated for characters, places, and objects using Python image generation
- **Random Content Generation**: 
  - Random characters with unique names and attributes
  - Random places with descriptions
  - Random objects for inventory
  - AI-generated action text for dynamic gameplay
- **Game Progress Tracking**: In-memory database stores user progress including:
  - Player character
  - Current location
  - Inventory items
  - Discovered characters
  - Discovered places
  - Action history
- **Dark Theme UI**: Sleek, modern dark interface built with React and Tailwind CSS

## Technology Stack

### Backend
- **FastAPI**: Python web framework for the REST API
- **Python**: Image generation service using Pillow
- **bcrypt**: Password hashing
- **JWT**: Token-based authentication
- **In-memory database**: For proof-of-concept (data resets on server restart)

### Frontend
- **React**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built UI components
- **Lucide React**: Icon library

## Project Structure

```
life-sim-game/
├── life-sim-backend/          # FastAPI backend
│   ├── app/
│   │   ├── main.py           # Main API endpoints
│   │   ├── models.py         # Pydantic models
│   │   ├── database.py       # In-memory database
│   │   ├── auth.py           # Authentication logic
│   │   ├── ai_service.py     # Random content generation
│   │   └── image_service.py  # Image generation
│   └── pyproject.toml        # Python dependencies
└── life-sim-frontend/         # React frontend
    ├── src/
    │   ├── components/       # React components
    │   │   ├── AuthPage.tsx
    │   │   ├── CharacterCreation.tsx
    │   │   └── GamePage.tsx
    │   ├── api.ts           # API client
    │   └── App.tsx          # Main app component
    └── package.json         # Node dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/user/me` - Get current user info

### Character Management
- `POST /api/character/create` - Create player character
- `POST /api/character/preview` - Preview character before creation

### Game Actions
- `GET /api/game/state` - Get current game state
- `POST /api/game/generate-character` - Generate random NPC
- `POST /api/game/generate-place` - Generate random location
- `POST /api/game/generate-object` - Generate random item
- `POST /api/game/generate-action` - Generate random event text
- `POST /api/game/travel-to-place/{place_id}` - Travel to discovered location

## Running Locally

### Backend
```bash
cd life-sim-backend
poetry run fastapi dev app/main.py
```
Backend will run on http://localhost:8000

### Frontend
```bash
cd life-sim-frontend
npm run dev
```
Frontend will run on http://localhost:5173

## Important Notes

- **In-Memory Database**: The current implementation uses an in-memory database for simplicity. All data will be lost when the backend server restarts. For production use, integrate a persistent database like PostgreSQL.

- **Placeholder Images**: The current implementation generates placeholder images using Python's Pillow library. For production, integrate with actual AI image generation services like Stable Diffusion API.

- **AI Text Generation**: The current implementation uses pre-defined random text templates. For production, integrate with text generation APIs like OpenAI GPT or similar services.

## Future Enhancements

- Integrate real Stable Diffusion API for image generation
- Integrate text AI model (GPT, Claude, etc.) for dynamic action generation
- Add persistent database (PostgreSQL, MongoDB)
- Add more game mechanics (quests, combat, relationships)
- Add multiplayer features
- Add save/load game functionality
- Add more character customization options
- Add sound effects and music
- Add achievements and progression system

## License

This is a proof-of-concept project created for demonstration purposes.
