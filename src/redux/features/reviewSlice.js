import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // You'll need axios or your preferred HTTP library

// Async Thunks for API Calls
// ----------------------------

// Fetch Reviews for a Product
export const fetchReviews = createAsyncThunk(
    'reviews/fetchReviews',
    async (productId) => {
        try {
            if(productId === undefined) return [];
            const response = await axios.get(`/api/reviews/getReview/${productId}`); // Replace with your API endpoint
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Add a New Review
export const addReview = createAsyncThunk(
    'reviews/addReview',
    async (reviewData) => {
        try {
            const response = await axios.post('/api/reviews/addReview', reviewData); // Replace with your API endpoint
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Update an Existing Review (Optional)
export const updateReview = createAsyncThunk(
    'reviews/updateReview',
    async (reviewData) => {
        try {
            const response = await axios.put(`/api/reviews/${reviewData.id}`, reviewData); // Replace with your API endpoint
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

// Delete a Review (Optional)
export const deleteReview = createAsyncThunk(
    'reviews/deleteReview',
    async (reviewId) => {
        try {
            await axios.delete(`/api/reviews/${reviewId}`); // Replace with your API endpoint
            return reviewId; // Return the ID so we can update the state
        } catch (error) {
            throw error;
        }
    }
);


// Review Slice
// -------------

const reviewSlice = createSlice({
    name: 'reviews',
    initialState: {
        reviews: [], // Initialize reviews as an empty array
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        // You might have some simple synchronous actions here if needed
        clearReviews: (state) => {
            state.reviews =[]; // Clear reviews, e.g., when unmounting a product page
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Reviews
            .addCase(fetchReviews.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.reviews = action.payload;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Add Review
            .addCase(addReview.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addReview.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.reviews.push(action.payload); // Add the new review to the state
            })
            .addCase(addReview.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Update Review (Optional)
            .addCase(updateReview.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateReview.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Update the review in the state (you might need to find it by ID and replace it)
                state.reviews = state.reviews.map(review => 
                    review.id === action.payload.id ? action.payload : review
                );
            })
            .addCase(updateReview.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Delete Review (Optional)
            .addCase(deleteReview.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Remove the review from the state
                state.reviews = state.reviews.filter(review => review.id !== action.payload);
            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { clearReviews } = reviewSlice.actions;

export default reviewSlice.reducer;