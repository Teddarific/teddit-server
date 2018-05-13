import { Router } from 'express';
import { requireAuth, requireSignin } from './services/passport';
import * as Posts from './controllers/postController';
import * as UserController from './controllers/userController';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

router.route('/posts')
  .post(requireAuth, Posts.createPost)
  .get(Posts.getPosts);

router.route('/posts/:id')
  .get(Posts.getPost)
  .put(Posts.updatePost)
  .delete(requireAuth, Posts.deletePost);

router.route('/posts/vote/:id')
  .put(Posts.votePost);

router.post('/signin', requireSignin, UserController.signIn);

router.route('/signup')
  .post(UserController.signUp)
  .get(UserController.validateNewField);


export default router;
