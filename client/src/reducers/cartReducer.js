let initailState = [];

if (typeof window !== 'undefined') {
    if (localStorage.getItem('cart')) {
        initailState = JSON.parse(localStorage.getItem('cart'))
    } else {
        initailState = []
    }
}


export default function cartReducer(state=initailState, action) {
    switch(action.type) {
        case 'ADD_TO_CART':
            return action.payload
        default:
            return state;
    }
}