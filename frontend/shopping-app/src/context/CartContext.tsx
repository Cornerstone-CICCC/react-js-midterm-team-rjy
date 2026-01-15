const addToCart = (product) => {
  fetch(`http://localhost:300/api/cart/${userId}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: product._id, quantity: 1 }),
  })
}