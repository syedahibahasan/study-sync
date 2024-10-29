// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { useAuth } from "../../hooks/useauth.js";
// import "../Searchresult/searchresult.css";
// import { search as searchFood } from "../../services/foodservices";
// import { toast } from "react-toastify";
// import {
//   getUser,
//   addToCart,
//   removeFromCart,
// } from "../../services/userService.js";

// const SearchResults = () => {
//   const [results, setResults] = useState([]);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [items, setItems] = useState([]);
//   const [cart, setCart] = useState([]);
//   const { addCartItem, removeCartItem } = useAuth();
//   const { search } = useLocation();
//   const query = new URLSearchParams(search).get("query");

//   useEffect(() => {
//     const fetchResults = async () => {
//       try {
//         const data = await searchFood(query);
//         setResults(data.map((item) => ({ ...item, count: 0 })));
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     if (query) {
//       fetchResults();
//     }
//   }, [query]);

//   const handleIncrement = async (item, event) => {
//     event.stopPropagation();

//     await addToCart(item.id, quantity, item.price);
//     setCart(getUser()?.cart || []);
//     toast.success("Item Added to Cart");
//   };

//   const handleDecrement = async (item, event) => {
//     event.stopPropagation();
//     console.log("Item to remove:", item._id);
//     try {
//       const updatedCart = await removeFromCart(item._id, 1); // Assuming quantity to remove is always 1
//       setCart(updatedCart || getUser()?.cart || []);
//       toast.info("Item removed from Cart");
//     } catch (error) {
//       toast.error("No Items to Remove");
//       console.error("Error removing item from cart:", error);
//       // Optionally, handle the error (e.g., show a notification to the user)
//     }
//   };

//   const handleSelectItem = (item) => {
//     setSelectedItem(item);
//   };

//   const handleClose = () => {
//     setSelectedItem(null);
//   };

//   return (
//     <div className="results">
//       <div className="searchheader">
//         <h2 className="searchfor">Search Results for: {query}</h2>
//         <div className="category-items">
//           {results.length > 0 ? (
//             results.map((result) => (
//               <div
//                 key={result.id}
//                 className={`item-box ${
//                   selectedItem === result ? "selected" : ""
//                 }`}
//                 onClick={() => handleSelectItem(result)}
//               >
//                 <div
//                   className="item-image"
//                   style={{ backgroundImage: `url('/food/${result.image}')` }}
//                 />
//                 <p className="item-name">{result.name}</p>
//                 <div className="item-count">
//                   <button
//                     className="remove-from-cart-button"
//                     onClick={(e) => handleDecrement(result, e)}
//                   >
//                     -
//                   </button>
//                   <span className="item-count-text">1 lb</span>
//                   <button
//                     className="add-to-cart-button"
//                     onClick={(e) => handleIncrement(result, e)}
//                   >
//                     +
//                   </button>
//                 </div>
//                 <p className="item-price">${result.price}</p>
//               </div>
//             ))
//           ) : (
//             <p>No results found for "{query}".</p>
//           )}
//         </div>
//       </div>
//       {selectedItem && (
//         <div className="modal-overlay" onClick={handleClose}>
//           <div
//             className="item-detail-modal"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <ItemDetail
//               name={selectedItem.name}
//               price={selectedItem.price}
//               image={selectedItem.image}
//               foodId={selectedItem._id}
//               onClose={handleClose}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchResults;
