import { createSlice } from '@reduxjs/toolkit'


const initialState={
    products:[]
}

const productSlice = createSlice({
    name:'products',
    initialState,
    reducers:{
        setProducts:(state,action)=>{
            state.products = action.payload
            console.log(initialState.products)
        },
        ordered:(state,action)=>{
            const petId = action.payload;
            const updated = state.products.map((data)=>{
                if( petId.includes(data._id) && data.qty > 0 ){
                    return { ...data, qty:data.qty-1 }
                }
                return data
            })
            state.products = updated
        }
    }
})

export const { setProducts, ordered } = productSlice.actions
export default productSlice.reducer;