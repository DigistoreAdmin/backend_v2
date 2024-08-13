const { authentication, restrictTo } = require('../controller/authController');
const {
    createProject,
    getAllProject,
    getProjectById,
    updateProject,
    deleteProject,
} = require('../controller/projectController');

const router = require('express').Router();

router
    .route('/')
    .post(authentication, restrictTo('0'), createProject)
    .get(authentication, restrictTo('0'), getAllProject);

router
    .route('/:id')
    .get(authentication, restrictTo('0'), getProjectById)
    .patch(authentication, restrictTo('0'), updateProject)
    .delete(authentication, restrictTo('0'), deleteProject);

module.exports = router;
