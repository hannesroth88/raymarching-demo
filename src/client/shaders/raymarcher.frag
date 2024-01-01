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
    return mat2(cos(a),-sin(a),sin(a),cos(a));
}

// Custom gradient - https://iquilezles.org/articles/palettes/
vec3 palette(float t,vec3 a,vec3 b,vec3 c,vec3 d){
    return a+b*cos(6.28318*(c*t+d));
}

float object(vec3 p,float r){
    const float k=sqrt(3.);
    p.x=abs(p.x)-r;
    p.y=p.y+r/k;
    if(p.x+k*p.y>0.)
    p=vec3(p.x-k*p.y,-k*p.x-p.y,0)/2.;
    p.x-=clamp(p.x,-2.*r,0.);
    return-length(p)*sign(p.y);
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

// Scene distance
float map(vec3 p){
    p.z+=iTime*.4;// Forward movement
    
    // Space repetition
    p.xy=fract(p.xy)-.5;// spacing: 1
    p.z=mod(p.z,.25)-.125;// spacing: .25
    
    // float returnObject = sdOctahedron(p,.5);
    // float returnObject = sdCircle(p,.15);
    // float returnObject=sdSegment(p,vec3(.15),vec3(.05));
    float returnObject = max(sdOctahedron(p,.4),sdCircle(p,.2));
    
    return returnObject;
}

void main(){
    vec2 uv=(gl_FragCoord.xy*2.-iResolution.xy)/iResolution.y*iMouse.x;
    vec2 m=(iMouse.xy*2.-iResolution.xy)/iResolution.y;
    
    // Default circular motion if mouse not clicked
    if(iMouse.z<=0.)m=vec2(cos(iTime*.2),sin(iTime*.2));
    
    // Initialization
    vec3 ro=vec3(0,0,-3);// ray origin
    vec3 rd=normalize(vec3(uv,1));// ray direction
    vec3 col=vec3(0);// final pixel color
    
    float t=0.;// total distance travelled
    
    int i;// Raymarching
    for(i=0;i<80;i++){
        vec3 p=ro+rd*t;// position along the ray
        
        p.xy*=rot2D(t*.15*m.x);// rotate ray around z-axis
        
        p.y+=sin(t*(m.y+1.)*.5)*.35;// wiggle ray
        
        float d=map(p);// current distance to the scene
        
        t+=d;// "march" the ray
        
        if(d<.001||t>100.)break;// early stop
    }
    
    // Coloring
    col=palette(t*.04+float(i)*.005,vec3(.5),vec3(.5),vec3(1),vec3(.7529,.5686,.5333));
    
    gl_FragColor=vec4(col,1);
}