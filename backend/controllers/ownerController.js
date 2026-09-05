import bcrypt from 'bcryptjs';
import { getStoreDetailsByOwnerEmail } from '../models/storeModel.js';
import { findUserByEmail, updateUserPassword } from '../models/userModel.js';

export async function getOwnerStoreData(req, res) {
  try {
    const ownerEmail = req.user.email;
    const storeDetails = await getStoreDetailsByOwnerEmail(ownerEmail);

    if (!storeDetails) {
      return res.status(404).json({
        success: false,
        message: 'No store assigned to this account.'
      });
    }

    return res.status(200).json({
      success: true,
      store: storeDetails
    });
  } catch (error) {
    console.error('Error in getOwnerStoreData:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch store details.'
    });
  }
}

export async function changePassword(req, res) {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long.'
      });
    }

    const user = await findUserByEmail(userEmail);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.'
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect current password.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await updateUserPassword(userId, newHash);

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully.'
    });
  } catch (error) {
    console.error('Error in changePassword:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to change password.'
    });
  }
}
