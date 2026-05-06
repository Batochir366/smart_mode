import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { TextureLoader } from 'three'

const FLAG_WIDTH = 5
const FLAG_HEIGHT = 3

/** Matches ~2:1 asset at `public/Flag.png` */
const FLAG_IMAGE_WIDTH = 5
const FLAG_IMAGE_HEIGHT = 2.5

type FlagTheme = 'light' | 'dark'

const createFlagTexture = (theme: FlagTheme) => {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return new THREE.CanvasTexture(canvas)
  }

  const isDark = theme === 'dark'
  ctx.fillStyle = isDark ? '#070908' : '#f2f2ee'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  bgGradient.addColorStop(0, isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.58)')
  bgGradient.addColorStop(0.55, isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.02)')
  bgGradient.addColorStop(1, isDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.12)')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const circleBaseX = isDark ? 1000 : 1100
  const circleLayers = [
    { x: circleBaseX - 100, radius: 470, alpha: 0.9 },
    { x: circleBaseX + 100, radius: 470, alpha: 0.9 },
    { x: circleBaseX + 300, radius: 470, alpha: 0.9 },
  ]

  circleLayers.forEach(({ x, radius, alpha }) => {
    const orbGradient = ctx.createRadialGradient(x - radius * 0.28, 130, 20, x, 255, radius)
    if (isDark) {
      orbGradient.addColorStop(0, `rgba(134,239,172,${Math.min(alpha * 0.9 + 0.1, 1)})`)
      orbGradient.addColorStop(0.5, `rgba(74,222,128,${alpha})`)
      orbGradient.addColorStop(1, `rgba(34,197,94,${alpha * 0.82})`)
    } else {
      orbGradient.addColorStop(0, `rgba(187,247,208,${Math.min(alpha + 0.08, 0.98)})`)
      orbGradient.addColorStop(0.52, `rgba(46,204,113,${alpha})`)
      orbGradient.addColorStop(1, `rgba(52,168,83,${alpha * 0.74})`)
    }

    ctx.fillStyle = orbGradient
    ctx.beginPath()
    ctx.arc(x, 255, radius, 0, Math.PI * 2)
    ctx.fill()
  })

  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.9)' : '#050505'
  ctx.font = '96px Arial, sans-serif'
  ctx.fillText('Smart', isDark ? 100 : 170, 225)

  ctx.fillStyle = '#2ecc71'
  ctx.font = 'bold 102px Arial, sans-serif'
  ctx.fillText('MODE', isDark ? 100 : 170, 325)

  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.92)'
  ctx.font = '62px Arial, sans-serif'
  ctx.fillText('Build', isDark ? 610 : 610, 205)
  ctx.fillText('Smarter', isDark ? 610 : 610, 272)
  ctx.fillText('Grow Faster.', isDark ? 610 : 610, 339)

  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.28)'
  ctx.font = '24px Arial, sans-serif'
  ctx.fillText('www.smartmode.mn', isDark ? 100 : 185, 382)

  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.30)'
  ctx.lineWidth = 6
  ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.needsUpdate = true

  return texture
}

const flagVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uWindStrength;
  uniform float uWindSpeed;
  uniform float uPinSoftness;
  uniform float uSag;
  uniform float uNoiseScale;
  uniform vec2  uMeshSize;
  uniform vec2  uWindDir;

  varying vec2  vUv;
  varying vec3  vWorldNormal;
  varying vec3  vWorldPos;
  varying float vAnchor;
  varying float vDisplacement;

  vec4 _permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  vec4 _taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0);
    vec4 p = _permute(_permute(_permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0 / 7.0;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j  = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 xx = floor(j * ns.z);
    vec4 yy = floor(j - 7.0 * xx);
    vec4 px = xx * ns.x + ns.yyyy;
    vec4 py = yy * ns.x + ns.yyyy;
    vec4 h  = 1.0 - abs(px) - abs(py);
    vec4 b0 = vec4(px.xy, py.xy);
    vec4 b1 = vec4(px.zw, py.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 nrm = _taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= nrm.x; p1 *= nrm.y; p2 *= nrm.z; p3 *= nrm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  float displaceFn(vec2 uv, float t) {
    float anchor = uv.x;
    float pin = smoothstep(0.0, uPinSoftness, anchor);
    float ramp = pow(anchor, 0.8);
    vec2 dir = normalize(uWindDir);
    float along = dot(uv, dir);
    vec2 perp = vec2(-dir.y, dir.x);
    float across = dot(uv, perp);
    float phase = along * 4.2 + t * uWindSpeed;
    float primary = sin(phase) * 0.42;
    float secondary = sin(phase * 2.1 + across * 1.6) * 0.06;
    float crossWave = sin(across * 5.0 + t * 1.2) * 0.03;
    vec2 driftedUv = uv + dir * (t * 0.18);
    float n = snoise(vec3(driftedUv * uNoiseScale, t * 0.45));
    n += snoise(vec3(driftedUv * (uNoiseScale * 2.0) + vec2(t * 0.15, 0.0), t * 0.7)) * 0.3;
    return (primary + secondary + crossWave + n * 0.12) * uWindStrength * pin * ramp;
  }

  void main() {
    vUv = uv;
    float anchor = uv.x;
    vAnchor = anchor;

    float disp = displaceFn(uv, uTime);
    vec3 pos = position;
    pos.z += disp;
    pos.y -= pow(anchor, 1.6) * uSag;

    vDisplacement = disp;

    float eps = 0.004;
    float dXdU = (displaceFn(uv + vec2(eps, 0.0), uTime) - disp) / eps;
    float dYdV = (displaceFn(uv + vec2(0.0, eps), uTime) - disp) / eps;

    vec3 tangent = vec3(uMeshSize.x, 0.0, dXdU);
    vec3 bitan   = vec3(0.0, uMeshSize.y, dYdV);
    vec3 newNormal = normalize(cross(tangent, bitan));

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPos = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * newNormal);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const flagFragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec3 uLightDir;
  uniform vec3 uLightColor;
  uniform vec3 uFillColor;
  uniform vec3 uAmbient;
  uniform float uShadowStrength;
  uniform float uRimStrength;
  uniform float uSheenStrength;
  uniform float uTranslucency;
  uniform float uWeaveStrength;
  uniform vec2  uMeshSize;
  uniform float uCornerRadius;
  uniform float uLightFloor;

  varying vec2  vUv;
  varying vec3  vWorldNormal;
  varying vec3  vWorldPos;
  varying float vAnchor;
  varying float vDisplacement;

  void main() {
    vec4 base = texture2D(uTexture, vUv);

    vec3 N = normalize(vWorldNormal);
    vec3 L = normalize(uLightDir);
    vec3 V = normalize(cameraPosition - vWorldPos);

    vec2 weaveUv = vUv * vec2(180.0, 90.0);
    vec3 weaveBump = vec3(
      sin(weaveUv.x) * 0.08,
      sin(weaveUv.y) * 0.08,
      0.0
    );
    vec3 Nf = normalize(N + weaveBump * uWeaveStrength);

    float halfL = dot(Nf, L) * 0.5 + 0.5;
    float wrap  = halfL * halfL * (1.0 - abs(vDisplacement) * 0.4);
    wrap = clamp(wrap, 0.0, 0.72);
    vec3 keyDiffuse = uLightColor * wrap;

    float NdotFill = max(dot(Nf, normalize(vec3(0.6, 0.3, 0.4))), 0.0) * 0.35;
    vec3 fillDiffuse = uFillColor * NdotFill;

    vec3 litRaw = uAmbient + keyDiffuse + fillDiffuse;
    vec3 lit = max(litRaw, vec3(uLightFloor));

    float backTerm = pow(max(dot(-Nf, L), 0.0), 1.5);
    vec3 subsurface = base.rgb * backTerm * 0.22 * uTranslucency;

    vec3 H = normalize(L + V);
    float NoH = max(dot(Nf, H), 0.0);
    float NoV = max(dot(Nf, V), 0.0001);
    float NoL = max(dot(Nf, L), 0.0001);
    float fuzz = pow(1.0 - clamp(dot(Nf, V), 0.0, 1.0), 3.0) * 0.08;
    vec3 sheen = vec3(1.0) * fuzz;

    float fold = smoothstep(-0.18, 0.18, vDisplacement);
    float ao = mix(1.0 - uShadowStrength * vAnchor, 1.0, fold);
    vec3 absorbed = base.rgb * mix(base.rgb, vec3(1.0), ao);

    vec3 color = absorbed * lit * ao;
    color += sheen;
    color += subsurface;

    float rim = pow(1.0 - clamp(abs(dot(Nf, V)), 0.0, 1.0), 2.5) * uRimStrength;
    color += base.rgb * rim;

    vec2 fromCenter = (vUv - 0.5) * uMeshSize;
    vec2 halfSize = uMeshSize * 0.5;
    vec2 d = abs(fromCenter) - (halfSize - uCornerRadius);
    float cornerSdf = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - uCornerRadius;
    float cornerAlpha = 1.0 - smoothstep(-0.012, 0.004, cornerSdf);
    float edgeShade = mix(0.92, 1.0, smoothstep(-0.06, -0.005, cornerSdf));
    color *= edgeShade;

    gl_FragColor = vec4(color, base.a * cornerAlpha);
  }
`

function WavingFlag({
  theme,
  position,
  delay = 0,
  rotation = [0, 0, 0],
  scale = 1,
}: {
  theme: FlagTheme
  position: [number, number, number]
  delay?: number
  rotation?: [number, number, number]
  scale?: number
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const texture = useMemo(() => createFlagTexture(theme), [theme])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTexture: { value: texture },
      uWindStrength: { value: 2 },
      uWindSpeed: { value: 3 },
      uPinSoftness: { value: 0 },
      uSag: { value: 0.12 },
      uNoiseScale: { value: 2.5 },
      uMeshSize: { value: new THREE.Vector2(FLAG_WIDTH, FLAG_HEIGHT) },
      uWindDir: { value: new THREE.Vector2(1.0, 0.7).normalize() },
      uLightDir: { value: new THREE.Vector3(-0.2, 0.8, 9.4).normalize() },
      uLightColor: { value: new THREE.Color(0.55, 0.55, 0.52) },
      uFillColor: { value: new THREE.Color('#d4c8a8') },
      uAmbient: { value: new THREE.Color(0.62, 0.6, 0.57) },
      uShadowStrength: { value: 0.22 },
      uRimStrength: { value: 0 },
      uSheenStrength: { value: 0.0 },
      uTranslucency: { value: 0.2 },
      uWeaveStrength: { value: 0.09 },
      uCornerRadius: { value: 0.07 },
      uLightFloor: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useEffect(() => {
    const material = materialRef.current
    if (!material) return
    const previous = material.uniforms.uTexture.value as THREE.Texture | null
    if (previous && previous !== texture) {
      previous.dispose()
    }
    material.uniforms.uTexture.value = texture
  }, [texture])

  useFrame(({ clock }) => {
    const material = materialRef.current
    if (!material) return
    material.uniforms.uTime.value = clock.getElapsedTime() + delay
  })

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[FLAG_WIDTH / 2, 0.16, 0]}>
        <planeGeometry args={[FLAG_WIDTH, FLAG_HEIGHT, 128, 64]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={flagVertexShader}
          fragmentShader={flagFragmentShader}
          uniforms={uniforms}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
    </group>
  )
}

function WavingImageFlag({
  imageUrl,
  position,
  delay = 0,
  rotation = [0, 0, 0],
  scale = 1,
}: {
  imageUrl: string
  position: [number, number, number]
  delay?: number
  rotation?: [number, number, number]
  scale?: number
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const texture = useLoader(TextureLoader, imageUrl)

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    // Negative repeat needs RepeatWrapping on that axis
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.flipY = true
    // Undo horizontal mirror (PNG reads correctly left-to-right on the plane)
    texture.repeat.set(-1, 1)
    texture.offset.set(1, 0)
    texture.needsUpdate = true
  }, [texture])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTexture: { value: texture },
      uWindStrength: { value: 2 },
      uWindSpeed: { value: 3 },
      uPinSoftness: { value: 0 },
      uSag: { value: 0.12 },
      uNoiseScale: { value: 2.5 },
      uMeshSize: { value: new THREE.Vector2(FLAG_IMAGE_WIDTH, FLAG_IMAGE_HEIGHT) },
      uWindDir: { value: new THREE.Vector2(1.0, 0.7).normalize() },
      uLightDir: { value: new THREE.Vector3(-0.35, 0.85, 0.4).normalize() },
      uLightColor: { value: new THREE.Color(0.82, 0.82, 0.8) },
      uFillColor: { value: new THREE.Color('#e8e4dc') },
      uAmbient: { value: new THREE.Color(0.96, 0.96, 0.98) },
      uShadowStrength: { value: 0.035 },
      uRimStrength: { value: 0 },
      uSheenStrength: { value: 0.0 },
      uTranslucency: { value: 0.06 },
      uWeaveStrength: { value: 0 },
      uCornerRadius: { value: 0.07 },
      uLightFloor: { value: 0.52 },
    }),
    [texture],
  )

  useEffect(() => {
    const material = materialRef.current
    if (!material) return
    material.uniforms.uTexture.value = texture
  }, [texture])

  useFrame(({ clock }) => {
    const material = materialRef.current
    if (!material) return
    material.uniforms.uTime.value = clock.getElapsedTime() + delay
  })

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh position={[FLAG_IMAGE_WIDTH / 2, 0.16, 0]}>
        <planeGeometry args={[FLAG_IMAGE_WIDTH, FLAG_IMAGE_HEIGHT, 128, 64]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={flagVertexShader}
          fragmentShader={flagFragmentShader}
          uniforms={uniforms}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
    </group>
  )
}

function FlagSceneContent() {
  const { size } = useThree()
  const isMobile = size.width < 640
  const frontTheme: FlagTheme = 'dark'
  const backTheme: FlagTheme = 'light'
  const widthT = THREE.MathUtils.clamp((size.width - 360) / (1440 - 360), 0, 1)
  const aspect = size.width / Math.max(size.height, 1)
  const aspectOffset = aspect < 0.65 ? 0.65 - aspect : 0

  const frontScale = THREE.MathUtils.lerp(1.1, 1.48, widthT) - aspectOffset * 0.18
  const frontPosition: [number, number, number] = [
    THREE.MathUtils.lerp(-2.5, -9.15, widthT) + aspectOffset * 0.9,
    THREE.MathUtils.lerp(0.04, 0.08, widthT),
    0.36,
  ]
  const backScale = THREE.MathUtils.lerp(0.82, 1.22, widthT) - aspectOffset * 0.12
  const backPosition: [number, number, number] = [
    THREE.MathUtils.lerp(-1.45, -1.4, widthT) + aspectOffset * 0.35,
    THREE.MathUtils.lerp(0.32, 0.4, widthT),
    -0.32,
  ]

  return (
    <>
      <ambientLight intensity={1.55} />
      <directionalLight position={[-2.5, 4, 5]} intensity={2.8} />
      <directionalLight position={[3, 1.5, 2]} intensity={0.8} color="#7dd3fc" />
      {!isMobile && (
        <WavingFlag
          theme={backTheme}
          position={backPosition}
          delay={0.75}
          rotation={[0, 0, 0]}
          scale={backScale}
        />
      )}
      <WavingFlag
        theme={frontTheme}
        position={frontPosition}
        delay={0}
        rotation={[0, 0, 0]}
        scale={frontScale}
      />
    </>
  )
}

function FlagImageSceneContent() {
  const { size } = useThree()
  const isMobile = size.width < 640
  const widthT = THREE.MathUtils.clamp((size.width - 360) / (1440 - 360), 0, 1)
  const aspect = size.width / Math.max(size.height, 1)
  const aspectOffset = aspect < 0.65 ? 0.65 - aspect : 0

  const frontScale = THREE.MathUtils.lerp(1.1, 1.48, widthT) - aspectOffset * 0.18
  const frontPosition: [number, number, number] = [
    THREE.MathUtils.lerp(-2.5, -9.15, widthT) + aspectOffset * 0.9,
    THREE.MathUtils.lerp(0.04, 0.08, widthT),
    0.36,
  ]
  const backScale = THREE.MathUtils.lerp(0.82, 1.22, widthT) - aspectOffset * 0.12
  const backPosition: [number, number, number] = [
    THREE.MathUtils.lerp(-1.45, -1.4, widthT) + aspectOffset * 0.35,
    THREE.MathUtils.lerp(0.32, 0.4, widthT),
    -0.32,
  ]

  return (
    <>
      <ambientLight intensity={1.55} />
      <directionalLight position={[-2.5, 4, 5]} intensity={2.8} />
      <directionalLight position={[3, 1.5, 2]} intensity={0.8} color="#7dd3fc" />
      {!isMobile && (
        <WavingImageFlag
          imageUrl="/Flag.png"
          position={backPosition}
          delay={0.75}
          rotation={[0, 0, 0]}
          scale={backScale}
        />
      )}
      <WavingImageFlag
        imageUrl="/Flag.png"
        position={frontPosition}
        delay={0}
        rotation={[0, 0, 0]}
        scale={frontScale}
      />
    </>
  )
}

const getResponsiveCamera = () => {
  if (typeof window === 'undefined') {
    return { position: [0.25, 0.18, 8] as [number, number, number], zoom: 74 }
  }
  const width = window.innerWidth
  const height = window.innerHeight || 1
  const t = THREE.MathUtils.clamp((width - 360) / (1440 - 360), 0, 1)
  const aspect = width / height
  const aspectOffset = aspect < 0.65 ? 0.65 - aspect : 0
  const zoom = THREE.MathUtils.lerp(58, 74, t) - aspectOffset * 8
  const posX = THREE.MathUtils.lerp(0.45, 0.25, t)

  return { position: [posX, 0.18, 8] as [number, number, number], zoom }
}

export function FlagSection() {
  const [cameraConfig, setCameraConfig] = useState(getResponsiveCamera)

  useEffect(() => {
    const updateCamera = () => setCameraConfig(getResponsiveCamera())

    window.addEventListener('resize', updateCamera)
    return () => window.removeEventListener('resize', updateCamera)
  }, [])

  return (

    <div className="relative h-[54vh] min-h-[340px] overflow-hidden">
      <Canvas
        orthographic
        camera={cameraConfig}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        className="absolute inset-0"
      >
        <FlagSceneContent />
      </Canvas>
    </div>
  )
}

export function FlagImageSection() {
  const [cameraConfig, setCameraConfig] = useState(getResponsiveCamera)

  useEffect(() => {
    const updateCamera = () => setCameraConfig(getResponsiveCamera())

    window.addEventListener('resize', updateCamera)
    return () => window.removeEventListener('resize', updateCamera)
  }, [])

  return (
    <div className="relative h-[54vh] min-h-[340px] overflow-hidden bg-blue-200">
      <Canvas
        orthographic
        camera={cameraConfig}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => gl.setClearColor(0x2563eb, 1)}
        className="absolute inset-0"
      >
        <Suspense fallback={null}>
          <FlagImageSceneContent />
        </Suspense>
      </Canvas>
    </div>
  )
}
