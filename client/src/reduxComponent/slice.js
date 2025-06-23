import { createSlice } from '@reduxjs/toolkit'

const dogStock={
    stock:10
}

const catStock={
    stock:10
}

const dogSlice=createSlice({
    name:'dog',
    initialState:dogStock,
    reducers:{
        dogOrdered:(state)=>{
            state.stock--;
        },
        // restocked:()
    }
})

const catSlice=createSlice({
    name:'cat',
    initialState:catStock,
    reducers:{
        catOrdered:(state)=>{
            state.stock--;
        },
        // restocked:()
    }
})

export { dogSlice, catSlice };
export const { dogOrdered } = dogSlice.actions;
export const { catOrdered } = catSlice.actions;