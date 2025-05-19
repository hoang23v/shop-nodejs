import bcrypt from 'bcrypt';
import Account from '../models/Account.js';

export const showRegisterForm = (req, res) => {
  res.render('register', { error: null, success: null, username: '', email: '' });
};

export const showLoginForm = (req, res) => {
  res.render('login', { error: null, email: '' });
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await Account.findOne({ where: { username } });
    const existingEmail = await Account.findOne({ where: { email } });

    if (existingUser) {
      return res.render('register', {
        error: 'Username đã được sử dụng!',
        success: null,
        username: '',
        email,
      });
    }
    if (existingEmail) {
      return res.render('register', {
        error: 'Email đã được sử dụng!',
        success: null,
        username,
        email: '',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Account.create({
      username,
      email,
      password: hashedPassword,
      balance: 0,
      purchasedServices: [],
      isAdmin: false,
    });

    res.render('register', {
      error: null,
      success: 'Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập trong 3 giây.',
      username: '',
      email: '',
    });
  } catch (err) {
    console.error('Lỗi đăng ký:', err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      const errorMessage =
        err.errors[0].path === 'username'
          ? 'Username đã được sử dụng!'
          : 'Email đã được sử dụng!';
      return res.render('register', {
        error: errorMessage,
        success: null,
        username: err.errors[0].path === 'username' ? '' : username,
        email: err.errors[0].path === 'email' ? '' : email,
      });
    }
    res.render('register', {
      error: 'Lỗi đăng ký! Vui lòng thử lại.',
      success: null,
      username,
      email,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Account.findOne({ where: { email } });
    if (!user) {
      return res.render('login', { error: 'Sai tài khoản', email });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('login', { error: 'Sai mật khẩu', email });
    }

    // Lưu userId vào session
    req.session.userId = user.id;
    console.log('Session sau đăng nhập:', req.session); // Debug

    // Chuyển hướng tùy theo quyền admin
    if (user.isAdmin) {
      res.redirect('/admin/add-product');
    } else {
      res.redirect('/');
    }
  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    res.render('login', { error: 'Lỗi đăng nhập!', email });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Lỗi đăng xuất:', err);
      return res.render('error', { message: 'Lỗi đăng xuất!' });
    }
    res.redirect('/login');
  });
};