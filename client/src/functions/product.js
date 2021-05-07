import axios from 'axios';

export const createProduct = async (product, authtoken) => await axios.post(`http://localhost:8000/api/product`, product,  {headers: { authtoken }})
export const updateProduct = async (slug, product, authtoken) => await axios.put(`http://localhost:8000/api/product/${slug}`, product,  {headers: { authtoken }})
export const productStar = async (productId, star, authtoken) => await axios.put(`http://localhost:8000/api/product/star/${productId}`, {star},  {headers: { authtoken }})
export const getProducts = async (count) => await axios.get(`http://localhost:8000/api/products/${count}`)
export const getProductsFilter = async (sort, order, page) => await axios.post(`http://localhost:8000/api/products`, {sort, order, page})
export const getProductsTotal = async () => await axios.get(`http://localhost:8000/api/products/total`)
export const removeProduct = async (slug, authtoken) => await axios.delete(`http://localhost:8000/api/products/${slug}`, {headers: { authtoken }})
export const getProduct = async (slug) => await axios.get(`http://localhost:8000/api/product/${slug}`)
export const getRelated = async (productId) => await axios.get(`http://localhost:8000/api/product/related/${productId}`)
export const fetchProductsByFilter = async (arg) => await axios.post(`http://localhost:8000/api/product/filters`, arg)