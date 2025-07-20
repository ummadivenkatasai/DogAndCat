import { configureStore } from "@reduxjs/toolkit";
import productReducer from './slice'

const store = configureStore({
    reducer: {
        products:productReducer
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})

export default store;