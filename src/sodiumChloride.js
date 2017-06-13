function SodiumChloride(eighth, half, sphere, colors) {
    
    this.prototype = new UnitCell(eighth, half, sphere, colors);
    
    this.draw = function(MV, prog, pos, alpha, center, bounds, ndx, splitAmt) {
        
        MV.pushMatrix();
        MV.translate(pos);
        
        //cell generation code makes a 2 by 2 by 2 cell
        //need a 1 by 1 by 1 cell
        MV.scale(.51);
        
            /*this.drawNaEighth(MV, prog, 0, false);
            this.drawNaEighth(MV, prog, 90, false);
            this.drawNaEighth(MV, prog, 180, false);
            this.drawNaEighth(MV, prog, 270, false);
            this.drawNaEighth(MV, prog, 0, true);
            this.drawNaEighth(MV, prog, 90, true);
            this.drawNaEighth(MV, prog, 180, true);
            this.drawNaEighth(MV, prog, 270, true);*/
        
        //if(bounds[0] == bounds[1] && bounds[1] == bounds[2] && bounds[0] == UnitCellPos.MIDDLE) {
       
            //corner Cl atoms
            this.drawClEighth(MV, prog, 0, false);
            this.drawClEighth(MV, prog, 90, false);
            this.drawClEighth(MV, prog, 180, false);
            this.drawClEighth(MV, prog, 270, false);
            this.drawClEighth(MV, prog, 0, true);
            this.drawClEighth(MV, prog, 90, true);
            this.drawClEighth(MV, prog, 180, true);
            this.drawClEighth(MV, prog, 270, true);
            
            //center Cl atom
            this.drawClAtom(MV, prog);
            
            //NaCl faces
            this.drawNaHalf(MV, prog, false, false, false, false, false);
            this.drawNaHalf(MV, prog, true, false, false, false, false);
            this.drawNaHalf(MV, prog, false, true, false, false, false);
            this.drawNaHalf(MV, prog, false, true, true, false, false);
            this.drawNaHalf(MV, prog, false, false, false, true, false);
            this.drawNaHalf(MV, prog, false, false, true, true, true);
            
            //NaCl quarters
            this.drawNaFourth(MV, prog, 0, false);
            this.drawNaFourth(MV, prog, 90, false);
            this.drawNaFourth(MV, prog, 180, false);
            this.drawNaFourth(MV, prog, 270, false);
            this.drawNaFourth(MV, prog, 0, true);
            this.drawNaFourth(MV, prog, 90, true);
            this.drawNaFourth(MV, prog, 180, true);
            this.drawNaFourth(MV, prog, 270, true);
            
        //}
        
        MV.popMatrix();
        
        //old cell splitting impl
        
        /*//even atoms go left
        if((bounds[0] + bounds[1] + bounds[2]) % 2 == 0) {
            MV.translate(vec3.fromValues(-1 * splitAmt, 0, 0));
        } else {
            MV.translate(vec3.fromValues(splitAmt, 0, 0));
        }
        MV.translate(pos);
        
        //even atoms are larger and green [Cl]
        if((bounds[0] + bounds[1] + bounds[2]) % 2 == 0) {
            MV.scale(1.3);
            gl.uniform3fv(prog.getHandle("kdFront"), colors["green"]);
        } else {
            MV.scale(.7);
            gl.uniform3fv(prog.getHandle("kdFront"), colors["purple"]);
        }
        
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        
        MV.popMatrix();*/
        
    };

    this.drawNaFourth = function(MV, prog, rot, flipX) {
        
        MV.pushMatrix();
        MV.rotate(rot, vec3.fromValues(0, 0, 1));
        if(flipX) {
            MV.rotate(180, vec3.fromValues(1, 0, 0));
        }
        MV.pushMatrix();
        
        MV.translate(vec3.fromValues(2, 0, 2));
        MV.rotate(-90, vec3.fromValues(0, 1, 0));
        MV.scale(.7);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["purple"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        eighth.draw(prog);
        MV.popMatrix();
        
        MV.pushMatrix();
        MV.translate(vec3.fromValues(2, 0, 2));
        MV.rotate(-90, vec3.fromValues(1, 0, 0));
        MV.rotate(-90, vec3.fromValues(0, 1, 0));
        MV.scale(.7);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["purple"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        eighth.draw(prog);
        MV.popMatrix();
        MV.popMatrix();
        
    }
    
    this.drawClEighth = function(MV, prog, rot, flipY) {
        
        MV.pushMatrix();
        
        if (flipY) {
            MV.rotate(180, vec3.fromValues(1, 0, 0));
        }
        MV.rotate(rot, vec3.fromValues(0, 1, 0));
        MV.translate(vec3.fromValues(2, -2, -2));
        MV.scale(1.3);
        
        gl.uniform3fv(prog.getHandle("kdFront"), colors["green"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        eighth.draw(prog);
        MV.popMatrix();
    }
    
    this.drawClAtom = function(MV, prog) {
        
        MV.pushMatrix();
        MV.scale(1.3);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["green"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        MV.popMatrix();
    }
    
    //pass param for which face to orient on
    //as well as another param that reflects it
    this.drawNaHalf = function(MV, prog, flipX, onY, flipY, onZ, flipZ) {
        
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
        MV.translate(vec3.fromValues(1.3, 0, 0));
        MV.rotate(180, vec3.fromValues(0, 1, 0));
        MV.scale(.7);
        
        gl.uniform3fv(prog.getHandle("kdFront"), colors["purple"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        half.draw(prog);
        MV.popMatrix();
    }
}