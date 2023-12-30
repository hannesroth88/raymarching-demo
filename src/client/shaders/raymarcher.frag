precision highp float;
precision highp int;

// Your ray marching shader code here

// Declare iResolution
uniform vec2 iResolution;

// Declare additional inputs
uniform float iTime;
uniform float iTimeDelta;
uniform float iFrameRate;
uniform int iFrame;
uniform float iChannelTime[4];
uniform vec3 iChannelResolution[4];
uniform vec4 iMouse;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;
uniform vec4 iDate;

// Function to calculate the distance to a sphere
float map(vec3 p) {
    return length(p) - 1.0; // distance to a sphere of radius 1
}

// Fragment shader
void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;

    // Initialization
    vec3 ro = vec3(0, 0, -3);         // ray origin
    vec3 rd = normalize(vec3(uv, 1)); // ray direction
    vec3 col = vec3(0);               // final pixel color

    float t = 0.; // total distance travelled

    // Raymarching
    for(int i = 0; i < 80; i++) {
        vec3 p = ro + rd * t;     // position along the ray

        float d = map(p);         // current distance to the scene

        t += d;                   // "march" the ray

        if(d < .001)
            break;      // early stop if close enough
        if(t > 100.)
            break;      // early stop if too far
    }

    // Coloring
    col = vec3(t * .2);           // color based on distance

    gl_FragColor = vec4(col, 1);
}