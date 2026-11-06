import express from 'express';
import {
  getBagItems,
  getBagItemsDetails,
  addItemToBag,
  removeItemFromBag,
  clearBag,
  updateItemQuantityInBag
} from '../controllers/Bag.controller.js';
import verifyUser from '../middleware/verifyUser.middleware.js'

const bagRouter = express.Router();

// Enforce authentication on all cart operations

bagRouter.get("/test", (req, res) => {
  res.status(200).json({ message: "bag test route is working!" });
});

// bagRouter.get('/bag-items-count-for-unverified-users', (req, res) => {
//   res.status(200).json({ message: "bag items count for unverified users route is working!" });
// });

// bagRouter.get('/bag-items-for-unverified-users', (req, res) => {
//   res.status(200).json({ message: "bag items for unverified users route is working!" });
// });

// bagRouter.get('/add-item-to-bag-by-unverified-users', (req, res) => {
//   res.status(200).json({ message: "Add item to bag by unverified users route is working!" });
// });

// bagRouter.get('/remove-item-from-bag-by-unverified-users', (req, res) => {
//   res.status(200).json({ message: "Remove item from bag by unverified users route is working!" });
// });

// bagRouter.get('/update-item-quantity-by-unverified-users', (req, res) => {
//   res.status(200).json({ message: "Update item quantity by unverified users route is working!" });
// });


bagRouter.get('/items-total-price-after-discount', (req, res) => {
  res.status(200).json({ message: "Bag items total price after discount route is working!" });
  });


  // bagRouter.get('/items-count-for-unverified-users', (req, res) => {
    //   res.status(200).json({ message: "bag items count for unverified users route is working!" });
    // });
    
    
bagRouter.use(verifyUser);
    
bagRouter.get('/items', (req, res) => {
  res.status(200).json({ message: "bag items for unverified users route is working!" });
});
bagRouter.get('/items-details', (req, res) => {
  res.status(200).json({ message: "bag items for unverified users route is working!" });
});

bagRouter.get('/add-item', (req, res) => {
  res.status(200).json({ message: "Add item to bag by verified users route is working!" });
});

bagRouter.get('/remove-item', (req, res) => {
  res.status(200).json({ message: "Remove item from bag by verified users route is working!" });
});

bagRouter.get('/update-item-quantity', (req, res) => {
  res.status(200).json({ message: "Update item quantity by verified users route is working!" });
}); 

bagRouter.get('/clear', (req, res) => {
  res.status(200).json({ message: "Clear bag by verified users route is working!" });
});


export default bagRouter;