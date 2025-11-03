import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import usersMock from "../../mocks/users.json";

const LOGGED_USER_KEY = "loggedUser";
const USERS_KEY = "users";

interface UserType {
  fullName: string;
  email: string;
  password: string;
  userName: string;
}

interface AuthState {
  user: UserType | null;
  users: UserType[];
  error: string | null;
}

// cargar usuarios (lo que hacías en el useEffect del contexto)
function loadInitialUsers(): UserType[] {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) {
      return JSON.parse(stored) as UserType[];
    }
  } catch {
    //
  }
  // si no había nada, guardamos el mock como hacías en el efecto
  localStorage.setItem(USERS_KEY, JSON.stringify(usersMock));
  return usersMock as UserType[];
}

// cargar usuario logueado
function loadInitialLoggedUser(): UserType | null {
  try {
    const stored = localStorage.getItem(LOGGED_USER_KEY);
    if (stored) {
      return JSON.parse(stored) as UserType;
    }
  } catch {
    //
  }
  return null;
}

const initialState: AuthState = {
  user: loadInitialLoggedUser(),
  users: loadInitialUsers(),
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // login(userName, password)
    login: (
      state,
      action: PayloadAction<{ userName: string; password: string }>
    ) => {
      const { userName, password } = action.payload;

      const foundUser = state.users.find(
        (u) => u.userName === userName && u.password === password
      );

      if (foundUser) {
        state.user = foundUser;
        state.error = null;
        localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(foundUser));
        // la navegación (navigate("/")) la hará el componente que despacha este action
      } else {
        state.error = "Credenciales inválidas";
      }
    },

    // logout()
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem(LOGGED_USER_KEY);
    },

    // register(newUser)
    register: (state, action: PayloadAction<UserType>) => {
      const newUser = action.payload;

      const userExists = state.users.some(
        (existingUser) =>
          existingUser.userName === newUser.userName ||
          existingUser.email === newUser.email
      );

      if (userExists) {
        // en tu contexto hacías window.alert
        window.alert("User Already Exists");
        state.error = "User Already Exists";
        return;
      }

      // agregar usuario
      state.users.push(newUser);
      // persistir lista de usuarios
      localStorage.setItem(USERS_KEY, JSON.stringify(state.users));
      // loguear al nuevo usuario igual que hacías en el contexto
      state.user = newUser;
      localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(newUser));
      state.error = null;
    },

    // opcional: para limpiar errores
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const { login, logout, register, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
