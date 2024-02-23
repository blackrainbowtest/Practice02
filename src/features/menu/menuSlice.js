import { createSlice } from "@reduxjs/toolkit"

// importing action functions from API
import { addMenu, deleteMenu, dragMenu, getMenu, patchMenu } from "./menuAPI"

const initialState = {
    data: [],
    errorMessage: "",
    loading: false,
    currentItem: null,
    draggedItem: null,
    isChildShow: false,
    modifiedData: []
}

export const menuSlice = createSlice({
    name: 'menu',
    initialState: initialState,
    reducers: {
        setError: (state, action) => {
            state.errorMessage = action.payload
        },
        changeCurrentItem: (state, action) => {
            state.currentItem = action.payload
        },
        changeDraggedItem: (state, action) => {
            state.draggedItem = action.payload
        },
        changeIsChildShow: (state, action) => {
            state.isChildShow = action.payload
        },
        updateData: (state, action) => {
            state.data = action.payload
        },
        updateModifiedData: (state, action) => {
            state.modifiedData = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMenu.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMenu.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getMenu.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload
            })
            .addCase(addMenu.pending, (state) => {
                state.loading = true;
            })
            .addCase(addMenu.fulfilled, (state, action) => {
                state.loading = false;
                state.data = [...state.data, action.payload];
            })
            .addCase(addMenu.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload
            })
            .addCase(patchMenu.pending, (state) => {
                state.loading = true;
            })
            .addCase(patchMenu.fulfilled, (state, action) => {
                state.loading = false;
                state.data = state.data.map(item => item.id === action.payload.id ? action.payload : item);
            })
            .addCase(patchMenu.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload
            })
            .addCase(deleteMenu.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteMenu.fulfilled, (state, action) => {
                state.loading = false
                state.data = state.data.filter((item) => {
                    return item.id !== action.payload
                })
            })
            .addCase(deleteMenu.rejected, (state, action) => {
                state.loading = false
                state.errorMessage = action.payload
            })
            .addCase(dragMenu.pending, (state) => {
                state.loading = true
            })
            .addCase(dragMenu.fulfilled, (state, action) => {
                state.loading = false
                state.data = state.data.map((item) => {
                    const updatedItem = action.payload.find((updated) => updated.id === item.id);
                    return updatedItem ? { ...item, ...updatedItem } : item;
                });
            })
            .addCase(dragMenu.rejected, (state, action) => {
                state.loading = false
                state.errorMessage = action.payload
            })
    }
})

// export slice to app/store
export default menuSlice.reducer

export const { setError, changeCurrentItem, changeDraggedItem, changeIsChildShow, updateData, updateModifiedData } = menuSlice.actions