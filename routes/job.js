var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display job page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM job ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/job/index.ejs
            res.render('job',{data:''});   
        } else {
            // render to views/job/index.ejs
            res.render('job',{data:rows});
        }
    });
});

// display add job page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('job/add', {
        profile: '',
        description: ''        
    })
})

// add a new job
router.post('/add', function(req, res, next) {    

    let profile = req.body.profile;
    let description = req.body.description;
    let errors = false;

    if(profile.length === 0 || description.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter profile and description");
        // render to add.ejs with flash message
        res.render('job/add', {
            profile: profile,
            description: description
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            profile: profile,
            description: description
        }
        
        // insert query
        dbConn.query('INSERT INTO job SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('job/add', {
                    profile: form_data.profile,
                    description: form_data.description                    
                })
            } else {                
                req.flash('success', 'job successfully added');
                res.redirect('/job');
            }
        })
    }
})

// display edit job page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM job WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'job not found with id = ' + id)
            res.redirect('/job')
        }
        // if job found
        else {
            // render to edit.ejs
            res.render('job/edit', {
                title: 'Edit job', 
                id: rows[0].id,
                profile: rows[0].profile,
                description: rows[0].description
            })
        }
    })
})

// update job data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let profile = req.body.profile;
    let description = req.body.description;
    let errors = false;

    if(profile.length === 0 || description.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter profile and description");
        // render to add.ejs with flash message
        res.render('job/edit', {
            id: req.params.id,
            profile: profile,
            description: description
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            profile: profile,
            description: description
        }
        // update query
        dbConn.query('UPDATE job SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('job/edit', {
                    id: req.params.id,
                    profile: form_data.profile,
                    description: form_data.description
                })
            } else {
                req.flash('success', 'job successfully updated');
                res.redirect('/job');
            }
        })
    }
})
   
// delete job
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM job WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to job page
            res.redirect('/job')
        } else {
            // set flash message
            req.flash('success', 'job successfully deleted! ID = ' + id)
            // redirect to job page
            res.redirect('/job')
        }
    })
})

module.exports = router;