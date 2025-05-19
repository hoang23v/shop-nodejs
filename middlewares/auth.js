import Account from '../models/Account.js';

export const restrictToAdmin = async (req, res, next) => {
  try {
    console.log('Session:', req.session);
    console.log('UserId:', req.session?.userId);
    const userId = req.session.userId;
    if (!userId) {
      console.log('Chưa đăng nhập, chuyển hướng /login');
      return res.redirect('/login');
    }

    const user = await Account.findByPk(userId);
    console.log('User:', user);
    if (!user) {
      console.log('Không tìm thấy user, chuyển hướng /login');
      return res.redirect('/login');
    }

    if (!user.isAdmin) {
      console.log('Không phải admin, chuyển hướng /');
      return res.redirect('/');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Lỗi kiểm tra admin:', error);
    res.redirect('/error');
  }
};

export const setUser = async (req, res, next) => {
  try {
    if (req.session.userId) {
      const user = await Account.findByPk(req.session.userId);
      if (user) {
        let purchasedServices = user.purchasedServices;
        if (typeof purchasedServices === 'string') {
          try {
            purchasedServices = JSON.parse(purchasedServices);
          } catch (e) {
            console.error('Error parsing purchasedServices:', e);
            purchasedServices = [];
          }
        }
        if (!Array.isArray(purchasedServices)) {
          purchasedServices = [];
        }
        res.locals.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          balance: user.balance,
          purchasedServices,
          isAdmin: user.isAdmin,
        };
      } else {
        res.locals.user = null;
      }
    } else {
      res.locals.user = null;
    }
    console.log('res.locals.user:', res.locals.user); // Debug
    next();
  } catch (error) {
    console.error('Lỗi setUser middleware:', error);
    res.locals.user = null;
    next();
  }
};

export const requireLogin = (req, res, next) => {
  if (!req.session.userId || !res.locals.user) {
    console.log('Chưa đăng nhập, chuyển hướng /login');
    return res.redirect('/login');
  }
  next();
};