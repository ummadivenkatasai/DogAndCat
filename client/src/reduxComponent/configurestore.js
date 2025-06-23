import { configureStore } from "@reduxjs/toolkit";
import { dogSlice, catSlice } from "./slice";

const store = configureStore({
    reducer:{
        dog:dogSlice.reducer,
        cat:catSlice.reducer
    }
})

store.subscribe(()=> console.log(store.getState()) )

export default store;