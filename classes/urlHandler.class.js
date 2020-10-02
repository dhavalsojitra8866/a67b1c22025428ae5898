bodyParser = require('body-parser');
module.exports = {

    BindWithCluster: function () {

        app.use(bodyParser.json({
            limit: '50mb'
        }));
        app.use(bodyParser.urlencoded({
            limit: '50mb',
            extended: true
        }));

        //GET returns all users from users table
        app.get('/api/users', async function (req, res) {
            var all = await databaseClass.findDataNew('users', {}, {_id:0}, {}, 0, 0);
            console.log("find ---->",all);
            var resp ={
                    "status": "success",
                    "message": "Data fetched successfully",
                    "data": all
                }
            res.send(resp);
        });

        //GET returns specific user from users table given id
        app.get('/api/users/:id', async function (req, res) {
            console.log("params --->",req.params)
            const id = Number(req.params.id);
            var user = await databaseClass.findDataNew('users', {id:id}, {_id:0}, {}, 0, 0);
            console.log("user ---->",user);
            var resp ={
                    "status": "success",
                    "message": "Data fetched successfully",
                    "data": user
                }
            res.send(resp);
        });

        //POST adds a new user to the users table
        app.post('/api/user', async function (req, res) {
            console.log("req.body --->",req.body)
            var user = await databaseClass.findDataNew('users', {}, {}, {_id: -1}, 1, 0);
            console.log("user ---->",user);

            const nextId = (user.length === 0)? 1: (Number(user[0].id) + 1)
            console.log("nextId ---->",nextId);

            const inserData ={
                "id":nextId,
                "firstName": req.body.firstName,
                "lastName": req.body.lastName,
                "email": req.body.email
            }
            console.log("inserData ---->",inserData);

            const ins = await databaseClass.insertDataNew("users", inserData);
            console.log("ins ---->",ins.ops);
            delete ins.ops[0]._id
            if(ins.result.n === 1){
                var resp ={
                    "status": "success",
                    "message": "Your data inserted successfully",
                    "data": ins.ops[0]
                }
            }
            if(ins.result.n === 0){
                var resp ={
                    "status": "fail",
                    "message": "Error inserting data"
                }
            }
            res.send(resp);
        });

        //PUT updates specific user in users table
        app.put('/api/users/:id', async function (req, res) {
            console.log("params --->",req.params)
            const id = Number(req.params.id);
            var upDate = {
                $set: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email
                }
            }
            console.log("upDate ---->",upDate )
            var up = await databaseClass.updateDataNew('users', {
                            id: Number(req.params.id)
                        }, upDate, {});
            console.log("up ---->",up);
            if(up === 1){
                var user = await databaseClass.findDataNew('users', {id: id}, {}, {}, 1, 0);

                var resp ={
                    "status": "success",
                    "message": "Your data updated successfully",
                    "data": user
                }
            }
            if(up === 0){
                var resp ={
                    "status": "fail",
                    "message": "Error to update data"
                }
            }
            res.send(resp);
        });

        //DELETE removes the specific user from users table with the given id
        app.delete('/api/users/:id', async function (req, res) {
            console.log("params --->",req.params)
            const id = Number(req.params.id);
            var user = await databaseClass.findDataNew('users', {id:id}, {}, {}, 0, 0);
            if(user.length === 0){
                var resp ={
                    "status": "fail",
                    "message": "Requested user for delete is not found"
                }
            }else{
                await databaseClass.removeData('users', {id:id});
                var resp ={
                    "status": "success",
                    "message": "Your data removed successfully"
                }
            }
            res.send(resp);
        });


        //GET depending on input, returns entry from users table
        app.get('/api/typeahead/:input', async function (req, res) {
            console.log("params --->",req.params)
            const search = req.params.input;
            console.log("search --->",search)

            // var firstName = await databaseClass.findDataLike('users', {firstName:'/'+search+'/'}, {}, {}, 0, 0);
            var firstName = await databaseClass.findDataLike('users', {firstName:new RegExp(search)}, {_id:0}, {}, 0, 0);
            var lastName = await databaseClass.findDataLike('users', {lastName:new RegExp(search)}, {_id:0}, {}, 0, 0);
            var email = await databaseClass.findDataLike('users', {email:new RegExp(search)}, {_id:0}, {}, 0, 0);
            console.log("firstName ---->",firstName);
            console.log("lastName ---->",lastName);
            console.log("email ---->",email);
            var data =[]
            for(var i = 0; i <= firstName.length-1; i++){
                data.push(firstName)
            }
            for(var i = 0; i <= lastName.length-1; i++){
                data.push(lastName)
            }
            for(var i = 0; i <= email.length-1; i++){
                data.push(email)
            }
            console.log("data --->", data[0])
            const unique = await urlHanlder.getUnique(data, "id");
            console.log("unique --->", unique.length)

            const resp ={
                "status": "success",
                "message": "Your search result",
                "data": (unique.length === 0)? []: unique[0]
            }
            res.send(resp);
        });
    },
    getUnique: async function (originalArray, prop) {
        console.log("getUnique :::::",originalArray)
            var newArray = [];
            var lookupObject  = {};

            for(var i in originalArray) {
                lookupObject[originalArray[i][prop]] = originalArray[i];
            }

            for(i in lookupObject) {
                if(newArray.length <=10){
                    newArray.push(lookupObject[i]);
                }
            }
            newArray.sort((a, b) => Number(b.id) - Number(a.id));
            console.log("descending", newArray);
            return newArray;
    }
}
