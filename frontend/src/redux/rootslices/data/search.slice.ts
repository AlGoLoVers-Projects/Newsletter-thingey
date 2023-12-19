import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SearchState = {
    searchValue: string;
};

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        searchValue: ''
    },
    reducers: {
        setSearchValue: (state, action: PayloadAction<string>) => {
            state.searchValue = action.payload;
        },
    },
});

export const { setSearchValue } = searchSlice.actions;
export const selectSearchValue = (state: { search: SearchState }) => state.search.searchValue;
export default searchSlice.reducer;
