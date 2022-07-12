const Posts = require('./posts-model');
const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    Posts.find(req.query)
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(error => {
        res.status(500).json({ message: 'The posts information could not be retrieved'})
    })
})

router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({ message: 'The post with the specified ID does not exist'})
        }
        
    })
    .catch(error => {
        res.status(500).json({ message: 'The post information could not be retrieved'})
    })
})

router.post('/', (req, res) => {

    if(!req.body.title || !req.body.contents){
        res.status(400).json({ message: 'Please provide title and contents for the post'})
        return;
    }

    Posts.insert(req.body)
    .then(post => {
        // console.log('postttttt: ', post);
        // res.status(201).json(post);
        Posts.findById(post.id)
        .then(innerPost => {
            res.status(201).json(innerPost);
        })
    })
    .catch(error => {
        res.status(500).json({ message: 'There was an error while saving the post to the database'})
    })
})

router.delete('/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
        if(post){
            Posts.remove(post.id)
            .then(resp => {
                res.status(200).json(post);
            })
        }else{
            res.status(404).json({ message: 'The post with the specified ID does not exist'})
        }
    })
    .catch(error => {
        res.status(500).json({ message: 'The post could not be removed'})
    })
    // Posts.findById(req.params.id)
    // .then(item => {
    //     Posts.remove(req.params.id)
    //     .then(post => {
    //     if(post){
    //         res.status(200).json();
    //     }else{
    //         res.status(404).json({ message: 'The post with the specified ID does not exist' })
    //     }
        
    // })
    // })
    // .catch(error => {
    //     res.status(500).json({ message: 'The post could not be removed'})
    // })
})

router.put('/:id', (req, res) => {

    if(!req.body.title || !req.body.contents){
        res.status(400).json({ message: 'Please provide title and contents for the post'})
        return;
    }


    Posts.update(req.params.id, req.body)
    .then(post => {
        Posts.findById(req.params.id)
        .then(innerPost => {
            if(innerPost){
                res.status(200).json(innerPost)
            }else{
                res.status(404).json({ message: 'The post with the specified ID does not exist'})
            }
        })
        // if(post){
        //     res.status(200).json(post);
        // } else{
        //     res.status(404).json({ message: 'The post with the specified ID does not exist'})
        // }
    })
    .catch(error => {
        res.status(500).json({ message: 'The post information could not be modified'})
    })
})

router.get('/:id/comments', (req, res) => {
    Posts.findPostComments(req.params.id)
    .then(comments => {
        if(comments.length > 0){
            res.status(200).json(comments);
        }
        else{
            res.status(404).json({ message: 'The post with the specified ID does not exist'})
        }
    })
    .catch(error => {
        res.status(500).json({ message: 'The comments information could not be retrieved'})
    })
})



module.exports = router;