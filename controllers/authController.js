import bcrypt from 'bcrypt';
import Account from '../models/Account.js';


export const showRegisterForm = (req, res) => {
  res.render('register');
};

export const showLoginForm = (req, res) => {
  res.render('login');
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await Account.create({
      username,
      email,
      password: hashedPassword,
    });
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Lỗi đăng ký!' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Account.findOne({ where: { email } });
    if (!user) return res.render('error', { message: 'Sai tài khoản' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.render('error', { message: 'Sai mật khẩu' });

    
    req.session.userEmail = user.email;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Lỗi đăng nhập!' });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.render('error', { message: 'Lỗi đăng xuất!' });
    }
    res.redirect('/login');
  });
};
