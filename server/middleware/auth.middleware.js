const auth = async (req, res, next) => {
  if (req.body.id) return next();
  if (req.session && req.session.playerId) return next();
  else return res.status(401).json({ message: "Player not logged" });
};

const admin = async (req, res, next) => {
  if (req.session && req.session.playerId) return next();
  else return res.status(401).json({ message: "Player not authorized" });
};

export { auth, admin };