import { createAsyncThunk } from '@reduxjs/toolkit';
import { api, fetchWithRefresh } from '../../utils/api';
import { BURGER_API_URL, DATA_ADRESS } from '../../utils/const';
import { IData, ILoginUser, IRefreshToken, IRegisterUser, IUser } from '../../utils/interfaces';
import { checkResponse } from '../../utils/utils';

export const fetchIngredients = createAsyncThunk('ingredients/fetchIngredients', async () => {
  try {
    return await fetch(DATA_ADRESS).then(checkResponse);
  } catch (error) {
    return new Error();
  }
});

export const placeOrder = createAsyncThunk<IData[], string[], { rejectValue: Error }>(
  'order/placeOrder',
  async (ingredients, { rejectWithValue }) => {
    try {
      const response = await api.setOrder(ingredients);
      return checkResponse(response);
    } catch (error) {
      return rejectWithValue(new Error('Failed to place order'));
    }
  }
);

export const registerUser = createAsyncThunk<IUser, IRegisterUser>(
  'auth/register',
  async (userData) => {
    const res = await api.register(userData);
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res;
  }
);

export const loginUser = createAsyncThunk<IUser, ILoginUser>('auth/login', async (userData) => {
  const res = await api.login(userData);
  localStorage.setItem('accessToken', res.accessToken);
  localStorage.setItem('refreshToken', res.refreshToken);
  return res;
});

export const logoutUser = createAsyncThunk<void, IRefreshToken>(
  'auth/logout',
  async (tokenData) => {
    await api.logout(tokenData);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
);

export const getUser = createAsyncThunk('auth/user', async () => {
  const res = await api.getUser();
  return res.user;
});

export const checkUserAuth = createAsyncThunk('auth/checkUserAuth', async (unknown, thunkAPI) => {
  if (localStorage.getItem('accessToken')) {
    try {
      await thunkAPI.dispatch(getUser());
    } catch (e) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      thunkAPI.rejectWithValue('');
    }
  }
});
