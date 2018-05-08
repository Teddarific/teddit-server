import Post from '../models/postModel';

export const createPost = (req, res) => {
  const post = new Post();

  post.title = req.body.title;
  post.content = req.body.content;
  post.tags = req.body.tags;
  post.cover_url = req.body.cover_url;
  post.contentType = req.body.contentType;
  post.upvotes = 0;
  post.downvotes = 0;
  post.dateCreated = Date.now();

  post.save()
    .then((result) => {
      res.json({ message: 'Post created' });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const getPosts = (req, res) => {
  let pipeline = [{
    $sort: { _id: -1 },
  }];
  if (req.query.sortMethod === 'top') {
    pipeline = [{
      $addFields: {
        scorePipe: { $subtract: ['$upvotes', '$downvotes'] },
      },
    },
    {
      $sort: { scorePipe: -1 },
    }];
  }
  Post.aggregate(pipeline)
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const getPost = (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const deletePost = (req, res) => {
  Post.remove({ _id: req.params.id })
    .then((result) => {
      res.json({ message: 'Post deleted' });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const updatePost = (req, res) => {
  const fields = {};
  const fieldNames = ['title', 'tags', 'content', 'cover_url', 'contentType', 'upvotes', 'downvotes'];
  for (let i = 0; i < fieldNames.length; i += 1) {
    if (req.body[fieldNames[i]]) {
      fields[fieldNames[i]] = req.body[fieldNames[i]];
    }
  }
  Post.findByIdAndUpdate(req.params.id, fields, { new: true }, (error, post) => {
    if (error) {
      res.status(500).json({ error });
    }
    res.json(post);
  });
};

export const votePost = (req, res) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    if (req.body.vote === 'upvote') {
      post.upvotes += 1;
    } else {
      post.downvotes += 1;
    }
    post.save();
    res.json({ message: 'Post updated' });
  });
};
