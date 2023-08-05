uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uGrainIntensity;
uniform float uChromaticAberration;
uniform float uSharpen;
varying vec2 vUv;

// Random Function
float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main()
{
    vec2 gridUv = vec2( floor( vUv.x * 1000.0 ) / 10.0, floor(vUv.y * 1000.0) / 10.0);

    // Regular grain effect
    float strength = random( gridUv + sin(uTime) ) * uGrainIntensity + 0.5;
    vec4 grain = vec4( strength, strength, strength, 1.0 );

    // Apply subtle chromatic aberration
    float chromaticAberration = uChromaticAberration * 0.01;
    vec4 finalColor = vec4(
        texture2D(tDiffuse, vUv + vec2(chromaticAberration, 0.0)).r,
        texture2D(tDiffuse, vUv).g,
        texture2D(tDiffuse, vUv + vec2(0.0, chromaticAberration)).b,
        1.0
    );

    // Combine grain and chromatic aberration
    vec4 combinedColor = finalColor * grain;

    // Apply sharpening effect
    vec4 finalColorWithSharpen = combinedColor * uSharpen;

    gl_FragColor = finalColorWithSharpen;
}