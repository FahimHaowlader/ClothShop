export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
}; 

export const refreshCookieOptions = {
  ...cookieOptions,
  maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
};