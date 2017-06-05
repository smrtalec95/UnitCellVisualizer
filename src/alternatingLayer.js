// a more robust Layer
// for NaCl
function AltLayer(rows, cols, restHeight, xexpansion, zexpansion, color1, size1, color2, size2, sphere) {

    this.reset = function() {
        curHeight = startHeight;
        atRest = false;
    };

    this.update = function() {
        if (curHeight - speed > restHeight) {
            curHeight -= speed;
        } else {
            curHeight = restHeight;
            atRest = true;
        }
    };

    this.draw = function(MV, prog) {

        gl.uniform1f(prog.getHandle("alpha"), 1.0);
        //gl.uniform3fv(prog.getHandle("kdFront"), color);
        
        

        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                
                var pos = vec3.fromValues(offset[0] + j*2*xexpansion, curHeight*xexpansion, offset[2] + i*2*zexpansion);

                MV.pushMatrix();
                MV.translate(pos);
                
                //even spheres get the first scale
                if((i + j) % 2 == 0) {
                    MV.scale(size1);
                    gl.uniform3fv(prog.getHandle("kdFront"), color1);
                } else {
                    MV.scale(size2);
                    gl.uniform3fv(prog.getHandle("kdFront"), color2);
                }
                
                gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
                sphere.draw(prog);
                MV.popMatrix();
            }
        }

    };
    
    this.isAtRest = function() { return atRest; };

    var rows = rows;
    var cols = cols;
    var startHeight = 7.0;
    var restHeight = restHeight;
    var xexpansion = xexpansion;
    var zexpansion = zexpansion;
    var curHeight = 7.0;
    var speed = .05;
    var atRest = false;
    var color = color;
    var offset = vec3.fromValues(-(cols-1)*xexpansion, restHeight,-(rows-1)*zexpansion);
    var sphere = sphere;
}