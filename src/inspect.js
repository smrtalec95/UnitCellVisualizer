function Inspect(eighth, half, scale) {
    
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
    
    this.eighth = eighth;
    this.half = half;
    this.scale = scale;
}