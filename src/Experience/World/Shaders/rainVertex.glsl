#define rainSpeed 0.3;

uniform float uTime;

float alteredTime = -1.0;
float alteredInterval = 1.0;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    modelPosition.y -= uTime * rainSpeed;
    modelPosition.y = mod(modelPosition.y, 7.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = 8.0;
}