// checks that students determined a lattice's coordination number on their own

function CoordCheck(dispSelector) {
    
    this.checkCrsytal = function(crystal) {
        var success;
        switch(crystal) {
            case CrystalType.SIMPLE:
                this.checkedSimple = verify('What is the coordination number for the SC lattice?', 6, this.checkedSimple);
                success = this.checkedSimple;
                break;
            case CrystalType.BODY:
                this.checkedBody = verify('What is the coordination number for the BCC lattice?', 8, this.checkedBody);
                success = this.checkedBody;
                break;
            case CrystalType.FACE:
                this.checkedFace = verify('What is the coordination number for the FCC lattice?', 12, this.checkedFace);
                success = this.checkedFace;
                break;
            case CrystalType.NaCl:
                this.checkedNaCl = verifyIonic('What is the coordination number for the sodium ions?',
                                               'What is the coordination number for the chloride ions?',
                                               6, 6, this.checkedNaCl);
                success = this.checkedNaCl;
                break;
            case CrystalType.CaF2:
                this.checkedCaF2 = verifyIonic('What is the coordination number for the calcium ions?',
                                               'What is the coordination number for the fluoride ions?',
                                               8, 4, this.checkedCaF2);
                success = this.checkedCaF2;
                break;
        }
        
        if(!success) {
            alert('Sorry, that\'s incorrect...look closer and try again!');
            dispSelector.val(0);
            Scene.goToLattice();
        }
    },
            
    this.verify = function(msg, correctVal, status) {
        var out = true;
        // don't ask again if they already answered correctly
        if(!status) {
            var input = prompt(msg);
            if(input != correctVal) {
                out = false;;
            }
        }
        
        return out;
    },
            
    this.verifyIonic = function(msgCat, msgAn, correctCat, correctAn, status) {
        var out = true;
        if(!status) {
            var cation = prompt(msgCat);
            var anion = prompt(msgAn);
            if(cation != correctCat || anion != correctAn) {
                out = false;
            }
        }
        
        return out;
    }
    
    this.dispSelector = dispSelector;
    this.checkedSimple = false;
    this.checkedBody = false;
    this.checkedFace = false;
    this.checkedNaCl = false;
    this.checkedCaF2 = false;
}