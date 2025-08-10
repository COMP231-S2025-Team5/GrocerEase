

const auth = require('../middleware/auth.js').default;
const jwt = require('jsonwebtoken');
jest.mock('../models/User.js', () => {
  return {
    __esModule: true,
    default: {
      findById: jest.fn()
    }
  };
});
const User = require('../models/User.js').default;

const JWT_SECRET = process.env.JWT_SECRET || 'grocerease_secret_key_2025';

describe('auth middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { header: jest.fn() };
    res = { status: jest.fn(() => res), json: jest.fn() };
    next = jest.fn();
  });

  it('returns 401 if no token', async () => {
    req.header.mockReturnValue(null);
    await auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 if user does not exist', async () => {
    const token = jwt.sign({ userId: '123' }, JWT_SECRET);
    req.header.mockReturnValue('Bearer ' + token);
    User.findById.mockResolvedValue(null);
    await auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next and attaches user if valid', async () => {
    const token = jwt.sign({ userId: '123' }, JWT_SECRET);
    req.header.mockReturnValue('Bearer ' + token);
    User.findById.mockResolvedValue({ role: 'user' });
    await auth(req, res, next);
    expect(req.user).toEqual({ userId: '123', role: 'user' });
    expect(next).toHaveBeenCalled();
  });
});
