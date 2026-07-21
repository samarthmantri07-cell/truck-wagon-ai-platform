// src/components/hero/Shaders.ts

// =========================================================================
// LAYER 2: PROCEDURAL AURORA SHADER
// =========================================================================

export const AuroraVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const AuroraFragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Generic 2D noise function
  float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  // Smooth noise
  float smoothNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      
      // Cubic interpolation
      vec2 u = f * f * (3.0 - 2.0 * f);
      
      return mix( mix( noise( i + vec2(0.0,0.0) ), 
                       noise( i + vec2(1.0,0.0) ), u.x),
                  mix( noise( i + vec2(0.0,1.0) ), 
                       noise( i + vec2(1.0,1.0) ), u.x), u.y);
  }

  // Fractional Brownian Motion
  float fbm(vec2 p) {
      float f = 0.0;
      float amp = 0.5;
      for (int i = 0; i < 5; i++) {
          f += amp * smoothNoise(p);
          p *= 2.0;
          amp *= 0.5;
      }
      return f;
  }

  void main() {
      // Create slow moving coordinates
      vec2 p = vUv * 2.0;
      
      // Move time
      float t = uTime * 0.15;
      
      // Domain warping for aurora effect
      vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(1.0, t * 0.8)));
      vec2 r = vec2(fbm(p + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t), 
                    fbm(p + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t));
                    
      float f = fbm(p + r);
      
      // Luxury color palette (Warm Whites, Deep Blues, Creams)
      vec3 color1 = vec3(0.96, 0.97, 0.98); // Almost white/cream
      vec3 color2 = vec3(0.23, 0.46, 0.94); // Brand Blue
      vec3 color3 = vec3(0.85, 0.90, 0.98); // Soft Light Blue
      
      // Mix colors based on fbm values
      vec3 finalColor = mix(color1, color2, clamp(f * f * 2.0, 0.0, 1.0));
      finalColor = mix(finalColor, color3, clamp(length(q), 0.0, 1.0));
      
      // Add subtle vignette based on distance from center to hide edges
      float dist = distance(vUv, vec2(0.5));
      float vignette = smoothstep(0.8, 0.2, dist);
      
      // High opacity at center, fading out slightly
      gl_FragColor = vec4(finalColor, vignette * 0.6 + 0.2);
  }
`;

// =========================================================================
// LAYER 1: SILK FLOW SHADER
// =========================================================================

// We'll use Three.js built-in PhysicalMaterial and displace its vertices
// using a CustomShaderMaterial approach, or we can just write a raw shader.
// For true luxury silk, MeshPhysicalMaterial with displacement map or modified vertex is best.
// But a raw shader gives us maximum fluid control. Let's do a raw custom shader.

export const SilkVertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // 3D Simplex noise function
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  
  float snoise(vec3 v){ 
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

      // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;

      // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );

      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

      // Permutations
      i = mod(i, 289.0 ); 
      vec4 p = permute( permute( permute( 
                  i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

      // Gradients
      float n_ = 1.0/7.0;
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);

      // Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      // Mix final noise value
      vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
      vUv = uv;
      vNormal = normalMatrix * normal;
      
      vec3 pos = position;
      
      // Calculate mouse influence based on distance to center
      float distToMouse = distance(uv, uMouse);
      float mouseInfluence = smoothstep(0.4, 0.0, distToMouse) * 0.5;
      
      // Displace vertices using noise
      float noiseVal = snoise(vec3(pos.x * 2.0, pos.y * 2.0, uTime * 0.2));
      pos.z += noiseVal * 0.6;
      pos.z += mouseInfluence; // bulge towards mouse
      
      vPosition = pos;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const SilkFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
      // Calculate light direction
      vec3 lightDir = normalize(vec3(1.0, 1.0, 2.0));
      
      // Recalculate normal based on displacement (simplified fake lighting for performance)
      // Since we altered the vertex z in the vertex shader, standard normals are flat.
      // We can use screen-space derivatives or just use the z height to fake it.
      
      // Fake normal using derivatives (requires GL_OES_standard_derivatives, enabled by default in WebGL2)
      vec3 dx = dFdx(vPosition);
      vec3 dy = dFdy(vPosition);
      vec3 calculatedNormal = normalize(cross(dx, dy));
      
      // Diffuse lighting
      float diff = max(dot(calculatedNormal, lightDir), 0.0);
      
      // Specular lighting for silk sheen
      vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
      vec3 reflectDir = reflect(-lightDir, calculatedNormal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
      
      // Rim lighting (Fresnel)
      float fresnel = pow(1.0 - max(dot(calculatedNormal, viewDir), 0.0), 3.0);
      
      // Colors
      vec3 baseColor = vec3(0.96, 0.97, 0.99); // Off-white/cream
      vec3 shadowColor = vec3(0.85, 0.88, 0.95);
      vec3 highlightColor = vec3(1.0, 1.0, 1.0);
      
      vec3 color = mix(shadowColor, baseColor, diff);
      color += highlightColor * spec * 0.5;
      color += vec3(0.23, 0.46, 0.94) * fresnel * 0.3; // Blue brand rim light
      
      gl_FragColor = vec4(color, 0.9); // Slight transparency
  }
`;
