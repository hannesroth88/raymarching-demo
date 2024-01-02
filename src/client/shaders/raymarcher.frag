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
mat2 rot2D(float a){
    return mat2(cos(a),-sin(a),sin(a),cos(a));
}
// 2D rotation function
mat2 rot2DCustom(float a){
    return mat2(tan(a),-cos(a),fract(a),sin(a));
}

// Custom gradient - https://iquilezles.org/articles/palettes/
vec3 palette(float t,vec3 a,vec3 b,vec3 c,vec3 d){
    return a+b*cos(6.28318*(c*t+d));
}


// Octahedron SDF - https://iquilezles.org/articles/distfunctions/
float sdOctahedron(vec3 p,float s){
    p=abs(p);
    return(p.x+p.y+p.z-s)*.57735027;
}

float sdCircle(vec3 p,float r){
    return length(p)-r;
}

float sdSegment(vec3 p,vec3 a,vec3 b){
    vec3 pa=p-a,ba=b-a;
    float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);
    return length(pa-ba*h);
}

float sdUnevenCapsule( vec2 p ){
    float r1 = .15;
    float r2 = .05;
    float h  = .25;
    p.x = abs(p.x);
    float b = (r1-r2)/h;
    float a = sqrt(1.0-b*b);
    float k = dot(p,vec2(-b,a));
    if( k < 0.0 ) return length(p) - r1;
    if( k > a*h ) return length(p-vec2(0.0,h)) - r2;
    return dot(p, vec2(a,b) ) - r1;
}

// Scene distance
float map(vec3 p){
    p.z+=iTime*1.;// Forward movement
    
    // Space repetition
    p.xy=fract(p.xy)-.5;// spacing: 1
    p.z=mod(p.z,.25)-.125;// spacing: .25
    
    float octahedron = sdOctahedron(p,.002);
    float circle = sdCircle(p,0.03);
    float segment = sdSegment(p,vec3(.4),vec3(.3));
    float unevenCapsule = sdUnevenCapsule(p.xy);
    // float returnObject = max(octahedron,unevenCapsule);
    float returnObject = max(octahedron,circle);
    
    return returnObject;
}

void main(){
    // vec2 uv=(gl_FragCoord.xy*2.-iResolution.xy)/iResolution.y*iMouse.x*10.;
    vec2 uv=(gl_FragCoord.xy*2.-iResolution.xy)/iResolution.y*10.;
    vec2 m=(iMouse.xy*500.-iResolution.xy)/iResolution.y;
    
    // Default circular motion if mouse not clicked
    if(iMouse.z<=0.)
    m=vec2(cos(iTime*0.2),sin(iTime*.2));
    
    // Initialization
    vec3 ro=vec3(0,0,-3);// ray origin
    vec3 rd=normalize(vec3(uv,1));// ray direction
    vec3 col=vec3(0);// final pixel color
    
    float tDist=0.;// total distance travelled
    
    int i;// Raymarching
    for(i=0;i<100;i++){
        vec3 p=ro+rd*tDist;// position along the ray
        

        p.xy*=rot2DCustom(tDist*.15*m.x);// rotate ray around z-axis
        
        

        p.y+=sin(tDist*(m.y+1.)*.5)*.35;// wiggle ray
        
        float d=map(p);// current distance to the scene

        // create a cube
        // vec3 q = p - vec3(1.0, 1.0, 0.0);
        // float circle = sdCircle(q,0.05);
        // d = max(d,circle);

        tDist+=d;// "march" the ray
        
        if(d<.001||tDist>100.)break;// early stop
    }
    
    // Coloring
    col=palette(tDist*0.104+float(i)*.005,vec3(.5),vec3(.5),vec3(1),vec3(.7529,.5686,.5333));
    
    gl_FragColor=vec4(col,1);
}