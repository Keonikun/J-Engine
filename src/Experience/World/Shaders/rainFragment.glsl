uniform sampler2D map;

void main()
{
    gl_FragColor = texture2D(map,gl_PointCoord);
}