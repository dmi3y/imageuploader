/*!
 * jQuery image uploader 
 * Original author: @lapshukov
 * Licensed under the MIT license
 */

;(function($, scope, undefined){

    // somesort of initialization

    var
    // global options set
    options = {
        sizesLableSelector: '.sizesLable',
        sizesUploadedSelector: '.sizesUploaded',
        fileButtonResizedImgSelector: '.fileButtonResizedImg',
        fileButtonResizedImgSelector: '#originalimage_resizedFile',
        fileBUttonOrigImgSelector: '#originalimage_file',
        imageManipulatorSelector: '#imageManipulator',
        uploadedSizes: [],
        expectedSizes: [],
        thumbWidth: '50px',
        _filter: /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xscopedump)$/i,
        _debug: false;
    },

    _methods = {
        cancelUpload: methods.cancelUpload,
        confirmFilesOverride: function () {
            if (fileButton.val().length) {
                if (!confirm('You about attach new files, there is some already. \n They will be canceled! \n\n Sure?')) return false;
                _methods._swipeDownload();
            }
        },
        checkFileByType: function () { // highly efficient way, required modern browsers fileReader API
            var _val, _count = 0, _del;

            $.each(file, function(ix, val){
                if (!(rFilter.exec(val.type))) { // need only images here
                    _methods._cancelUpload(val.name + ' is not image! \n\n Select again.');
                }
                
                if (fileButtonResizedImg[0]) { // proceed file read to check accual dementions if it is resized images
                    _del = ix * 1500;
                    scope.setTimeout(function(){
                        _val = file[_count];
                        oFReader.readAsDataURL(_val);
                        _count++;
                    }, _del); //slow down when use multiply files
                }
            });
        },
        swipeDownload: function () {
            fileButton.wrap('<form></form>').parent().trigger('reset').children().unwrap('<form></form>'); // clean up input file
            sizesLable.find('img').remove();
        },
        debugLog: function(log) {
            return options._debug? console.log(log): null;
        }
    },
    methods = {
        cancelUpload: function (message) {
            alert(message);
            _methods._swipeDownload(); // clean buttons
            return false; // magic cancel
        }
    },
    dumdumVariableEnd;

    // helper DOM manipulator, actually bare dom element, which needs some assistantce stylesheets short proto http://jsbin.com/azeday/1/edit
    var imageManipulator = $(options.imageManipulatorSelector)[0] || $("body").append("<img " + options.imageManipulatorSelector + " />").end().find(options.imageManipulatorSelector)[0],
    $imageManipulator = $(imageManipulator);

    // to make it inbox, place asset styles inline @TODO make it optional for neat freaks as I am
    $imageManipulator.css({
        visibility: "hidden",
        position: "absolute"
    });




    // checking out the existance of necessary APIs
    if (scope.File && scope.FileReader && scope.FileList && scope.Blob) {
        
        
        var             
            sizesLable = $(options.sizesLableSelector),
            sizesUploaded = $(options.sizesUploadedSelector),
            fileButtonResizedImg = $(options.fileButtonResizedImgSelector),
            fileButtonOrigImg = $(options.fileBUttonOrigImgSelector),
            fileButton = $(fileButtonResizedImg[0] || fileButtonOrigImg[0]),
            oFReader = new FileReader(), 
            uploadInitiator,
            expectedSize,
            file,
            dumdumVariableEnd;
            
        // file reader onload event listerer
        // manipulate with image, use when we need define exact dementions
        oFReader.onload = function(ev) { 
            imageManipulator.attr('src', ev.target.result);
                scope.setTimeout(function(){
                    var width = imageManipulator.width(), 
                        height = imageManipulator.height(),
                        size = width + 'x' + height;

                    if( typeof expectedSizes[width + 'x' + height] == 'undefined') {
                        _methods.cancelUpload(_val.name + ' has size ' + size + ' which is not in range! \n\n Select again.');
                    }
                    else {
                        var _methods.imageManipulator = imageManipulator.clone().removeAttr('id');
                        _imageManipulator.attr('width', options.thumbWidth);
                        $(expectedSizes[size]).append(_imageManipulator);
                    }
                }, 500) // slow down to proceed image url into the DOM @REV probably load?
        }
        // file reader onload event listerer end   
        sizesLable.each(function(ix, el){
            expectedSizes[$(el).attr('rel')] = el;
            $(el).click(function(ev){fileButtonResizedImg.trigger(ev)});
        });
        
        sizesUploaded.each(function(){ // show uploaded sizes into the chart
            var uploadedSize = $(this).text(),
                sizesLableSpan = $(options.sizesLableSelector + '[rel='+ uploadedSize +']');
                
            sizesLableSpan.addClass(options.sizesUploadedSelector.slice(1)); // @REV @TODO flimpsy, will acting up with complex selectors                    
            uploadedSizes[uploadedSize] = sizesLableSpan;
        });
        
        fileButtonResizedImg.click(function(ev){
            _methods.confirmFilesOverride();
            uploadInitiator = ev.target;
            expectedSize = ev.target.innerText.split('x');
            
        }).change(function(ev) {
            
            file = ev.target.files || ev.target.value;
            
            if (typeof file == 'object') { // looks like browser is quite efficient and supports files API @TODO I did have already this check at top of the code, @REV remove?         
                
                _methods.checkFileByType();
                
                if ( expectedSize.length == 2 ) { // perform additional checking ?
                }
                else {  // has to be direct click on the upload button @TODO elaborate this cases
                }
                
            } else {
                // here is going to be fallback for browsers which not handling with file API using value, just disgust for a while @TODO check it out, looks like it is extra stuff
            }
            
        });
        
        // validate original image
        fileButtonOrigImg.
        .click( function() {
            _methods.confirmFilesOverride();
        })
        .change( function( ev ) {
            file = ev.target.files || ev.target.value;
            _methods.checkFileByType();
        });
        // validate original image end
        
        // debug stuff
        if ( options._debug ) {
            console.log('expected:', expectedSizes);
            console.log('uploaded:', uploadedSizes);
        }
        // end of debug stuff
    } else {
        //console.log('The File APIs are not fully supported in this browser.');
    }
})(jQuery, this);