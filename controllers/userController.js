// controllers/userController.js
import { Op } from 'sequelize';
import Account from '../models/Account.js';

export const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let accounts;
    if (search) {
      accounts = await Account.findAll({
        where: {
          [Op.or]: [
            { username: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        },
        attributes: ['id', 'username', 'email', 'balance'], // Exclude sensitive fields like password
      });
    } else {
      accounts = await Account.findAll({
        attributes: ['id', 'username', 'email', 'balance'],
      });
    }
    res.json(accounts);
  } catch (error) {
    console.error('Lỗi lấy danh sách người dùng:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

export const addMoney = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ success: false, message: 'Số tiền không hợp lệ' });
    }

    const account = await Account.findByPk(userId);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    account.balance += amountNum;
    await account.save();

    res.json({ success: true, message: 'Nạp tiền thành công', balance: account.balance });
  } catch (error) {
    console.error('Lỗi nạp tiền:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

export const deductMoney = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ success: false, message: 'Số tiền không hợp lệ' });
    }

    const account = await Account.findByPk(userId);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    if (account.balance < amountNum) {
      return res.status(400).json({ success: false, message: 'Số dư không đủ' });
    }

    account.balance -= amountNum;
    await account.save();

    res.json({ success: true, message: 'Trừ tiền thành công', balance: account.balance });
  } catch (error) {
    console.error('Lỗi trừ tiền:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};