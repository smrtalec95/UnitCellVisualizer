// checks that students determined a lattice's coordination number on their own

function CoordCheck(dispSelector) {

    this.dispSelector = dispSelector;
    this.checkedSimple = false;
    this.checkedBody = false;
    this.checkedFace = false;
    this.checkedNaCl = false;
    this.checkedCaF2 = false;
    
    this.checkCrystal = function(crystal) {
        var success;
        console.log('Crystal: ' + crystal);
        if(crystal == CrystalType.SIMPLE) {
            console.log('before call');
            this.checkedSimple = this.verify('What is the coordination number for the SC lattice?', 6, this.checkedSimple);
            console.log('after call');
            success = this.checkedSimple;
        }
        else if(crystal == CrystalType.BODY) {
            this.checkedBody = this.verify('What is the coordination number for the BCC lattice?', 8, this.checkedBody);
            success = this.checkedBody;
        }
        else if(crystal == CrystalType.FACE) {
            this.checkedFace = this.verify('What is the coordination number for the FCC lattice?', 12, this.checkedFace);
            success = this.checkedFace;
        }
        else if(crystal == CrystalType.NaCl) {
            this.checkedNaCl = this.verifyIonic('What is the coordination number for the sodium ions?',
                                           'What is the coordination number for the chloride ions?',
                                           6, 6, this.checkedNaCl);
            success = this.checkedNaCl;
        }
        else if(crystal == CrystalType.CaF2) {
            this.checkedCaF2 = this.verifyIonic('What is the coordination number for the calcium ions?',
                                           'What is the coordination number for the fluoride ions?',
                                           8, 4, this.checkedCaF2);
            success = this.checkedCaF2;
        }
        
        if(!success) {
            alert('Sorry, that\'s incorrect...look closer and try again!');
            dispSelector.val(0);
            Scene.goToLattice();
        }
    };
            
    this.verify = function(msg, correctVal, status) {
        var out = true;
        // don't ask again if they already answered correctly
        console.log('status: ' + status);
        if(!status) {
            console.log('A');
            var input = window.prompt(msg);
            console.log('B');
            if(input != correctVal) {
                out = false;;
            }
        }
        
        return out;
    };
            
    this.verifyIonic = function(msgCat, msgAn, correctCat, correctAn, status) {
        var out = true;
        if(!status) {
            var cation = window.prompt(msgCat);
            var anion = window.prompt(msgAn);
            if(cation != correctCat || anion != correctAn) {
                out = false;
            }
        }
        
        return out;
    };
}