

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

// palette function
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}

// Fragment shader main function
void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);

    for(float i = 0.0; i < 3.0; i++) {
        uv = fract(uv * 1.5) - 0.5;
        float d = length(uv) * exp(-length(uv0));

        vec3 col = palette(length(uv0) + i + iTime * 0.4, vec3(0.5), vec3(0.5), vec3(1.0), vec3(0.0, 0.33, 0.2));

        d = sin(d * 8. + iTime) / 8.;
        d = abs(d);
        // d = 0.06 / d;
        d = pow(0.01 / d, 1.2);

        finalColor += col * d;
    }
    gl_FragColor = vec4(finalColor, 1.0);
}