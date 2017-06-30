function CalciumFluoride(eighth, half, sphere, colors) {
    
    this.prototype = new UnitCell(eighth, half, sphere, colors);

    this.draw = function(MV, prog, pos, alpha, center, bounds, ndx, splitAmt) {

        MV.pushMatrix();
        MV.translate(pos);
        MV.scale(.47);
        
        //if(bounds[0] == UnitCellPos.MIDDLE && bounds[1] == UnitCellPos.MIDDLE && bounds[2] == UnitCellPos.MIDDLE) {
            this.drawCell(MV, prog);
        //}
    
        MV.popMatrix();

        gl.uniform1f(prog.getHandle("alpha"), alpha); // Make sure alpha is same as it was 
    };
    
    this.drawCell = function(MV, prog) {
        //draw F cluster
        this.drawFCluster(MV, prog);
        
        //draw the 8 Ca corners
        this.drawCaEighth(MV, prog, 0, false);
        this.drawCaEighth(MV, prog, 90, false);
        this.drawCaEighth(MV, prog, 180, false);
        this.drawCaEighth(MV, prog, 270, false);
        this.drawCaEighth(MV, prog, 0, true);
        this.drawCaEighth(MV, prog, 90, true);
        this.drawCaEighth(MV, prog, 180, true);
        this.drawCaEighth(MV, prog, 270, true);
        
        //draw the 6 Ca faces
        this.drawCaHalf(MV, prog, false, false, false, false, false);
        this.drawCaHalf(MV, prog, true, false, false, false, false);
        this.drawCaHalf(MV, prog, false, true, false, false, false);
        this.drawCaHalf(MV, prog, false, false, false, true, false);
        this.drawCaHalf(MV, prog, false, false, true, true, true);
        this.drawCaHalf(MV, prog, false, true, true, false, false);
    }
    
    this.drawFCluster = function(MV, prog) {
        gl.uniform3fv(prog.getHandle("kdFront"), colors["white"]);
        
        for(var i = -1; i < 2; i += 2) {
            for(var j = -1; j < 2; j += 2) {
                for(var k = -1; k < 2; k += 2) {
                    MV.pushMatrix();
                    MV.translate(vec3.fromValues(i, j, k));
                    gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
                    sphere.draw(prog);
                    MV.popMatrix();
                }
            }
        }
    }
    
    this.drawCaEighth = function(MV, prog, rot, flipY) {
        
        MV.pushMatrix();
        
        if (flipY) {
            MV.rotate(180, vec3.fromValues(1, 0, 0));
        }
        MV.rotate(rot, vec3.fromValues(0, 1, 0));
        MV.translate(vec3.fromValues(2.15, -2.15, -2.15));
        
        gl.uniform3fv(prog.getHandle("kdFront"), colors["orange"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        eighth.draw(prog);
        MV.popMatrix();
    }
    
    this.drawCaHalf = function(MV, prog, flipX, onY, flipY, onZ, flipZ) {
        
        MV.pushMatrix();
        
        if(flipX) {
            MV.rotate(180, vec3.fromValues(0, 1, 0));
        }
        if(onY) {
            if(flipY) {
                MV.rotate(180, vec3.fromValues(1, 0, 0));
            }
            MV.rotate(90, vec3.fromValues(0, 0, 1));
        }
        if(onZ) {
            if(flipZ) {
                MV.rotate(180, vec3.fromValues(0, 1, 0));
            }
            MV.rotate(-90, vec3.fromValues(0, 1, 0));
        }
        MV.translate(vec3.fromValues(1.15, 0, 0));
        MV.rotate(180, vec3.fromValues(0, 1, 0));
        
        gl.uniform3fv(prog.getHandle("kdFront"), colors["orange"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        half.draw(prog);
        MV.popMatrix();
    }
}
