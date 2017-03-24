var User = {

    mouseDown : false,
    first : true,
    ctrl : false,

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


        $(document).keydown(function(e) {

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
            case 'L'.charCodeAt(0):
                Scene.toggleLayers();
                break;
            case 'I'.charCodeAt(0):
                Scene.toggleInspection();
                break;
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
        });
    },
};
