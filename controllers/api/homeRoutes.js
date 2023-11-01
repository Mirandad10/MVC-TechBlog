const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const CheckAuth = require('../utils/auth');

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }
    res.render('login');
});


router.get('/signup', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }
    res.render('signup');
});

router.get('/', authCheck, async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [{ model: User }]
        });

        if (!postData) {
            res.status(404).json({ message: 'Post data not found' })
        };

        const posts = postData.map((item) => item.get({ plain: true }));

        res.render('homepage', { posts, logged_in: req.session.logged_in });

    } catch (err) {
        res.status(500).json(err)
    }
});

FD
router.get('/dashboard', authCheck, async (req, res) => {
    try {
        const postData = await Post.findAll({
            where: { user_id: req.session.user_id }
        });

        if (!postData) {
            res.status(404).json({ message: 'Post data not found' })
        };

        const posts = postData.map((item) => item.get({ plain: true }));

        res.render('dashboard', { posts, logged_in: req.session.logged_in });

    } catch (err) {
        res.status(500).json(err)
    }
});

router.get('/edit/:id', authCheck, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            where: { user_id: req.session.user_id },
            include: [{ model: User }]
        });

        if (!postData) {
            res.status(404).json({ message: 'Post data not found cant edit' })
        };

        const post = postData.get({ plain: true });

        res.render('edit', { post, logged_in: req.session.logged_in });

    } catch (err) {
        res.status(500).json(err)
    }
});

router.get('/comment/:id', CheckAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [{ model: User }, { model: Comment, include: [{ model: User }] }]
        });

        if (!postData) {
            res.status(404).json({ message: 'Post data not found cant comment.' })
        };

        const post = postData.get({ plain: true });

        res.render('comment', { post, logged_in: req.session.logged_in });

    } catch (err) {
        res.status(500).json(err)
    }
});

router.get('/create', CheckAuth, async (req, res) => {
    res.render('create');
});

module.exports = router;