import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';


// Fetch All Products
export const fetchAdminProducts=createAsyncThunk('admin/fetchAdminProducts',async (_,{rejectWithValue})=>{
    try{
        
        const {data}=await axios.get('/api/v1/admin/products')
        return data;

    }catch (error) {
        return rejectWithValue(error.response?.data || "Error While Fetching the products")
    }

})

//Create Products 
export const createProduct=createAsyncThunk('admin/createProduct',
    async (productData,{rejectWithValue})=>{ 
        try{ 
            const config={ headers:{ 'Content-Type':'multipart/form-data' } } 
            const {data}=await axios.post('/api/v1/admin/product/create',productData,config) 
            return data; 
        }catch (error) { return rejectWithValue(error.response?.data || "Product Creation Failed")

        } 
    }
)


export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `/api/v1/admin/product/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true   // 🔥 THIS IS REQUIRED
        }
      );

      return data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Product Update Failed"
      );
    }
  }
);

// Delete Product
export const deleteProduct=createAsyncThunk('admin/deleteProduct',async (productId,{rejectWithValue})=>{
    try{
        const {data}=await axios.delete(`/api/v1/admin/product/${productId}`)
        return {productId};
        
    }catch (error) {
        return rejectWithValue(error.response?.data || "Product Deletion Failed")
    }

})

// Fetch All users
export const fetchUsers=createAsyncThunk('admin/fetchUsers',async (_,{rejectWithValue})=>{
    try{
        const {data}=await axios.get('/api/v1/admin/users')
        return data;

    }catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch users")
    }

})

// Get single user 
export const getSingleUser=createAsyncThunk('admin/getSingleUser',async (id,{rejectWithValue})=>{
    try{
        const {data}=await axios.get(`/api/v1/admin/user/${id}`)
        return data;

    }catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch single user")
    }

})


// Update user Role
export const updateUserRole=createAsyncThunk('admin/updateUserRole',async ({userId,role},{rejectWithValue})=>{
    try{
        const {data}=await axios.put(`/api/v1/admin/user/${userId}`,{role})
        return data;

    }catch (error) {
        return rejectWithValue(error.response?.data || "Failed to update user role")
    }

})

// Delete user profile
export const deleteUser=createAsyncThunk('admin/deleteUser',async (userId,{rejectWithValue})=>{
    try{
        const {data}=await axios.delete(`/api/v1/admin/user/${userId}`)
        return data;

    }catch (error) {
        return rejectWithValue(error.response?.data || "Failed to delete user")
    }

})

// Fetch All orders
export const fetchAllOrders=createAsyncThunk('admin/fetchAllOrders',async (_,{rejectWithValue})=>{
    try{
        const {data}=await axios.get(`/api/v1/admin/orders`)
        return data;

    }catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch orders")
    }

})

// Delete Order
export const deleteOrder=createAsyncThunk('admin/deleteOrder',async (id,{rejectWithValue})=>{
    try{
        const {data}=await axios.delete(`/api/v1/admin/order/${id}`)
        return data;

    }catch (error) {
        return rejectWithValue(error.response?.data || "Failed to delete order")
    }

})

// Update Order Status
export const updateOrderStatus=createAsyncThunk('admin/updateOrderStatus',async ({orderId,status},{rejectWithValue})=>{
    try{
        const config={ 
            headers:{ 
                'Content-Type':'application/json'
            } 
        }
        const {data}=await axios.put(`/api/v1/admin/order/${orderId}`,{status}, config)
        return data;

    }catch (error) {
        return rejectWithValue(error.response?.data || "Failed to update order status")
    }

})

// Fetch All Reviews
export const fetchProductReviews=createAsyncThunk('admin/fetchProductReviews',async (productId,{rejectWithValue})=>{
    try{
    
        const {data}=await axios.get(`/api/v1/admin/reviews?id=${productId}`)
        return data;

    }catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch product reviews")
    }

})

// Fetch All Reviews
export const deleteReview=createAsyncThunk('admin/deleteReview',async ({productId,reviewId},{rejectWithValue})=>{
    try{
    
        const {data}=await axios.delete(`/api/v1/admin/reviews?productId=${productId}&id=${reviewId}`)
        return data;

    }catch (error) {
        return rejectWithValue(error.response?.data || "Failed to delete product review")
    }

})
const adminSlice=createSlice({
    name:'admin',
    initialState:{
        products:[],
        success:false,
        loading:false,
        error:null,
        product:{},
        deleting:{},
        users:[],
        user:{},
        message:null,
        orders:[],
        totalAmount:0,
        order:{},
        reviews:[],
        deleteReviewSuccess:false
    },
    reducers:{
        removeErrors:(state)=>{
            state.error=null
        },
        removeSuccess:(state)=>{
            state.success=false
        },
        clearMessage:(state)=>{
            state.message=null
        },
        resetDeleteReviewSuccess:(state)=>{
            state.deleteReviewSuccess=false
        }

    },
    extraReducers:(builder)=>{
        // Registration cases
            builder
            .addCase(fetchAdminProducts.pending,(state)=>{
                state.loading=true;
                state.error=null
            })
            .addCase(fetchAdminProducts.fulfilled,(state,action)=>{
                state.loading=false,
                state.products=action.payload.products
            })
            .addCase(fetchAdminProducts.rejected,(state,action)=>{
                state.loading=false,
                state.error=action.payload?.message || 'Error While Fetching the products'
    
            })


            builder
            .addCase(createProduct.pending,(state)=>{
                state.loading=true;
                state.error=null
            })
            .addCase(createProduct.fulfilled,(state,action)=>{
                state.loading=false,
                state.success=action.payload.success,
                state.products.push(action.payload.product)
                console.log(state.products);
                
            })
            .addCase(createProduct.rejected,(state,action)=>{
                state.loading=false,
                state.error=action.payload?.message || 'Product Creation Failed'
    
            })


            builder
            .addCase(updateProduct.pending,(state)=>{
                state.loading=true;
                state.error=null
            })
            .addCase(updateProduct.fulfilled,(state,action)=>{
                state.loading=false,
                state.success=action.payload.success,
                state.product=action.payload.product
                
            })
            .addCase(updateProduct.rejected,(state,action)=>{
                state.loading=false,
                state.error=action.payload?.message || 'Product Update Failed'
    
            })


            builder
            .addCase(deleteProduct.pending,(state,action)=>{
                const productId=action.meta.arg;
                state.deleting[productId]=true;
            })
            .addCase(deleteProduct.fulfilled,(state,action)=>{
                const productId=action.payload.productId;   
                state.deleting[productId]=false;
                state.products=state.products.filter(product=>product._id!==productId)
                
            })
            .addCase(deleteProduct.rejected,(state,action)=>{
                const productId=action.meta.arg;
                state.deleting[productId]=false;
                state.error=action.payload?.message || 'Product Deletion Failed'
    
            })

            
            builder
            .addCase(fetchUsers.pending,(state)=>{
                state.loading=true;
                state.error=null
            })
            .addCase(fetchUsers.fulfilled,(state,action)=>{
                state.loading=false,
                state.users=action.payload.users
                
            })
            .addCase(fetchUsers.rejected,(state,action)=>{
                state.loading=false,
                state.error=action.payload?.message || 'Failed to fetch users'
    
            })

            builder
            .addCase(getSingleUser.pending,(state)=>{
                state.loading=true;
                state.error=null
            })
            .addCase(getSingleUser.fulfilled,(state,action)=>{
                state.loading=false,
                state.user=action.payload.user
                
            })
            .addCase(getSingleUser.rejected,(state,action)=>{
                state.loading=false,
                state.error=action.payload?.message || 'Failed to fetch single user'
    
            })


            builder
            .addCase(updateUserRole.pending,(state)=>{
                state.loading=true;
                state.error=null
            })
            .addCase(updateUserRole.fulfilled,(state,action)=>{
                state.loading=false,
                state.success=action.payload.success
                
            })
            .addCase(updateUserRole.rejected,(state,action)=>{
                state.loading=false,
                state.error=action.payload?.message || 'Failed to update user role'
    
            })


            builder
            .addCase(deleteUser.pending,(state)=>{
                state.loading=true;
                state.error=null
            })
            .addCase(deleteUser.fulfilled,(state,action)=>{
                state.loading=false,
                state.message=action.payload.message
                
            })
            .addCase(deleteUser.rejected,(state,action)=>{
                state.loading=false,
                state.error=action.payload?.message || 'Failed to delete user'
    
            })

            builder
            .addCase(fetchAllOrders.pending,(state)=>{
                state.loading=true;
                state.error=null
            })
            .addCase(fetchAllOrders.fulfilled,(state,action)=>{
                state.loading=false,
                state.orders=action.payload.orders,
                state.totalAmount=action.payload.totalAmount
                
            })
            .addCase(fetchAllOrders.rejected,(state,action)=>{
                state.loading=false,
                state.error=action.payload?.message || 'Failed to fetch orders'
    
            })

            builder
            .addCase(deleteOrder.pending,(state)=>{
                state.loading=true;
                state.error=null
            })
            .addCase(deleteOrder.fulfilled,(state,action)=>{
                state.loading=false,
                state.success=action.payload.success,
                state.message=action.payload.message
                
            })
            .addCase(deleteOrder.rejected,(state,action)=>{
                state.loading=false,
                state.error=action.payload?.message || 'Failed to delete order'
    
            })

            builder
            .addCase(updateOrderStatus.pending,(state)=>{
                state.loading=true;
                state.error=null
            })
            .addCase(updateOrderStatus.fulfilled,(state,action)=>{
                state.loading=false,
                state.success=action.payload.success,
                state.order=action.payload.order
                
            })
            .addCase(updateOrderStatus.rejected,(state,action)=>{
                state.loading=false,
                state.error=action.payload?.message || 'Failed to update order status'
    
            })

            builder
            .addCase(fetchProductReviews.pending,(state)=>{
                state.loading=true;
                state.error=null
            })
            .addCase(fetchProductReviews.fulfilled,(state,action)=>{
                state.loading=false,
                state.reviews=action.payload.reviews
                
            })
            .addCase(fetchProductReviews.rejected,(state,action)=>{
                state.loading=false,
                state.error=action.payload?.message || 'Failed to fetch product reviews'
    
            })

            builder
            .addCase(deleteReview.pending,(state)=>{
                state.loading=true;
                state.error=null
            })
            .addCase(deleteReview.fulfilled,(state,action)=>{
                state.loading=false,
                state.deleteReviewSuccess=true
                state.message=action.payload.message
                
            })
            .addCase(deleteReview.rejected,(state,action)=>{
                state.loading=false,
                state.error=action.payload?.message || 'Failed to delete product review'
    
            })
    }
})
export const {removeErrors,removeSuccess,clearMessage,resetDeleteReviewSuccess}=adminSlice.actions
export default adminSlice.reducer