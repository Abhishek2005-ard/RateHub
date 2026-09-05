import { getUserStoresWithUserRating, upsertRating } from '../models/storeModel.js';

export async function getUserStores(req, res) {
  try {
    const userId = req.user.id;
    const { search, page, limit } = req.query;

    const result = await getUserStoresWithUserRating(userId, { search, page, limit });
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error in getUserStores:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch stores list.'
    });
  }
}

export async function submitRating(req, res) {
  try {
    const userId = req.user.id;
    const { storeId, rating, comment } = req.body;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: 'Store ID is required.'
      });
    }

    const numericRating = parseInt(rating, 10);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5 stars.'
      });
    }

    const { rating: savedRating, store: updatedStore } = await upsertRating({
      storeId,
      userId,
      rating: numericRating,
      comment: comment || ''
    });

    return res.status(200).json({
      success: true,
      message: `Rating for '${updatedStore?.name || 'store'}' saved successfully.`,
      userRating: savedRating,
      store: updatedStore
    });
  } catch (error) {
    console.error('Error in submitRating:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit rating.'
    });
  }
}
