import express from 'express';
import { createUser } from '../controllers/User';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index');
});

router.post('/join', createUser);

router.get('/app', function(req, res, next) {
  res.render('app');
});

export default router;
