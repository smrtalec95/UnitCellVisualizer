var User = {

    mouseDown : false,
    first : true,
    ctrl : false,
    shift : false,

    setup: function() {

        var canvas = document.getElementById("canvas");

        canvas.onmousedown = function(e) {
            User.mouseDown = true;
        };

        canvas.onmouseup = function(e) {
            User.mouseDown = false;
            User.first = true;
        };

        canvas.onmousemove = function(e) {

            if (User.mouseDown) {
                camera.mouseMoved(e.clientX, e.clientY, User.first, User.ctrl);

                if (User.first) {
                    User.first = false;
                }
            }
        };

        canvas.onwheel = function(e) {
            //16 is shift
            if(User.shift) {
                //wheel up - expand
                if(e.deltaY < 0) {
                    Scene.expand();
                }
                //wheel down - contract
                //if(e.deltaY < 0) {
                else {
                    Scene.contract();
                }
            } else {
                //wheel up - zoom in
                if(e.deltaY < 0) {
                    camera.zoomIn();
                }
                //wheel down - zoom out
                else {
                    camera.zoomOut();
                }
            }
        }

        $(document).keydown(function(e) {
            
            shift = e.shiftKey;
//            
//            if(e.shiftKey) {
//                shift = true;
//            }
//            else {
//                shift = false;
//            }

            switch(e.which) {

	        case 'E'.charCodeAt(0): // left
                    Scene.expand();
                    break;
                        
	        case 'C'.charCodeAt(0): // right
                    Scene.contract();
                    break;
                        
	        case 'T'.charCodeAt(0):
                    Scene.toggleTranslucency();
                    break;
                        
	        case 'N'.charCodeAt(0):
                    camera.reset();
                    Scene.nextCrystal();
                    document.getElementById("crystalType").innerHTML = Scene.getCrystalName();
                    break;
                    
                case 'P'.charCodeAt(0):
                    camera.reset();
                    Scene.prevCrystal();
                    document.getElementById("crystalType").innerHTML = Scene.getCrystalName();
                    break;
                        
                case 'L'.charCodeAt(0):
                    Scene.toggleLayers();
                    break;
                    
                case 'I'.charCodeAt(0):
                    Scene.toggleInspection();
                    break;
                    
                case 'R'.charCodeAt(0) :
                    Scene.toggleCoord();
                    break;
                    
                // 16 is windows shift, 91 & 93 are command keys on macs, 
                // 224 is for firefox
//                case 16:
//                case 91:
//                case 93:
//                case 224:
//                    console.log('shift pressed');
//                    User.shift = true;
//                    break;
            
                case 17:
                    User.ctrl = true;
                    break;
                
	        default: return; // exit this handler for other keys
	        }
	        e.preventDefault(); // prevent the default action (scroll / move caret)

        });

        $(document).keyup(function(e) {

            if (e.which == 17) {
                User.ctrl = false;
            }
//            else if(e.which == 16) {
//                User.shift = false;
//            }
        });
    },
};
