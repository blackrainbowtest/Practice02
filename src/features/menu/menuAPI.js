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