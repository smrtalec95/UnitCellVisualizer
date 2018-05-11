var Scene = {

    load : function(resourceDir) {

        // Setup meshes
        this.eighth.loadMesh(resourceDir + "eighth.obj");

        this.half.loadMesh(resourceDir + "half.obj");

        this.sphere.loadMesh(resourceDir + "sphere.obj");

        // Setup colors
        this.setupColors();

        var crystal;

        crystal = new Crystal(CrystalType.SIMPLE, this.eighth, this.half, this.sphere, this.colors);
        crystal.init();
        this.crystals.push(crystal);

        crystal = new Crystal(CrystalType.BODY, this.eighth, this.half, this.sphere, this.colors);
        crystal.init();
        this.crystals.push(crystal);

        crystal = new Crystal(CrystalType.FACE, this.eighth, this.half, this.sphere, this.colors);
        crystal.init();
        this.crystals.push(crystal);
        
        crystal = new Crystal(CrystalType.NaCl, this.eighth, this.half, this.sphere, this.colors);
        crystal.init();
        this.crystals.push(crystal);
        
        crystal = new Crystal(CrystalType.CaF2, this.eighth, this.half, this.sphere, this.colors);
        crystal.init();
        this.crystals.push(crystal);
        
        crystal = new Crystal(CrystalType.LEGEND, this.eighth, this.half, this.sphere, this.colors);
        crystal.init();
        this.crystals.push(crystal);
    },

    setupColors : function() {
        this.colors["grey"] = vec3.fromValues(0.5, 0.5, 0.5);
        this.colors["red"] = vec3.fromValues(1.0, 0, 0);
        this.colors["green"] = vec3.fromValues(0, 1.0, 0);
        this.colors["forestGreen"] = vec3.fromValues(.1333, .543, .1333);
        this.colors["blue"] = vec3.fromValues(0, 0.7, 1.0);
        this.colors["orange"] = vec3.fromValues(1.0, 0.6, 0.2);
        this.colors["black"] = vec3.fromValues(0, 0, 0);
        this.colors["purple"] = vec3.fromValues(.578125, 0, .82421875);
        this.colors["white"] = vec3.fromValues(1, 1, 1);
    },

    nextCrystal : function() {
        this.whichCrystal = (this.whichCrystal + 1) % this.crystals.length;
        this.crystals[this.whichCrystal].setDrawLayers();
    },
    
    prevCrystal: function() {
        this.whichCrystal = (this.whichCrystal == 0 ? this.crystals.length - 1 : this.whichCrystal - 1);
        this.crystals[this.whichCrystal].setDrawLayers();
    },

    getCrystal : function() {
        return this.crystals[this.whichCrystal];
    },

    getCrystalName : function() {
        return this.getCrystal().getName();
    },

    draw : function(MV, prog) {
        return this.crystals[this.whichCrystal].draw(MV, prog);
    },

    expand : function() {
        for (var i = 0; i < this.crystals.length; i++) {
            this.crystals[i].expand();
        }
    },

    contract : function() {
        for (var i = 0; i < this.crystals.length; i++) {
            this.crystals[i].contract();
        }
    },

    toggleTranslucency : function() {
        for (var i = 0; i < this.crystals.length; i++) {
            this.crystals[i].activateTranslucency();
        }
    },

    toggleLayers : function() {
        for (var i = 0; i < this.crystals.length; i++) {
            this.crystals[i].toggleLayers();
        }
    },

    toggleInspection : function() {
        for (var i = 0; i < this.crystals.length; i++) {
            this.crystals[i].activateInspection();
        }
    },
    
    toggleCoord : function(crystalSelector, dispSelector) {
        var out = false;
        // check NaCl and CaF2 - they don't currently have a coordination view
        if(crystalSelector.val() == "3") {
            alert('Sodium Chloride does not currently have a coordination view.');
            Scene.goToLattice();
            dispSelector.val("0");
            
        }
        else if(crystalSelector.val() == "4") {
            alert('Calcium Fluoride does not currently have a coordination view');
            Scene.goToLattice();
            dispSelector.val("0");
        }
        else {
            for(var i = 0; i < this.crystals.length; i++) {
                this.crystals[i].activateCoordView();
            }
            out = true;
        }
        Scene.isCoord = !Scene.isCoord;
        return out;
    },
    
    toggleColor : function() {
        for(var i = 0; i < this.crystals.length; i++) {
            this.crystals[i].toggleColor();
        }
    },
    
    goToLattice : function() {
        for(var i = 0; i < this.crystals.length; i++) {
            this.crystals[i].goToLattice();
        }
    },

    isLoaded : function() {
        return this.eighth.isLoaded() && this.half.isLoaded() && this.sphere.isLoaded();
    },
    
    goToCrystal : function(crystalType) {
        this.whichCrystal = crystalType;
        //this.crystals[this.whichCrystal].setDrawLayers();
    },

    whichCrystal : 0,
    eighth : new Shape(),
    half : new Shape(),
    sphere : new Shape(),
    crystals : new Array(),
    colors : {},
    isCoord : false
};
//changes