var userModel = require('../models/users');

module.exports = function(req, res) {
    var glassType = req.body.glasstype;
    var glassNature = req.body.glassnature;
    var glassSubClass = req.body.glasssubclass;
    var projName = req.body.projectname;
    var glassWidth = req.body.width;
    var glassHeight = req.body.height;
    var glassWidth1 = req.body.width1;
    var glassWidth2 = req.body.width2;

    if (!req.body.email) {
        res.json({
            'dataUpdated': 'false',
            'error': 'User not logged in or Email not entered'
        })
        return false;
    }

    var emailID = req.body.email.toLowerCase();
    var query = {
        'email': emailID
    }
    //, 'projectData.projectName': { $ne: projName }};
    //var queryforProjPresent = {'username':req.body.username, 'projectData.projectName':  projName };

    userModel.findOne(query).exec(function(err, user) {
        if (err) {
            console.log(err);
            res.json({
                'dataUpdated': 'false',
                'error': 'Database error'
            });
            return false;
        }

        if (user) {
            console.log(glassType)
            if (!glassType) {
                res.json({
                    'dataUpdated': 'false',
                    'error': 'Glasstype not found'
                });
                return false;
            }

            if (!glassNature) {
                res.json({
                    'dataUpdated': 'false',
                    'error': 'GlassNature not found'
                });
                return false;
            }

            if (!glassSubClass) {
                res.json({
                    'dataUpdated': 'false',
                    'error': 'glassSubClass not found'
                });
                return false;
            }

            if (!projName) {
                res.json({
                    'dataUpdated': 'false',
                    'error': 'projName not found'
                });
                return false;
            }

            if (!glassWidth) {
                res.json({
                    'dataUpdated': 'false',
                    'error': 'glassWidth not found'
                });
                return false;
            }

            if (!glassHeight) {
                res.json({
                    'dataUpdated': 'false',
                    'error': 'glassHeight not found'
                });
                return false;
            }

            console.log(user)
            //  console.log(projectData)
            //  console.log(projectData)
            for (var i = 0; i < user.projectData.length; i++) {
                console.log('Checking ' + user.projectData[i].projectName + '==' + projName)
                if (user.projectData[i].projectName == projName) {
                    res.json({
                        'dataUpdated': 'false',
                        'error': 'projectNameAlreadyExists'
                    })
                    console.log({
                        'dataUpdated': 'false',
                        'error': 'projectNameAlreadyExists'
                    })
                    return false;
                }
            }

            var newProjObj = {
                projectName: projName,
                glassType: glassType,
                glassNature: glassNature,
                glassSubClass: glassSubClass,
                width: glassWidth,
                height: glassHeight,
                width1 : glassWidth1 || 0 ,
                width2 : glassWidth2 || 0
            }

            userModel.update({
                email: emailID
            }, {
                $push: {
                    projectData: newProjObj
                }
            }, function(err) {
                if (err) {
                    console.log(err);
                    res.json({
                        'dataUpdated': 'false',
                        'error': 'false',
                        'errorDesc': 'Database Error'
                    });
                    console.log({
                        'dataUpdated': 'false',
                        'error': 'false',
                        'errorDesc': 'Database Error'
                    })
                } else {
                    res.json({
                        'dataUpdated': 'true',
                        'error': 'false'
                    });
                    console.log('{dataUpdated : true, error : false} for the user: ' + user)
                }
            });


        } else {
            res.json({
                'dataUpdated': 'false',
                'error': 'userNotFound'
            })
            console.log({
                'dataUpdated': 'false',
                'error': 'userNotFound'
            })
        }
    })


}
