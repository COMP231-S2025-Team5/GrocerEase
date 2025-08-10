
// Inline requireAdmin from admin.js for isolated test
function requireAdmin(req, res, next) {
  if (req.user && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
}

describe('requireAdmin middleware', () => {
  let req, res, next;
  beforeEach(() => {
    req = { user: {} };
    res = { status: jest.fn(() => res), json: jest.fn() };
    next = jest.fn();
  });

  it('returns 403 if user is not admin', () => {
    req.user.role = 'user';
    requireAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Admin access required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next if user is admin', () => {
    req.user.role = 'admin';
    requireAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
