const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
}

export interface CharacterAttributes {
  strength: number;
  intelligence: number;
  charisma: number;
  agility: number;
  luck: number;
}

export interface CharacterCharacteristics {
  hair_color: string;
  eye_color: string;
  skin_tone: string;
  height: string;
  build: string;
}

export interface Character {
  id: string;
  name: string;
  attributes: CharacterAttributes;
  characteristics: CharacterCharacteristics;
  image_url?: string;
  created_at: string;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  created_at: string;
}

export interface GameObject {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  created_at: string;
}

export interface Action {
  id: string;
  description: string;
  timestamp: string;
}

export interface GameState {
  user_id: string;
  player_character?: Character;
  current_place?: Place;
  inventory: GameObject[];
  discovered_characters: Character[];
  discovered_places: Place[];
  action_history: Action[];
  last_updated: string;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || 'An error occurred');
    }

    return response.json();
  }

  async register(email: string, username: string, password: string) {
    const data = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    });
    this.setToken(data.access_token);
    return data;
  }

  async login(email: string, password: string) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.access_token);
    return data;
  }

  async getCurrentUser(): Promise<User> {
    return this.request('/api/user/me');
  }

  async createCharacter(
    name: string,
    attributes: CharacterAttributes,
    characteristics: CharacterCharacteristics
  ): Promise<Character> {
    return this.request('/api/character/create', {
      method: 'POST',
      body: JSON.stringify({ name, attributes, characteristics }),
    });
  }

  async previewCharacter(
    name: string,
    attributes: CharacterAttributes,
    characteristics: CharacterCharacteristics
  ): Promise<Character> {
    return this.request('/api/character/preview', {
      method: 'POST',
      body: JSON.stringify({ name, attributes, characteristics }),
    });
  }

  async getGameState(): Promise<GameState> {
    return this.request('/api/game/state');
  }

  async generateCharacter(): Promise<Character> {
    return this.request('/api/game/generate-character', {
      method: 'POST',
    });
  }

  async generatePlace(): Promise<Place> {
    return this.request('/api/game/generate-place', {
      method: 'POST',
    });
  }

  async generateObject(): Promise<GameObject> {
    return this.request('/api/game/generate-object', {
      method: 'POST',
    });
  }

  async generateAction(context: string = ''): Promise<{ action: string; timestamp: string }> {
    return this.request('/api/game/generate-action', {
      method: 'POST',
      body: JSON.stringify({ context }),
    });
  }

  async travelToPlace(placeId: string): Promise<{ message: string; place: Place }> {
    return this.request(`/api/game/travel-to-place/${placeId}`, {
      method: 'POST',
    });
  }
}

export const api = new ApiService();
