/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function HCP(eighth, sixth, half, sphere, colors) {
    
    this.prototype = new UnitCell(eighth, half, sphere, colors);
    
    this.sixth = sixth;
    this.sphere = sphere;
    this.colors = colors;
    
    this.draw = function(MV, prog) {
        MV.pushMatrix();
        MV.rotate(20, vec3.fromValues(0, 1, 0));
        gl.uniform3fv(prog.getHandle("kdFront"), colors['grey']);
        sixth.draw(prog);
        MV.popMatrix();
    }
        
    this.getCellLayers = function() {
        if(layers == null) {
            layers = new Array();
            layers.push(new Layer(4,4, -3, 1.0, 1.0, colors["grey"], sphere));
            layers.push(new Layer(4,4, -1, 1.0, 1.0, colors["grey"], sphere));
            layers.push(new Layer(4,4, 1, 1.0, 1.0, colors["grey"], sphere));
            layers.push(new Layer(4,4, 3, 1.0, 1.0, colors["grey"], sphere));
        }
        
        return layers;
    }
    
    var layers = null;
    this.name = "HCP";
}


