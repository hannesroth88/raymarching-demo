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

// This scene is taken from my second tutorial about shader coding,
// which introduces the concept of raymarching as well as some useful
// transforms and space-bending techniques.
// 
//     Mouse interactive!
//                            Video URL: https://youtu.be/khblXafu7iA

// 2D rotation function
mat2 rot2D(float a) {
    return mat2(cos(a), -sin(a), sin(a), cos(a));
}

// Custom gradient - https://iquilezles.org/articles/palettes/
vec3 palette( float t, vec3 a, vec3 b, vec3 c, vec3 d ){
    return a + b*cos( 6.28318*(c*t+d) );
}


// Octahedron SDF - https://iquilezles.org/articles/distfunctions/
float sdOctahedron(vec3 p, float s) {
    p = abs(p);
    return (p.x+p.y+p.z-s)*0.57735027;
}

// Scene distance
float map(vec3 p) {
    p.z += iTime * .4; // Forward movement
    
    // Space repetition
    p.xy = fract(p.xy) - .5;     // spacing: 1
    p.z =  mod(p.z, .25) - .125; // spacing: .25
    
    return sdOctahedron(p, .15); // Octahedron
}

void main() {
    vec2 uv = (gl_FragCoord.xy * 2. - iResolution.xy) / iResolution.y;
    vec2  m = (iMouse.xy * 2. - iResolution.xy) / iResolution.y;
    
    // Default circular motion if mouse not clicked
    if (iMouse.z <= 0.) m = vec2(cos(iTime*.2), sin(iTime*.2));

    // Initialization
    vec3 ro = vec3(0, 0, -3);         // ray origin
    vec3 rd = normalize(vec3(uv, 1)); // ray direction
    vec3 col = vec3(0);               // final pixel color

    float t = 0.; // total distance travelled

    int i; // Raymarching
    for (i = 0; i < 80; i++) {
        vec3 p = ro + rd * t; // position along the ray
        
        p.xy *= rot2D(t*.15 * m.x);     // rotate ray around z-axis

        p.y += sin(t*(m.y+1.)*.5)*.35;  // wiggle ray

        float d = map(p);     // current distance to the scene

        t += d;               // "march" the ray

        if (d < .001 || t > 100.) break; // early stop
    }

    // Coloring
    col = palette(t*.04 + float(i)*.005, vec3(.5), vec3(.5), vec3(1), vec3(0.7529, 0.5686, 0.5333));

    gl_FragColor = vec4(col, 1);
}