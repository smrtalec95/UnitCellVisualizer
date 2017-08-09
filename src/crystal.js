var CrystalType = {SIMPLE : 0, BODY : 1, FACE : 2 , NaCl : 3, CaF2: 4};

function Crystal(type, eighth, half, sphere, colors) {

    this.init = function() {
        this.initCellPositions();
        
        switch (type) {
            
            case CrystalType.SIMPLE :
                unit = new SimpleCubic(eighth, half, sphere, colors);
                this.createSimpleLayers();
            break;

            case CrystalType.BODY :
                unit = new BodyCentered(eighth, half, sphere, colors);
                this.createBodyLayers();
            break;

            case CrystalType.FACE :
                unit = new FaceCentered(eighth, half, sphere, colors);
                this.createFaceLayers();
            break;
            
            //new additions for NaCl Unit Cell
            case CrystalType.NaCl :
                unit = new SodiumChloride(eighth, half, sphere, colors);
                this.createNaClLayers();
            break;
            
            case CrystalType.CaF2:
                unit = new CalciumFluoride(eighth, half, sphere, colors);
                this.createCaF2Layers();
        }
    };
    
    this.getName = function() {

        switch (type) {
            
            case CrystalType.SIMPLE :
                return "Simple";
            break;
            
            case CrystalType.BODY :
                return "Body-Centered";
            break;
            
            case CrystalType.FACE :
                return "Face-Centered";
            break;
            
            case CrystalType.NaCl :
                return "Sodium Chloride";
            break;
            
            case CrystalType.CaF2:
                return "Calcium Fluoride";
            break;
        }
    };


    this.draw = function(MV, prog) {
        if (inspecting) {
            this.drawInspect(MV, prog);
        } else if(dispCoord) {
            this.drawCoordView(MV, prog);
        }
        else if (layersDraw) {
            this.drawLayers(MV, prog);
        } else {
            this.drawCells(MV, prog);
        }
    };
    
    this.expand = function() {
        if (inspecting) {
            if (inspctExp < 0.6) { inspctExp += .2; }
        } else {
            if (expansion < 4.0) { expansion += .2; }
        }
    };
    
    this.contract = function() {
        if (inspecting) {
            if (inspctExp > 0.2) { inspctExp -= .2; }
        } else {
            if (expansion > 1.0) { expansion -= .2; }
        }
    };
    
    this.toggleTranslucency = function() {
        translucent = !translucent;
    };
    
    this.setDrawLayers = function() {
        this.toggleLayers();
        layersDraw = true;
    };

    this.toggleLayers = function() {
         if (!inspecting) {
             layersDraw = !layersDraw;
             
             for (var i = 0; i < layers.length; i++) {
                 layers[i].reset();
             }
             
             expansion = 1.0;
             inspctExp = 1.0;
             translucent = false;
         }
    };

    this.toggleInspection = function() {
        inspctExp = 0.0;
        inspecting = !inspecting;
    };
    
    var Cell = function(bounds, pos, ndx) {
        
        this.distance = 0.0;
        this.bounds = bounds;
        this.pos = pos;
        this.ndx = ndx;
    };

    this.drawCells = function(MV, prog) {

        this.sortCells(MV.top());
        
        if (translucent) {
            alpha = .25;
        } else {
            alpha = 1.0;
        }

        gl.uniform1f(prog.getHandle("alpha"), alpha);
        
        MV.pushMatrix();
          
        // Rotation of face-centered cubic so that it matches layering scheme
        if (type == CrystalType.FACE) { MV.rotate(45, vec3.fromValues(0,0,1)); }
        
        MV.scale(scale);
        
        //this is one unit cell (ie what shows up when translucency is toggled)
        unit.draw(MV, prog, vec3.fromValues(0,0,0), alpha, true, vec3.fromValues(2,2,2), vec3.fromValues(2,2,2)); 
        
        //used for expanding/contracting
        for (var i = 0; i < cells.length; i++) {
            var v = vec3.fromValues(cells[i].pos[0], cells[i].pos[1], cells[i].pos[2]);
            // Vector for cell positioning
            var bounds = cells[i].bounds;

            //console.log(bounds);
            var ndx = cells[i].ndx;
            vec3.scale(v, v, expansion); // Adjust cell positioning by any expansion
          
            //this is the whole model as it appears on the screen
            unit.draw(MV, prog, v, alpha, false, bounds, ndx); // Draw cell
        }
        
        MV.popMatrix();
    };
    
    this.drawLayers = function(MV, prog) {

        MV.pushMatrix();
        MV.scale(scale);
        
        if (type == CrystalType.BODY) {
            MV.scale(0.87);
        } else if (type == CrystalType.FACE) {
            MV.scale(0.71);
        } else if (type == CrystalType.NaCl) {
            MV.scale(.51);
        } else if(type == CrystalType.CaF2) {
            MV.scale(.44);
        }

        for (var i = 0; i < layers.length; i++) {

            layers[i].draw(MV, prog);
            
            // If layer still has more to fall, drop layer further and exit loop
            if (!layers[i].isAtRest()) {
                layers[i].update();
                break;
            }
            
            //if current layer is at rest, flip the next layer
            //only for NaCl
            //may be a better way to do this logistically
            if(type == CrystalType.NaCl && layers[i].isAtRest() && i < layers.length - 1
                    && layers[i + 1].notCalledFlip() && i % 2 == 0) {
                layers[i + 1].flip();
            }

            // If last layer has fallen and settled, switch to other model for expand/contract effects
            if (layers[i] == layers[layers.length - 1] && layers[i].isAtRest()) {
                this.toggleLayers();
            }
        }
        
        MV.popMatrix();
    };

    this.drawInspect = function(MV, prog) {
        switch (type) {
            
            case CrystalType.SIMPLE:
                this.drawSimpleInspect(MV, prog);
            break;
            
            case CrystalType.BODY:
                this.drawBodyInspect(MV, prog);
            break;
            
            case CrystalType.FACE:
                this.drawFaceInspect(MV, prog);
            break;
            
            case CrystalType.NaCl:
                this.drawNaClInspect(MV, prog);
            break;
            
            case CrystalType.CaF2:
                this.drawCaF2Inspect(MV, prog);
            break;
        }
    };

    this.initCellPositions = function() {

        var midi = cols/2;
        var midj = rows/2;
        var midk = height/2;

        // Offset
        var o = vec3.fromValues(-(cols-1), -(height-1), -(rows-1));

        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                for (var k = 0; k < height; k++) {
                    if (i != midi || j != midj || k != midk) {
                        
                        var x = UnitCellPos.MIDDLE;
                        var y = UnitCellPos.MIDDLE;
                        var z = UnitCellPos.MIDDLE;

                        if (i == 0) { x = UnitCellPos.MIN; }
                        if (i == rows-1) { x = UnitCellPos.MAX; }
                        if (i == rows-2) { x = UnitCellPos.ONEB4MAX; }
                        if (i == 1) { x = UnitCellPos.ONEB4MIN; }
                        
                        if (j == 0) { y = UnitCellPos.MIN; }
                        if (j == cols-1) { y = UnitCellPos.MAX; }
                        if (j == cols-2) { y = UnitCellPos.ONEB4MAX; }
                        if (j == 1) { y = UnitCellPos.ONEB4MIN; }


                        if (k == 0) { z = UnitCellPos.MIN; }
                        if (k == height-1) { z = UnitCellPos.MAX; }
                        if (k == height-2) { z = UnitCellPos.ONEB4MAX; }
                        if (k == 1) { z = UnitCellPos.ONEB4MIN; }

                        var bounds = vec3.fromValues(y, z, x);
                        var pos = vec4.fromValues(o[0] + j*2, o[1] + k*2, o[2] + i*2 , 1);
                        var ndx = vec3.fromValues(i, j, k);

                        var c = new Cell(bounds, pos, ndx);

                        cells.push(c);
                    }
                }
            }
        }
    };
    
    this.calcCellDistance = function(m, v) {
        
        var v2 = vec3.create();
        
        v2[0] = m[0]*v[0] + m[4]*v[1] + m[8]*v[2] + m[12]*v[3];
        v2[1] = m[1]*v[0] + m[5]*v[1] + m[9]*v[2] + m[13]*v[3];
        v2[2] = m[2]*v[0] + m[6]*v[1] + m[10]*v[2] + m[14]*v[3];
 
        
        return v2[0]*v2[0] + v2[1]*v2[1] + v2[2]*v2[2];
    };
    
    this.sortCells = function(viewMatrix) {
        
        // Calculate distance of each cell to the camera
        for (var i = 0; i < cells.length; i++) {
            cells[i].distance = this.calcCellDistance(viewMatrix, cells[i].pos);
        }
        
        // Sort cells in descending order by their distance
        cells.sort(this.sortAlg);                //TODO
    };
    
    this.sortAlg = function(a, b) {
        return b.distance - a.distance; // Might have to switch !!!!!!!!!!!!
    }; 

    this.createSimpleLayers = function() {
        layers.push(new Layer(4,4, -3, 1.0, 1.0, colors["grey"], sphere));
        layers.push(new Layer(4,4, -1, 1.0, 1.0, colors["grey"], sphere));
        layers.push(new Layer(4,4, 1, 1.0, 1.0, colors["grey"], sphere));
        layers.push(new Layer(4,4, 3, 1.0, 1.0, colors["grey"], sphere));
    };

    this.createBodyLayers = function() {
        layers.push(new Layer(4,4, -3, 1.14942, 1.14942, colors["grey"], sphere));
        layers.push(new Layer(3,3, -2, 1.14942, 1.14942, colors["red"], sphere));
        layers.push(new Layer(4,4, -1, 1.14942, 1.14942, colors["grey"], sphere));
        layers.push(new Layer(3,3, 0, 1.14942, 1.14942, colors["red"], sphere));
        layers.push(new Layer(4,4, 1, 1.14942, 1.14942, colors["grey"], sphere));
        layers.push(new Layer(3,3, 2, 1.14942, 1.14942, colors["red"], sphere));
        layers.push(new Layer(4,4, 3, 1.14942, 1.14942, colors["grey"], sphere));
    };
    
    this.createFaceLayers = function() {
        var s = 2;

        layers.push(new Layer(4,1, -3.0*s, 1.0, 1.40845, colors["grey"], sphere));
        layers.push(new Layer(3,2, -2.5*s, 1.0, 1.40845, colors["orange"], sphere));
        layers.push(new Layer(4,3, -2.0*s, 1.0, 1.40845, colors["green"], sphere));
        
        layers.push(new Layer(3,4, -1.5*s, 1.0, 1.40845, colors["grey"], sphere));
        layers.push(new Layer(4,5, -1.0*s, 1.0, 1.40845, colors["orange"], sphere));
        layers.push(new Layer(3,6, -0.5*s, 1.0, 1.40845, colors["green"], sphere));
        
        layers.push(new Layer(4,7, 0, 1.0, 1.40845, colors["grey"], sphere));
        
        layers.push(new Layer(3,6, 0.5*s, 1.0, 1.40845, colors["orange"], sphere));
        layers.push(new Layer(4,5, 1.0*s, 1.0, 1.40845, colors["green"], sphere));
        layers.push(new Layer(3,4, 1.5*s, 1.0, 1.40845, colors["grey"], sphere));
        
        layers.push(new Layer(4,3, 2.0*s, 1.0, 1.40845, colors["orange"], sphere));
        layers.push(new Layer(3,2, 2.5*s, 1.0, 1.40845, colors["green"], sphere));
        layers.push(new Layer(4,1, 3.0*s, 1.0, 1.40845, colors["grey"], sphere));
    };
    
    this.createNaClLayers = function() {
        layers.push(new NaClLayer(5, 5, -4, 1.0, 1.0, colors["green"], 1.3, colors["purple"], .7, sphere));
        layers.push(new NaClLayer(5, 5, -2, 1.0, 1.0, colors["purple"], .7, colors["green"], 1.3, sphere));
        layers.push(new NaClLayer(5, 5, 0, 1.0, 1.0, colors["green"], 1.3, colors["purple"], .7, sphere));
        layers.push(new NaClLayer(5, 5, 2, 1.0, 1.0, colors["purple"], .7, colors["green"], 1.3, sphere));
        layers.push(new NaClLayer(5, 5, 4, 1.0, 1.0, colors["green"], 1.3, colors["purple"], .7, sphere));
    }
    
    this.createCaF2Layers = function() {
        layers.push(new CaF2Layer(3, 3, -2.5, 2.3, 2.3, sphere, "F", true, colors["orange"]));
        layers.push(new CaF2Layer(5, 5, -4.2, 1.15, 1.15, sphere, "Ca", false, colors["white"]));
        layers.push(new CaF2Layer(3, 3, -1.5, 2.3, 2.3, sphere, "F", true, colors["orange"]));
        layers.push(new CaF2Layer(5, 5, -2.2, 1.15, 1.15, sphere, "Ca", true, colors["white"]));
        layers.push(new CaF2Layer(3, 3, -.5, 2.3, 2.3, sphere, "F", true, colors["orange"]));
        layers.push(new CaF2Layer(5, 5, -.2, 1.15, 1.15, sphere, "Ca", false, colors["white"]));
        layers.push(new CaF2Layer(3, 3, .5, 2.3, 2.3, sphere, "F", true, colors["orange"]));
        layers.push(new CaF2Layer(5, 5, 2.2, 1.15, 1.15, sphere, "Ca", true, colors["white"]));
        layers.push(new CaF2Layer(3, 3, 1.5, 2.3, 2.3, sphere, "F", true, colors["orange"]));
        layers.push(new CaF2Layer(5, 5, 4.2, 1.15, 1.15, sphere, "Ca", false, colors["white"]));
        layers.push(new CaF2Layer(3, 3, 2.5, 2.3, 2.3, sphere, "F", true, colors["orange"]));
        
        //layers.push(new Layer(4,4, 1, 1.0, 1.0, colors["grey"], sphere));
        //layers.push(new Layer(4,4, 3, 1.0, 1.0, colors["grey"], sphere));
    }
    
    this.drawSimpleInspect = function(MV, prog) {
        gl.uniform1f(prog.getHandle("alpha"), 1.0);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["blue"]);
        
        MV.pushMatrix();
        this.drawEighth(MV, prog, 0, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        this.drawEighth(MV, prog, 90, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        this.drawEighth(MV, prog, 180, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        this.drawEighth(MV, prog, 270, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        
        MV.pushMatrix();
        MV.rotate(90.0, vec3.fromValues(1.0, 0.0, 0.0));
        this.drawEighth(MV, prog, 0, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        this.drawEighth(MV, prog, 90, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        
        MV.rotate(180.0, vec3.fromValues(1.0, 0.0, 0.0));
        
        this.drawEighth(MV, prog, 180, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        this.drawEighth(MV, prog, 270, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        
        MV.popMatrix();
        
        MV.popMatrix();
    };
    
    this.drawBodyInspect = function(MV, prog) {
        gl.uniform1f(prog.getHandle("alpha"), 1.0);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
        
        MV.pushMatrix();
        MV.translate(vec3.fromValues(-inspctExp/20 - 0.15, 0, 0));
        this.drawEighth(MV, prog, 0, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        this.drawEighth(MV, prog, 90, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        this.drawEighth(MV, prog, 180, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        this.drawEighth(MV, prog, 270, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        
        MV.pushMatrix();
        MV.rotate(90.0, vec3.fromValues(1.0, 0.0, 0.0));
        this.drawEighth(MV, prog, 0, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        this.drawEighth(MV, prog, 90, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        
        MV.rotate(180.0, vec3.fromValues(1.0, 0.0, 0.0));
        
        this.drawEighth(MV, prog, 180, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        this.drawEighth(MV, prog, 270, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        
        MV.popMatrix();    
        MV.popMatrix();

        gl.uniform3fv(prog.getHandle("kdFront"), colors["red"]);
        
        MV.pushMatrix();
        MV.translate(vec3.fromValues(.15,0,0));
        MV.scale(scale);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        MV.popMatrix();
    };
    
    this.drawFaceInspect = function(MV, prog) {
        gl.uniform1f(prog.getHandle("alpha"), 1.0);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
        MV.pushMatrix();
        MV.translate(vec3.fromValues(-0.45*1.1, 0, 0));
        this.drawEighth(MV, prog, 0, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        this.drawEighth(MV, prog, 90, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        this.drawEighth(MV, prog, 180, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        this.drawEighth(MV, prog, 270, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        
        MV.pushMatrix();
        MV.rotate(90.0, vec3.fromValues(1.0, 0.0, 0.0));
        this.drawEighth(MV, prog, 0, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        this.drawEighth(MV, prog, 90, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        
        MV.rotate(180.0, vec3.fromValues(1.0, 0.0, 0.0));
        
        this.drawEighth(MV, prog, 180, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        this.drawEighth(MV, prog, 270, vec3.fromValues(-inspctExp, inspctExp, inspctExp)); 
        
        MV.popMatrix();    
        MV.popMatrix();
        
        gl.uniform3fv(prog.getHandle("kdFront"), colors["green"]);
        MV.pushMatrix();
        MV.translate(vec3.fromValues(-0.15*1.1, 0, 0));
        this.drawHalf(MV, prog, 0, vec3.fromValues(inspctExp + .99, 0, 0));
        this.drawHalf(MV, prog, 180, vec3.fromValues(inspctExp + .99, 0, 0));
        MV.popMatrix();
        
        
        gl.uniform3fv(prog.getHandle("kdFront"), colors["orange"]);
        MV.pushMatrix();
        MV.translate(vec3.fromValues(0.15*1.1, 0, 0));
        this.drawHalf(MV, prog, 0, vec3.fromValues(inspctExp + .99, 0, 0));
        this.drawHalf(MV, prog, 180, vec3.fromValues(inspctExp + .99, 0, 0));
        MV.popMatrix();
        
        gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
        MV.pushMatrix();
        MV.translate(vec3.fromValues(0.45*1.1, 0, 0));
        this.drawHalf(MV, prog, 0, vec3.fromValues(inspctExp + .99, 0, 0));
        this.drawHalf(MV, prog, 180, vec3.fromValues(inspctExp + .99, 0, 0));
        MV.popMatrix();
    };
    
    this.drawNaClInspect = function(MV, prog) {
        
        gl.uniform1f(prog.getHandle("alpha"), 1.0);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["green"]);
        
        MV.pushMatrix();
        MV.scale(0.51);
        MV.pushMatrix();
        
        MV.scale(scale);
        MV.translate(vec3.fromValues(-1, 0, 0));
        MV.scale(1.3);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        MV.popMatrix();

        gl.uniform3fv(prog.getHandle("kdFront"), colors["purple"]);
        
        MV.pushMatrix();
        MV.scale(scale);
        MV.translate(vec3.fromValues(1,0,0));
        MV.scale(0.7);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        MV.popMatrix();
        MV.popMatrix();
    };
    
    this.drawCaF2Inspect = function(MV, prog) {
        MV.pushMatrix();
        MV.scale(.47);
        MV.scale(scale);
        
        gl.uniform3fv(prog.getHandle("kdFront"), colors["white"]);
        MV.pushMatrix();
        MV.translate(vec3.fromValues(-2, 0, 0));
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        MV.popMatrix();
        
        gl.uniform3fv(prog.getHandle("kdFront"), colors["orange"]);
        MV.pushMatrix();
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        MV.translate(vec3.fromValues(2, 0, 0));
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        MV.popMatrix();
        
        MV.popMatrix();
    }
    
    this.drawEighth = function(MV, prog, rot, translate) {  
        MV.pushMatrix();
        MV.rotate(rot, vec3.fromValues(0.0, 1.0, 0.0));
        MV.scale(scale);
        MV.translate(translate);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        eighth.draw(prog);
        
        MV.popMatrix();
    };
    
    this.drawHalf = function(MV, prog, rot, translate) {
        MV.pushMatrix();
        MV.scale(scale);
        MV.rotate(rot, vec3.fromValues(0, 1, 0));
        MV.translate(translate);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        half.draw(prog);
        
        MV.popMatrix();
    };
    
    this.isBasic = function(type) {
        return type == CrystalType.SIMPLE ||
               type == CrystalType.BODY ||
               type == CrystalType.FACE;
    }
    
    this.toggleCoordView = function() {
        if(this.isBasic(type)) {
            dispCoord = !dispCoord;
        }
    }
    
    this.drawCoordView = function(MV, prog) {
        switch(type) {
            case CrystalType.SIMPLE :
                this.drawSimpleCoordView(MV, prog);
            break;
            
            case CrystalType.BODY :
                this.drawBodyCoordView(MV, prog);
            break;
            
            case CrystalType.FACE :
                this.drawFaceCoordView(MV, prog);
            break;
        }
    }
    
    this.drawSimpleCoordView = function(MV, prog) {
        MV.pushMatrix();
        MV.scale(scale);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["red"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
        
        for(var i = 0; i < 3; i++) {
            for(var j = -2; j < 5; j += 4) {
                MV.pushMatrix();
                if(i == 0) {
                    MV.translate(vec3.fromValues(j, 0, 0));
                }
                else if (i == 1) {
                    MV.translate(vec3.fromValues(0, j, 0));
                }
                else {
                    MV.translate(vec3.fromValues(0, 0, j));
                }
                gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
                sphere.draw(prog);
                MV.popMatrix();
            }
        }
        
        MV.popMatrix();
    }
    
    this.drawBodyCoordView = function(MV, prog) {
        MV.pushMatrix();
        MV.scale(scale);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["red"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
        
        for(var i = -1.13; i < 2; i += 2.26) {
            for(var j = -1.13; j < 2; j += 2.26) {
                for(var k = -1.13; k < 2; k += 2.26) {
                    MV.pushMatrix();
                    MV.translate(vec3.fromValues(i, j, k));
                    gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
                    sphere.draw(prog);
                    MV.popMatrix();
                }
            }
        }
        
        MV.popMatrix();
    }
    
    this.drawFaceCoordView = function(MV, prog) {
        MV.pushMatrix();
        MV.scale(scale);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["red"]);
        gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
        sphere.draw(prog);
        gl.uniform3fv(prog.getHandle("kdFront"), colors["grey"]);
        
        for(var i = -1.35; i < 2; i += 2.7) {
            for(var j = -1.35; j < 2; j += 2.7) {
                MV.pushMatrix();
                MV.translate(vec3.fromValues(0, i, j));
                gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
                sphere.draw(prog);
                MV.popMatrix();
            }
        }
        
        for(var i = -1.4; i < 2; i+= 2.8) {
            MV.pushMatrix();
            MV.translate(vec3.fromValues(i, 0, 0));
            
            for(var j = -1.4; j < 2; j += 2.8) {
                MV.pushMatrix();
                MV.translate(vec3.fromValues(0, 0, j));
                gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
                sphere.draw(prog);
                MV.popMatrix();
            }
            
            for(var k = -1.4; k < 2; k += 2.8) {
                MV.pushMatrix();
                MV.translate(vec3.fromValues(0, k, 0));
                gl.uniformMatrix4fv(prog.getHandle("MV"), false, MV.top());
                sphere.draw(prog);
                MV.popMatrix();
            }
            
            MV.popMatrix();
        }
        
        MV.popMatrix();
    }
    
    var type = type;
    var rows = 5;
    var cols = 5;
    var height = 5;
    var scale = .1;
    var expansion = 1.0;
    var inspctExp = 0;
    var translucent = false;
    var layersDraw = true;
    var inspecting = false;
    var dispCoord = false;

    var unit;
    var eighth = eighth;
    var half = half;
    var sphere = sphere;
    var colors = colors;
    var cells = new Array();
    var layers = new Array();
}
