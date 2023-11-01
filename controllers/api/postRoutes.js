const router = require('express').Router();
const { Post, Comment } = require('../../models');

router.post('/', async (req, res) => {
    try {
        const newPost = await Post.create({
            name: req.body.title,
            text: req.body.text,
            user_id: req.session.user_id
        });

        res.status(200).json(newPost);

    } catch (err) {
        res.status(500).json(err)
    }
});

router.put('/:id', async (req, res) => {
    try {
        const editPost = await Post.update(
            {
                name: req.body.title,
                text: req.body.text
            },
            {
                where: {
                    id: req.params.id,
                    user_id: req.session.user_id
                }
            }
        );

        res.status(200).json(editPost);

    } catch (err) {
        res.status(500).json(err)
    }
});


router.post('/comment/:id', async (req, res) => {

    const postID = req.params.id;

    try {
        const comment = await Comment.create(
            {
                text: req.body.text,
                user_id: req.session.user_id,
                post_id: postID,
            }
        );

        res.status(200)json(comment);

    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;