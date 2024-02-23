import { createAsyncThunk } from "@reduxjs/toolkit"

// import axios connection
import axios from "axios"

const url = "http://localhost:4000/menu"

export const getMenu = createAsyncThunk(
    'menu/getMenu',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
);

export const addMenu = createAsyncThunk(
    'menu/addMenu',
    async ({ name, order = 1, parent = null }, { rejectWithValue }) => {
        try {
            const response = await axios.post(url, { order, name, parent });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

export const deleteMenu = createAsyncThunk(
    'menu/deleteMenu',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${url}/${id}`)
            return id
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

export const patchMenu = createAsyncThunk(
    'menu/patchMenu',
    async (item, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${url}/${item.id}`, item)
            return response.data;
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const dragMenu = createAsyncThunk(
    'menu/dragMenu',
    async (items, { rejectWithValue }) => {
        try {
            const responses = await Promise.all(
                items.map(async (item, index) => {
                    await delay(index * 100);
                    const response = await axios.patch(`${url}/${item.id}`, item);
                    return response.data;
                })
            );
            return responses;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// if (error.response) {
//     // Ошибка от сервера с ответом (например, 4xx, 5xx)
//     return rejectWithValue(error.response.data);
//   } else if (error.request) {
//     // Ошибка, связанная с отсутствием ответа от сервера
//     return rejectWithValue('Сервер не отвечает');
//   } else {
//     // Ошибка в процессе отправки запроса
//     return rejectWithValue('Не удалось выполнить запрос');
//   }