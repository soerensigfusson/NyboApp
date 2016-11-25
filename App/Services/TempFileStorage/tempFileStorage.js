(function() {
    angular.module('App.Services.Temp', [])
        .factory('TempFileStorage', temp)
        .run(watcher);


    function /*@ngInject*/ watcher($rootScope, Orders) {


        $rootScope.$on('upload_started', function(event, imageid, orderid){
            console.log(imageid, orderid);
            var order = Orders.$getRecord(orderid);
            order.files[imageid].status = 'uploading';
            Orders.$save(order);
        });
        $rootScope.$on('upload_progress', function(event, imageid, orderid, progress, downloadURL){
            console.log(imageid, progress, orderid);
            var order = Orders.$getRecord(orderid);

            if (progress<100) {
                order.files[imageid].status = 'uploading';
                order.files[imageid].progress = progress;
            } else {
                order.files[imageid].status = 'ready';
                order.files[imageid].downloadURL = downloadURL;
                delete order.files[imageid].progress;
            }

            Orders.$save(order);

        });
        $rootScope.$on('upload_complete', function(event, imageid, orderid, downloadURL){
            var order = Orders.$getRecord(orderid);
            order.files[imageid].status = 'ready';
            order.files[imageid].downloadURL = downloadURL;
            delete order.files[imageid].progress;
            Orders.$save(order);

            console.log(imageid, downloadURL)
        });

    }

    function /*@ngInject*/ temp($rootScope) {
        var filelist = {}
        var methods = {};
        var storage = firebase.storage();

        // Create a storage reference from our storage service
        var storageRef = storage.ref();
        var imagesRef = storageRef.child('images');



        methods.addFile = function(fileobj) {
            var id = guid();
            filelist[id] = fileobj;

            return id;
        }

        methods.startUpload = function(id, orderid) {
            var file = filelist[id];

            if (!file) {
                return 'no file'
            }

            var ref = imagesRef.child(id);
            var uploadTask = imagesRef.put(file);

            $rootScope.$broadcast('upload_started', id, orderid);

            uploadTask.on('state_changed', function(snapshot){
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              var downloadURL = uploadTask.snapshot.downloadURL;
              $rootScope.$broadcast('upload_progress', id, orderid, progress, downloadURL);
            }, function(error) {
              // Handle unsuccessful uploads
            }, function() {
                console.log('complete')
              var downloadURL = uploadTask.snapshot.downloadURL;
              $rootScope.$broadcast('upload_complete', id, orderid, downloadURL);
            });

            return ref;

        }

        return methods;
    }

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }


})();
