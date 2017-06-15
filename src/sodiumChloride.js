function SodiumChloride(eighth, half, sphere, colors) {
    
    this.prototype = new UnitCell(eighth, half, sphere, colors);
    
    this.draw = function(MV, prog, pos, alpha, center, bounds, ndx, splitAmt) {
        
        MV.pushMatrix();
        MV.translate(pos);
        
        //cell generation code makes a 2 by 2 by 2 cell
        //need a 1 by 1 by 1 cell
        MV.scale(.51);
        
        //draw:---
        this.drawNaAtom(MV, prog);
        
        if(bounds[0] != UnitCellPos.MIN) {
            //draw: L--
            this.drawClHalf(MV, prog, true, false, false, false, false);
            
            if(bounds[1] != UnitCellPos.MIN) {
                //draw: LB-, -B-
                this.drawNaFourth(MV, prog, 270, false, 270);
                this.drawClHalf(MV, prog, false, true, true, false, false);
                
                if(bounds[2] != UnitCellPos.MIN) {
                    //draw: LBF, L-F, -BF, --F
                    this.drawNaFourth(MV, prog, 180, true, 0);
                    this.drawNaFourth(MV, prog, 270, true, 0);
                    this.drawClHalf(MV, prog, false, false, true, true, true);
                    this.drawClEighth(MV, prog, 90, false);
                }
                if(bounds[2] != UnitCellPos.MAX) {
                    //draw: LBK, L-K, -BK, --K
                    this.drawNaFourth(MV, prog, 180, false, 0);
                    this.drawNaFourth(MV, prog, 270, false, 0);
                    this.drawClHalf(MV, prog, false, false, false, true, false);
                    this.drawClEighth(MV, prog, 180, false);
                }
            }
            if(bounds[1] != UnitCellPos.MAX) {
                //draw: LT-, -T-
                this.drawNaFourth(MV, prog, 90, false, 270);
                this.drawClHalf(MV, prog, false, true, false, false, false);
                
                if(bounds[2] != UnitCellPos.MIN) {
                    //draw: L-F, LTF, --F, -TF
                    this.drawClHalf(MV, prog, false, false, true, true, true);
                    this.drawNaFourth(MV, prog, 90, true, 0);
                    this.drawNaFourth(MV, prog, 180, true, 0);
                    this.drawClEighth(MV, prog, 180, true);
                    
                }
                if(bounds[2] != UnitCellPos.MAX) {
                    //draw: L-K, LTK, --K, -TK
                    this.drawClHalf(MV, prog, false, false, false, true, false);
                    this.drawNaFourth(MV, prog, 90, false, 0);
                    this.drawNaFourth(MV, prog, 180, false, 0);
                    this.drawClEighth(MV, prog, 90, true);
                    
                }
            }
        }
        
        if(bounds[0] != UnitCellPos.MAX) {
            //draw: R--
            this.drawClHalf(MV, prog, false, false, false, false, false);
            
            if(bounds[1] != UnitCellPos.MIN) {
                //draw: -B-, RB-
                this.drawClHalf(MV, prog, false, true, true, false, false);
                this.drawNaFourth(MV, prog, 270, false, 90);
                
                if(bounds[2] != UnitCellPos.MIN) {
                    //draw: -BF, --F, RBF, R-F
                    this.drawClHalf(MV, prog, false, false, true, true, true);
                    this.drawNaFourth(MV, prog, 270, true, 0);
                    this.drawNaFourth(MV, prog, 0, true, 0);
                    this.drawClEighth(MV, prog, 0, false);
                    
                }
                if(bounds[2] != UnitCellPos.MAX) {
                    //draw: -BK, --K, RBK, R-K
                    this.drawClHalf(MV, prog, false, false, false, true, false);
                    this.drawNaFourth(MV, prog, 270, false, 0);
                    this.drawNaFourth(MV, prog, 0, false, 0);
                    this.drawClEighth(MV, prog, 270, false);
                    
                }
            }
            if(bounds[1] != UnitCellPos.MAX) {
                //draw: -T-, RT-
                this.drawClHalf(MV, prog, false, true, false, false, false);
                this.drawNaFourth(MV, prog, 90, false, 90);
                
                if(bounds[2] != UnitCellPos.MIN) {
                    //draw: --F, -TF, R-F, RTF
                    this.drawClHalf(MV, prog, false, false, true, true, true);
                    this.drawNaFourth(MV, prog, 90, true, 0);
                    this.drawNaFourth(MV, prog, 0, true, 0);
                    this.drawClEighth(MV, prog, 270, true);
                    
                }
                if(bounds[2] != UnitCellPos.MAX) {
                    //draw: --K, -TK, R-K, RTK
                    this.drawClHalf(MV, prog, false, false, false, true, false);
                    this.drawNaFourth(MV, prog, 90, false, 0);
                    this.drawNaFourth(MV, prog, 0, false, 0);
                    this.drawClEighth(MV, prog, 0, true);
                }
            }
        }
        
        MV.popMatrix();
    };

    this.drawNaFourth = function(MV, prog, rot, flipX, rotY) {
        
        MV.pushMatrix();
        MV.rotate(rotY, vec3.fromValues(0, 1, 0));
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
    
    this.drawNaAtom = function(MV, prog) {
        
        MV.pushMatrix();
        MV.scale(.7);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["purple"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        MV.popMatrix();
    }
    
    //pass param for which face to orient on
    //as well as another param that reflects it
    this.drawClHalf = function(MV, prog, flipX, onY, flipY, onZ, flipZ) {
        
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
        MV.translate(vec3.fromValues(.7, 0, 0));
        MV.rotate(180, vec3.fromValues(0, 1, 0));
        MV.scale(1.3);
        
        gl.uniform3fv(prog.getHandle("kdFront"), colors["green"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        half.draw(prog);
        MV.popMatrix();
    }
    
    //generates just one cell
    //not called, just here in case I need it
    this.drawCell = function(MV, prog) {
        //corner Cl atoms
        this.drawClEighth(MV, prog, 0, false);
        this.drawClEighth(MV, prog, 90, false);
        this.drawClEighth(MV, prog, 180, false);
        this.drawClEighth(MV, prog, 270, false);
        this.drawClEighth(MV, prog, 0, true);
        this.drawClEighth(MV, prog, 90, true);
        this.drawClEighth(MV, prog, 180, true);
        this.drawClEighth(MV, prog, 270, true);

        //Cl faces
        this.drawClHalf(MV, prog, false, false, false, false, false);
        this.drawClHalf(MV, prog, true, false, false, false, false);
        this.drawClHalf(MV, prog, false, true, false, false, false);
        this.drawClHalf(MV, prog, false, false, false, true, false);
        this.drawClHalf(MV, prog, false, false, true, true, true);
        this.drawClHalf(MV, prog, false, true, true, false, false);

        //Na quarters
        this.drawNaFourth(MV, prog, 0, false, 0);
        this.drawNaFourth(MV, prog, 90, false, 0);
        this.drawNaFourth(MV, prog, 90, false, 90);
        this.drawNaFourth(MV, prog, 90, false, 270);
        this.drawNaFourth(MV, prog, 180, false, 0);
        this.drawNaFourth(MV, prog, 270, false, 0);
        this.drawNaFourth(MV, prog, 270, false, 90);
        this.drawNaFourth(MV, prog, 270, false, 270);
        this.drawNaFourth(MV, prog, 0, true, 0);
        this.drawNaFourth(MV, prog, 90, true, 0);
        this.drawNaFourth(MV, prog, 180, true, 0);
        this.drawNaFourth(MV, prog, 270, true, 0);


        //center Na atom
        this.drawNaAtom(MV, prog);
    }
}