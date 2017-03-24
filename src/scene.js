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
    },

    setupColors : function() {
        this.colors["grey"] = vec3.fromValues(0.5, 0.5, 0.5);
        this.colors["red"] = vec3.fromValues(1.0, 0, 0);
        this.colors["green"] = vec3.fromValues(0, 1.0, 0);
        this.colors["blue"] = vec3.fromValues(0, 0.7, 1.0);
        this.colors["orange"] = vec3.fromValues(1.0, 0.6, 0.2);
        this.colors["black"] = vec3.fromValues(0, 0, 0);
    },

    nextCrystal : function() {
        this.whichCrystal = (this.whichCrystal + 1) % this.crystals.length;
        this.crystals[this.whichCrystal].setDrawLayers();
    },

    getCrystal : function() {
        return this.crystals[this.whichCrystal];
    },

    getCrystalName : function() {
        return this.getCrystal().getName();
    },

    draw : function(MV, prog) {
        this.crystals[this.whichCrystal].draw(MV, prog);
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
            this.crystals[i].toggleTranslucency();
        }
    },

    toggleLayers : function() {
        for (var i = 0; i < this.crystals.length; i++) {
            this.crystals[i].toggleLayers();
        }
    },

    toggleInspection : function() {
        for (var i = 0; i < this.crystals.length; i++) {
            this.crystals[i].toggleInspection();
        }
    },

    isLoaded : function() {
        return this.eighth.isLoaded() && this.half.isLoaded() && this.sphere.isLoaded();
    },

    whichCrystal : 0,
    eighth : new Shape(),
    half : new Shape(),
    sphere : new Shape(),
    crystals : new Array(),
    colors : {}
};
