varying vec3 vNormal;
varying vec3 vPosition;

void main (){
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 normal = normalize(vNormal);
  vec3 color = uColor;

  vec3 light = vec3(0.0);

  light += ambientLight(
    vec3(1.0),
    1.0
  )

  light+= directionalLight(
    vec3(1.0, 1.0, 1.0),
    normal,
    vec3(1.0, 1.0, 1.0),
    viewDirection,
    1.0
  )
  color *= light;

  //halftone
  vec2 uv = gl_FragCoord.xy;

  gl_FragColor = vec3(uv, 1.0, 1.0)

}