// For Add Item to Cart
export const addCart = (product) =>{
    return {
        type:"ADDITEM",
        payload:product
    }
}

// For Delete Item to Cart
export const delCart = (product) =>{
    return {
        type:"DELITEM",
        payload:product
    }
}

// For Decrease Quantity by 1
export const decQty = (product) => {
  return {
    type: "DECITEM",
    payload: product,
  };
};
