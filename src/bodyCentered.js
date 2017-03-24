function BodyCentered(eighth, half, sphere, colors) {

    this.draw = function(MV, prog, pos, alpha, center, bounds, ndx) {
        if (center && alpha < 1.0) { 
            gl.uniform1f(prog.getHandle("alpha"), 1.0);
        } 

        if (center || alpha == 1.0) {
            gl.uniform3fv(prog.getHandle("kdFront"), colors["red"]);
        } else {
            gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
        }
        
        MV.pushMatrix();
        MV.translate(pos);

        if (bounds[0] != UnitCellPos.MIN && bounds[0] != UnitCellPos.MAX &&
            bounds[1] != UnitCellPos.MIN && bounds[1] != UnitCellPos.MAX &&
            bounds[2] != UnitCellPos.MIN && bounds[2] != UnitCellPos.MAX) {
           
            // Draw center atom
            MV.pushMatrix();
            MV.scale(this.scale);
            gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
            sphere.draw(prog);
            MV.popMatrix();
        }
        
        gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);

        if (bounds[1] != UnitCellPos.MIN) {
            
            if (bounds[2] != UnitCellPos.MIN) {
                
                if (bounds[0] != UnitCellPos.MAX) { this.drawEighth(MV, prog, 0); }
                if (bounds[0] != UnitCellPos.MIN) { this.drawEighth(MV, prog, 90); }
            }
            
            if (bounds[2] != UnitCellPos.MAX) {
                if (bounds[0] != UnitCellPos.MIN) { this.drawEighth(MV, prog, 180); }
                if (bounds[0] != UnitCellPos.MAX) { this.drawEighth(MV, prog, 270); }
            }
        }
        
        if (bounds[1] != UnitCellPos.MAX) {
            MV.pushMatrix();
            MV.rotate(90.0, vec3.fromValues(1.0, 0.0, 0.0));
            if (bounds[2] != UnitCellPos.MIN) {
                if (bounds[0] != UnitCellPos.MAX) { this.drawEighth(MV, prog, 0); }
                if (bounds[0] != UnitCellPos.MIN) { this.drawEighth(MV, prog, 90); }
            }
            
            MV.rotate(180.0, vec3.fromValues(1.0, 0.0, 0.0));
            if (bounds[2] != UnitCellPos.MAX) {
                if (bounds[0] != UnitCellPos.MIN) { this.drawEighth(MV, prog, 180); }
                if (bounds[0] != UnitCellPos.MAX) { this.drawEighth(MV, prog, 270); }
            }
            
            MV.popMatrix();
        }
        
        MV.popMatrix();

        gl.uniform1f(prog.getHandle("alpha"), alpha); // Make sure alpha is same as it was 
    };

    this.drawEighth = function(MV, prog, rot) {
        MV.pushMatrix();
        
        MV.rotate(rot, vec3.fromValues(0.0, 1.0, 0.0));
        MV.translate(vec3.fromValues(1.0, -1.0, -1.0));
        MV.scale(this.scale);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        eighth.draw(prog);
        
        MV.popMatrix();
    };

    this.scale = 0.87
}
