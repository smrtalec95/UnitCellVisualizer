precision mediump float;

varying vec3 fragPos; // in camera space
varying vec3 fragNor; // in camera space
uniform vec3 kdFront;
uniform float alpha;

void main()
{   
	vec3 lightPos = vec3(0.0, 0.0, 0.0);
	vec3 n = normalize(fragNor);
	vec3 l = normalize(lightPos - fragPos);
	vec3 v = -normalize(fragPos);
	vec3 h = normalize(l + v);
	vec3 kd = kdFront;
	float ln = dot(l, n);
	if(ln < 0.0) {
		ln = -ln;
	}
	vec3 diffuse = ln * kd;
	vec3 color = diffuse;
	gl_FragColor = vec4(color, alpha);
}
