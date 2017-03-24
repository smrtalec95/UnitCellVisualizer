function FaceCentered(eighth, half, sphere, colors) {
    
    this.draw = function(MV, prog, pos, alpha, center, bounds, ndx) {
        

        /*gl.uniform3fv(prog.getHandle("kdFront"), colors["red"]);            // 9
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        half.draw(prog);*/

        if (center && alpha < 1.0) { 
            gl.uniform1f(prog.getHandle("alpha"), 1.0);
        } 

        MV.pushMatrix();
        MV.translate(pos);
        
        var x = ndx[0];
        var y = ndx[1];
        var z = ndx[2];

        gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 12));           // 12
        
        if (bounds[0] >= UnitCellPos.ONEB4MIN && bounds[0] <= UnitCellPos.MAX && // left right
            bounds[1] >= UnitCellPos.ONEB4MIN && bounds[1] < UnitCellPos.MAX && // height
            bounds[2] >= UnitCellPos.ONEB4MIN && bounds[2] < UnitCellPos.MAX) {  // depth
            this.drawHalf(MV, prog, 0, vec3.fromValues(0, 1.0, 0)); 
        }

        
        gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 9));            // 9
        if (bounds[0] >= UnitCellPos.ONEB4MIN && bounds[0] < UnitCellPos.MAX && // left right
            bounds[1] >= UnitCellPos.ONEB4MIN && bounds[1] < UnitCellPos.MAX && // height
            bounds[2] >= UnitCellPos.MIN && bounds[2] < UnitCellPos.MAX) { // depth
            this.drawHalf(MV, prog, 90, vec3.fromValues(0, 1.0, 0));
        }

        gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 14));           // 14
        if (bounds[0] >= UnitCellPos.MIN && bounds[0] < UnitCellPos.MAX && // left right
            bounds[1] >= UnitCellPos.ONEB4MIN && bounds[1] < UnitCellPos.MAX && // height
            bounds[2] >= UnitCellPos.ONEB4MIN && bounds[2] < UnitCellPos.MAX) { // depth
            this.drawHalf(MV, prog, 180, vec3.fromValues(0, 1.0, 0));
        }

        gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 10));          // 10
        if (bounds[0] >= UnitCellPos.ONEB4MIN && bounds[0] < UnitCellPos.MAX && // left right
            bounds[1] >= UnitCellPos.ONEB4MIN && bounds[1] < UnitCellPos.MAX && // height
            bounds[2] >= UnitCellPos.ONEB4MIN && bounds[2] <= UnitCellPos.MAX) {
            this.drawHalf(MV, prog, 270, vec3.fromValues(0, 1.0, 0));
        }

        gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 11));          // 11
        if (bounds[0] >= UnitCellPos.ONEB4MIN && bounds[0] < UnitCellPos.MAX && // left right
            bounds[1] >= UnitCellPos.MIN && bounds[1] < UnitCellPos.MAX && // height
            bounds[2] >= UnitCellPos.ONEB4MIN && bounds[2] < UnitCellPos.MAX) { 
            this.drawHalf(MV, prog, -90, vec3.fromValues(0, 0, 1.0));
        }

        gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 13));          // 13
        if (bounds[0] >= UnitCellPos.ONEB4MIN && bounds[0] < UnitCellPos.MAX && // left right
            bounds[1] >= UnitCellPos.ONEB4MIN && bounds[1] <= UnitCellPos.MAX && // height
            bounds[2] >= UnitCellPos.ONEB4MIN && bounds[2] < UnitCellPos.MAX) { 
            this.drawHalf(MV, prog, 90, vec3.fromValues(0, 0, 1.0));
        }
        
        if (bounds[1] != UnitCellPos.MIN) {
            
            if (bounds[2] != UnitCellPos.MIN) {
                gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 8));  // 8
                if (bounds[0] != UnitCellPos.MAX) { this.drawEighth(MV, prog, 0); }
                gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 7));  // 7
                if (bounds[0] != UnitCellPos.MIN) { this.drawEighth(MV, prog, 90); }
            }
            
            if (bounds[2] != UnitCellPos.MAX) {
                gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 3)); // 3
                if (bounds[0] != UnitCellPos.MIN) { this.drawEighth(MV, prog, 180); }
                gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 4)); // 4
                if (bounds[0] != UnitCellPos.MAX) { this.drawEighth(MV, prog, 270); }                
            }
        }
        
        if (bounds[1] != UnitCellPos.MAX) {
            MV.pushMatrix();
            MV.rotate(90.0, vec3.fromValues(1.0, 0.0, 0.0));
            if (bounds[2] != UnitCellPos.MIN) {
                gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 5)); // 5
                if (bounds[0] != UnitCellPos.MAX) { this.drawEighth(MV, prog, 0); }
                gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 6)); // 6
                if (bounds[0] != UnitCellPos.MIN) { this.drawEighth(MV, prog, 90); }
            }
            
            MV.rotate(180.0, vec3.fromValues(1.0, 0.0, 0.0));
            if (bounds[2] != UnitCellPos.MAX) {
                gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 2)); // 2
                if (bounds[0] != UnitCellPos.MIN) { this.drawEighth(MV, prog, 180); } 
                gl.uniform3fv(prog.getHandle("kdFront"), this.whichColor(center,alpha,x,y,z, 1)); // 1
                if (bounds[0] != UnitCellPos.MAX) { this.drawEighth(MV, prog, 270); }
            }
            MV.popMatrix();
        }

        MV.popMatrix();

        gl.uniform1f(prog.getHandle("alpha"), alpha); // Make sure alpha is same as it was 
    }

    this.whichColor = function(center, alpha, x, y, z, id) {

        if (!center && alpha < 1.0) { return colors["grey"]; }
         
        var key = (z + y) % 3; 

        // g, gr, o: 1, 5, 12, 13
        // o, g, gr: 2, 4, 6, 8, 9, 10, 11
        // gr, o, g: 3, 7, 11, 14 

        switch (id) {
            
        case 1 : 
            switch (key) {
            case 0 : return colors["grey"];
            case 1 : return colors["green"];
            case 2 : return colors["orange"]; 
            }
        case 2 :
            switch (key) {
            case 0 : return colors["orange"];
            case 1 : return colors["grey"];
            case 2 : return colors["green"]; 
            }
        case 3 :
            switch (key) {
            case 0 : return colors["green"];
            case 1 : return colors["orange"];
            case 2 : return colors["grey"]; 
            }
        case 4 :
            switch (key) {
            case 0 : return colors["orange"];
            case 1 : return colors["grey"];
            case 2 : return colors["green"]; 
            }
        case 5 :
            switch (key) {
            case 0 : return colors["grey"];
            case 1 : return colors["green"];
            case 2 : return colors["orange"]; 
            }
        case 6 :
            switch (key) {
            case 0 : return colors["orange"];
            case 1 : return colors["grey"];
            case 2 : return colors["green"]; 
            }
        case 7 :
            switch (key) {
            case 0 : return colors["green"];
            case 1 : return colors["orange"];
            case 2 : return colors["grey"]; 
            }
        case 8 :
            switch (key) {
            case 0 : return colors["orange"];
            case 1 : return colors["grey"];
            case 2 : return colors["green"]; 
            }
        case 9 :
            switch (key) {
            case 0 : return colors["orange"];
            case 1 : return colors["grey"];
            case 2 : return colors["green"]; 
            }
        case 10 :
            switch (key) {
            case 0 : return colors["orange"];
            case 1 : return colors["grey"];
            case 2 : return colors["green"]; 
            }
        case 11 :
            switch (key) {
            case 0 : return colors["green"];
            case 1 : return colors["orange"];
            case 2 : return colors["grey"]; 
            }
        case 12 :
            switch (key) {
            case 0 : return colors["grey"];
            case 1 : return colors["green"];
            case 2 : return colors["orange"]; 
            }
        case 13 :
            switch (key) {
            case 0 : return colors["grey"];
            case 1 : return colors["green"];
            case 2 : return colors["orange"]; 
            }
        case 14 :
            switch (key) {
            case 0 : return colors["green"];
            case 1 : return colors["orange"];
            case 2 : return colors["grey"]; 
            }
        }
        

        return colors["black"];
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

    this.drawHalf = function(MV, prog, rot, axis) {

        MV.pushMatrix();
        MV.rotate(rot, axis);
        MV.translate(vec3.fromValues(-1.0 * (1 - this.scale),0,0));
        MV.scale(this.scale);
        MV.translate(vec3.fromValues(-.01, 0, 0));
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        half.draw(prog);
        MV.popMatrix();
    }; 

    this.scale = 0.71;
}
