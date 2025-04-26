"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import type { Group } from "three"
import type { Evidence } from "./detective-room"
// Add these imports at the top of the file
import type { CryptoEvidence } from "./detective-room"

// Update the RoomProps type to include the new props
type RoomProps = {
  onShowEvidence: (evidence: Evidence) => void
  onShowCryptoEvidence: (evidence: CryptoEvidence) => void
  onOpenFileDrawer: (title: string, token: string, articleUrl: string) => void
  onShowPhoneCall: () => void
  focusOnObject: (position: [number, number, number], target: [number, number, number]) => void
  resetCamera: () => void
  timeOfDay: number
}

// Update the function parameters to include the new props
export default function Room({
  onShowEvidence,
  onShowCryptoEvidence,
  onOpenFileDrawer,
  onShowPhoneCall,
  focusOnObject,
  resetCamera,
  timeOfDay,
}: RoomProps) {
  const roomRef = useRef<Group>(null)
  const chairRef = useRef<Group>(null)
  const deskRef = useRef<Group>(null)
  const bulletinRef = useRef<Group>(null)
  const cabinetRef = useRef<Group>(null)
  const windowRef = useRef<Group>(null)
  // Add these refs
  const phoneRef = useRef<Group>(null)
  // Remove traceFundsButtonRef

  const [hovered, setHovered] = useState<string | null>(null)
  // Add these to the existing useState hooks
  const [hoveredCryptoImage, setHoveredCryptoImage] = useState<string | null>(null)
  const [hoveredFileDrawer, setHoveredFileDrawer] = useState<string | null>(null)
  const [lampLightIntensity, setLampLightIntensity] = useState(2)
  const [windowLightIntensity, setWindowLightIntensity] = useState(0.5)

  // Adjust lighting based on time of day
  useEffect(() => {
    // Lamp is brighter at night, dimmer during day
    if (timeOfDay >= 18 || timeOfDay < 6) {
      setLampLightIntensity(4) // Increased from 2
    } else if ((timeOfDay >= 6 && timeOfDay < 9) || (timeOfDay >= 16 && timeOfDay < 18)) {
      setLampLightIntensity(3) // Increased from 1.5
    } else {
      setLampLightIntensity(2) // Increased from 1
    }

    // Window light is brighter during day, dimmer at night
    if (timeOfDay >= 10 && timeOfDay < 16) {
      setWindowLightIntensity(3) // Increased from 1.5
    } else if ((timeOfDay >= 7 && timeOfDay < 10) || (timeOfDay >= 16 && timeOfDay < 19)) {
      setWindowLightIntensity(2) // Increased from 1
    } else if (timeOfDay >= 19 && timeOfDay < 21) {
      setWindowLightIntensity(1) // Increased from 0.5
    } else {
      setWindowLightIntensity(0.5) // Increased from 0.1
    }
  }, [timeOfDay])

  // Sample evidence data with enhanced descriptions
  const deskEvidence = {
    title: "Case Notes",
    description:
      "Detective's Personal Notes:\nA pattern of suspicious activity surrounds the six Solana presales.\nLarge raises. Missing funds. Broken promises.\nThe trail leads straight to CEXs — and silence.",
    imageUrl: "/detective-desk-notes.png",
    blockchainLink: "case-ref-123456",
  }

  const bulletinEvidence = {
    title: "Suspect Network",
    description:
      "The network diagram shows clear connections between Moriarty's organization and recent heists. Red strings indicate confirmed sightings, while yellow markers represent unverified witness accounts. The central node appears to be a warehouse in the industrial district.",
    imageUrl: "/crime-scene-analysis.png",
    blockchainLink: "case-ref-789012",
  }

  const cabinetEvidence = {
    title: "Confidential Files",
    description:
      "These classified documents contain forensic reports indicating the use of specialized equipment in the bank vault breach. Witness statements describe a tall figure with a distinctive limp. Ballistics match a rare caliber only used by military contractors.",
    imageUrl: "/confidential-documents.png",
    blockchainLink: "case-ref-345678",
  }

  // Easter egg evidence
  const hiddenEvidence = {
    title: "Secret Photograph",
    description:
      "A hidden photograph showing what appears to be a high-ranking official shaking hands with the prime suspect. The timestamp indicates this meeting occurred just days before the major heist. This could be the connection we've been looking for.",
    imageUrl: "/secret-photo.png",
    blockchainLink: "case-ref-901234",
  }

  // FIXED: Corrected founder names and ensured "Founder:" is fully displayed
  const cryptoEvidenceData = [
    {
      id: "slerf",
      title: "$SLERF",
      description:
        "Founder: Slerf. He fumbled $10M, burned the airdrop, and still got a fanbase. The SLERF token gained notoriety after a major technical error resulted in millions of dollars being inaccessible.",
      imageUrl: "/slerf.jpg",
      token: "$SLERF",
      position: [-0.7, 0.3, 0.05],
      articleUrl:
        "https://medium.com/@MotiBanks/he-fumbled-10m-burned-the-airdrop-and-still-got-a-fanbase-af9f917684b8",
    },
    {
      id: "like",
      title: "$LIKE",
      description:
        "Founder: Pokeepandaa. He got rejected on Tinder, launched a $9.8M presale instead. The LIKE token was created as a social experiment that quickly gained traction in the crypto community.",
      imageUrl: "/like.webp",
      token: "$LIKE",
      position: [0.4, 0.3, 0.05],
      articleUrl:
        "https://medium.com/@MotiBanks/he-got-rejected-on-Tinder-launched-a-9-8m-presale-instead-116261bcc1d6",
    },
    {
      id: "nap",
      title: "$NAP",
      description:
        "Founder: Kero. This NFT artist stole $200K of the presale funds and now his X account is private. The NAP token was surrounded by controversy after allegations of misappropriated funds.",
      imageUrl: "/nap.webp",
      token: "$NAP",
      position: [-0.4, -0.2, 0.05],
      articleUrl:
        "https://medium.com/@MotiBanks/this-nft-artist-stole-200k-of-the-presale-funds-and-now-his-x-account-is-private-e29e4ba4d131",
    },
    {
      id: "gm",
      title: "$GM.ai",
      description:
        "Founder: Dexter. He pulled off one of the biggest scandals in presale history. The GM.ai token raised millions in its presale before questions about the project's legitimacy began to surface.",
      imageUrl: "/gm.webp",
      token: "$GM.ai",
      position: [0.7, -0.2, 0.05],
      articleUrl:
        "https://medium.com/@MotiBanks/he-pulled-off-one-of-the-biggest-scandals-in-presale-history-09a1c6c0cf95",
    },
    {
      id: "moonke",
      title: "$MOONKE",
      description:
        "Founder: Rocky. Someone filed an SEC complaint against him, but who? The MOONKE token faced regulatory scrutiny after its rapid rise in value raised red flags.",
      imageUrl: "/moonke.webp",
      token: "$MOONKE",
      position: [-0.2, 0.5, 0.05],
      articleUrl: "https://medium.com/@MotiBanks/someone-filed-an-sec-complaint-against-him-but-who-61c97c247baf",
    },
    {
      id: "smole",
      title: "$SMOLE",
      description:
        "Founder: Dekadente. These crypto bros once had $100M in their possession. How much did they keep? The SMOLE token's presale was one of the most successful in recent history.",
      imageUrl: "/dekadente.jpeg",
      token: "$SMOLE",
      position: [0.6, 0.5, 0.05],
      articleUrl:
        "https://medium.com/@MotiBanks/these-crypto-bros-once-had-100m-in-their-possession-how-much-did-they-keep-a3b9cf229cd0",
    },
  ]

  // Add these file drawer data objects
  const fileDrawers = [
    {
      id: "drawer1",
      title: "$GM.ai Investigation",
      token: "$GM.ai",
      articleUrl:
        "https://medium.com/@MotiBanks/he-pulled-off-one-of-the-biggest-scandals-in-presale-history-09a1c6c0cf95",
    },
    {
      id: "drawer2",
      title: "$LIKE Investigation",
      token: "$LIKE",
      articleUrl:
        "https://medium.com/@MotiBanks/he-got-rejected-on-Tinder-launched-a-9-8m-presale-instead-116261bcc1d6",
    },
    {
      id: "drawer3",
      title: "$SLERF Investigation",
      token: "$SLERF",
      articleUrl:
        "https://medium.com/@MotiBanks/he-fumbled-10m-burned-the-airdrop-and-still-got-a-fanbase-af9f917684b8",
    },
    {
      id: "drawer4",
      title: "$NAP Investigation",
      token: "$NAP",
      articleUrl:
        "https://medium.com/@MotiBanks/this-nft-artist-stole-200k-of-the-presale-funds-and-now-his-x-account-is-private-e29e4ba4d131",
    },
    {
      id: "drawer5",
      title: "$SMOLE Investigation",
      token: "$SMOLE",
      articleUrl:
        "https://medium.com/@MotiBanks/these-crypto-bros-once-had-100m-in-their-possession-how-much-did-they-keep-a3b9cf229cd0",
    },
    {
      id: "drawer6",
      title: "$MOONKE Investigation",
      token: "$MOONKE",
      articleUrl: "https://medium.com/@MotiBanks/someone-filed-an-sec-complaint-against-him-but-who-61c97c247baf",
    },
  ]

  // Camera sway effect
  useFrame((state) => {
    if (roomRef.current) {
      // Subtle camera sway
      roomRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.02

      // Chair gentle rotation
      if (chairRef.current) {
        chairRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05
      }
    }
  })

  const handlePointerOver = (objectName: string) => {
    setHovered(objectName)
    document.body.style.cursor = "pointer"
  }

  const handlePointerOut = () => {
    setHovered(null)
    document.body.style.cursor = "auto"
  }

  // Add these handlers
  const handleCryptoImagePointerOver = (id: string) => {
    setHoveredCryptoImage(id)
    document.body.style.cursor = "pointer"
  }

  const handleFileDrawerPointerOver = (id: string) => {
    setHoveredFileDrawer(id)
    document.body.style.cursor = "pointer"
  }

  const handleCryptoImageClick = (evidence: CryptoEvidence) => {
    onShowCryptoEvidence(evidence)
  }

  const handleFileDrawerClick = (title: string, token: string, articleUrl: string) => {
    onOpenFileDrawer(title, token, articleUrl)
  }

  const handlePhoneClick = () => {
    onShowPhoneCall()
  }

  // Remove handleTraceFundsClick and onShowTraceFunds functions

  const handleDeskClick = (e: any) => {
    e.stopPropagation()
    focusOnObject([0, 1.2, -2], [0, 0.5, -3])
    onShowEvidence(deskEvidence)
  }

  const handleBulletinClick = (e: any) => {
    e.stopPropagation()
    focusOnObject([-3, 2, -2], [-4.8, 2, -2])
    onShowEvidence(bulletinEvidence)
  }

  const handleCabinetClick = (e: any) => {
    e.stopPropagation()
    focusOnObject([2, 1.5, -3], [3, 1, -4])
    onShowEvidence(cabinetEvidence)
  }

  // Get room material colors based on time of day
  const getRoomColors = () => {
    if (timeOfDay >= 18 || timeOfDay < 6) {
      // Night - darker, more noir
      return {
        floor: "#3D2C27", // Dark wood
        walls: "#1C1C24", // Very dark blue-gray
        desk: "#5B3513", // Dark wood
        chair: "#3D2C27", // Dark wood
        bulletin: "#752A2A", // Dark red
        cabinet: "#494949", // Dark gray
      }
    } else if ((timeOfDay >= 6 && timeOfDay < 9) || (timeOfDay >= 16 && timeOfDay < 18)) {
      // Morning/Evening - warmer tones
      return {
        floor: "#4D3C37", // Medium-dark wood
        walls: "#2C2C34", // Dark blue-gray
        desk: "#7B4513", // Medium wood
        chair: "#4D3C37", // Medium-dark wood
        bulletin: "#852A2A", // Medium-dark red
        cabinet: "#595959", // Medium-dark gray
      }
    } else {
      // Day - brighter, more natural
      return {
        floor: "#5D4C47", // Medium wood
        walls: "#3C3C44", // Medium blue-gray
        desk: "#8B5513", // Light wood
        chair: "#5D4C47", // Medium wood
        bulletin: "#952A2A", // Medium red
        cabinet: "#696969", // Medium gray
      }
    }
  }

  const colors = getRoomColors()

  return (
    <group ref={roomRef}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color={colors.floor} roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 2, -5]} castShadow receiveShadow>
        <boxGeometry args={[10, 4, 0.2]} />
        <meshStandardMaterial color={colors.walls} roughness={0.7} />
      </mesh>

      <mesh position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[10, 4, 0.2]} />
        <meshStandardMaterial color={colors.walls} roughness={0.7} />
      </mesh>

      <mesh position={[5, 2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[10, 4, 0.2]} />
        <meshStandardMaterial color={colors.walls} roughness={0.7} />
      </mesh>

      {/* Desk */}
      <group
        ref={deskRef}
        position={[0, 0.5, -3]}
        onClick={handleDeskClick}
        onPointerOver={() => handlePointerOver("desk")}
        onPointerOut={handlePointerOut}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2, 0.1, 1]} />
          <meshStandardMaterial color={colors.desk} roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[0.9, -0.45, 0.45]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 0.9, 0.1]} />
          <meshStandardMaterial color={colors.desk} roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[-0.9, -0.45, 0.45]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 0.9, 0.1]} />
          <meshStandardMaterial color={colors.desk} roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[0.9, -0.45, -0.45]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 0.9, 0.1]} />
          <meshStandardMaterial color={colors.desk} roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[-0.9, -0.45, -0.45]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 0.9, 0.1]} />
          <meshStandardMaterial color={colors.desk} roughness={0.6} metalness={0.1} />
        </mesh>

        {/* Desk items */}
        {/* Typewriter */}
        <mesh position={[0.5, 0.15, 0]} castShadow>
          <boxGeometry args={[0.4, 0.2, 0.3]} />
          <meshStandardMaterial color="#A9A9A9" roughness={0.7} metalness={0.5} />
        </mesh>
        <mesh position={[0.5, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
          <meshStandardMaterial color="#A9A9A9" roughness={0.5} metalness={0.7} />
        </mesh>

        {/* Coffee mug */}
        <mesh position={[-0.5, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.05, 0.15, 16]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>

        {/* Papers */}
        <mesh position={[0, 0.06, 0]} rotation={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.5, 0.01, 0.4]} />
          <meshStandardMaterial color="#F5F5DC" roughness={0.9} />
        </mesh>

        {/* Magnifying glass - Easter egg trigger */}
        <mesh
          position={[-0.7, 0.07, -0.3]}
          rotation={[0, 0.5, 0]}
          castShadow
          onClick={(e) => {
            e.stopPropagation()
            onShowEvidence(hiddenEvidence)
          }}
        >
          <torusGeometry args={[0.08, 0.01, 16, 32]} />
          <meshStandardMaterial color="#A9A9A9" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-0.7, 0.07, -0.3]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.005, 32]} />
          <meshStandardMaterial color="#CCCCFF" transparent opacity={0.7} />
        </mesh>
        <mesh position={[-0.6, 0.07, -0.2]} rotation={[Math.PI / 2, 0, 0.5]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.15, 8]} />
          <meshStandardMaterial color="#A9A9A9" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Old rotary phone */}
        <mesh position={[-0.7, 0.1, 0.3]} castShadow>
          <boxGeometry args={[0.25, 0.1, 0.15]} />
          <meshStandardMaterial color="#111111" roughness={0.7} />
        </mesh>
        <mesh position={[-0.7, 0.2, 0.3]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
          <meshStandardMaterial color="#111111" roughness={0.7} />
        </mesh>
        <mesh position={[-0.7, 0.25, 0.3]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1, 16]} />
          <meshStandardMaterial color="#111111" roughness={0.7} />
        </mesh>

        {/* Notepad with pen */}
        <mesh position={[0.7, 0.06, 0.3]} rotation={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.2, 0.02, 0.3]} />
          <meshStandardMaterial color="#F5F5DC" roughness={0.9} />
        </mesh>
        <mesh position={[0.65, 0.08, 0.3]} rotation={[0, -0.2, 0.1]} castShadow>
          <cylinderGeometry args={[0.005, 0.005, 0.15, 8]} />
          <meshStandardMaterial color="#000080" roughness={0.5} />
        </mesh>

        {/* Camera */}
        <mesh position={[0.3, 0.1, 0.3]} castShadow>
          <boxGeometry args={[0.15, 0.1, 0.1]} />
          <meshStandardMaterial color="#5D4037" roughness={0.8} />
        </mesh>
        <mesh position={[0.3, 0.1, 0.35]} castShadow>
          <cylinderGeometry args={[0.03, 0.04, 0.05, 16]} />
          <meshStandardMaterial color="#A9A9A9" roughness={0.4} metalness={0.7} />
        </mesh>

        <Text
          position={[0, 0.7, 0]}
          rotation={[0, 0, 0]}
          fontSize={0.15}
          color={hovered === "desk" ? "#ffcc66" : "#ffffff"}
          anchorX="center"
          anchorY="middle"
          font="/fonts/Geist-Bold.ttf"
        >
          Examine Desk
        </Text>
        {/* Retro phone that rings when clicked */}
        <group
          ref={phoneRef}
          position={[-0.7, 0.1, 0.3]}
          onClick={(e) => {
            e.stopPropagation()
            handlePhoneClick()
          }}
          onPointerOver={() => handlePointerOver("phone")}
          onPointerOut={handlePointerOut}
        >
          <mesh castShadow>
            <boxGeometry args={[0.25, 0.1, 0.15]} />
            <meshStandardMaterial color="#111111" roughness={0.7} />
          </mesh>
          <mesh position={[-0.1, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
            <meshStandardMaterial color="#111111" roughness={0.7} />
          </mesh>
          <mesh position={[0.1, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
            <meshStandardMaterial color="#111111" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[0.3, 0.05, 0.1]} />
            <meshStandardMaterial color="#111111" roughness={0.7} />
          </mesh>

          {/* Hover label */}
          {hovered === "phone" && (
            <Text
              position={[0, 0.3, 0]}
              fontSize={0.05}
              color="#FFFFFF"
              backgroundColor="#000000"
              padding={0.02}
              anchorX="center"
              anchorY="bottom"
            >
              SEC is calling...
            </Text>
          )}
        </group>
      </group>

      {/* Custom Vintage Chair - BEHIND DESK */}
      <group ref={chairRef} position={[0, 0, -3.8]} rotation={[0, 0, 0]}>
        {/* Chair seat */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.1, 0.6]} />
          <meshStandardMaterial color={colors.chair} roughness={0.6} />
        </mesh>

        {/* Chair back */}
        <mesh position={[0, 0.9, -0.25]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 1, 0.1]} />
          <meshStandardMaterial color={colors.chair} roughness={0.6} />
        </mesh>

        {/* Chair legs */}
        <mesh position={[0.25, 0.2, 0.25]} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
          <meshStandardMaterial color={colors.desk} roughness={0.6} />
        </mesh>
        <mesh position={[-0.25, 0.2, 0.25]} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
          <meshStandardMaterial color={colors.desk} roughness={0.6} />
        </mesh>
        <mesh position={[0.25, 0.2, -0.25]} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
          <meshStandardMaterial color={colors.desk} roughness={0.6} />
        </mesh>
        <mesh position={[-0.25, 0.2, -0.25]} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
          <meshStandardMaterial color={colors.desk} roughness={0.6} />
        </mesh>

        {/* Chair back details */}
        <mesh position={[0, 0.7, -0.25]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
          <meshStandardMaterial color={colors.desk} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.9, -0.25]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
          <meshStandardMaterial color={colors.desk} roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.1, -0.25]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
          <meshStandardMaterial color={colors.desk} roughness={0.6} />
        </mesh>

        {/* Chair cushion */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.05, 0.55]} />
          <meshStandardMaterial color="#3E2723" roughness={0.7} />
        </mesh>
      </group>

      {/* Bulletin Board with spotlight */}
      <group
        ref={bulletinRef}
        position={[-4.8, 2, -2]}
        rotation={[0, Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation()
          focusOnObject([-4.8, 2, -2], [-4.8, 2, 0])
        }}
        onPointerOver={() => handlePointerOver("bulletin")}
        onPointerOut={handlePointerOut}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2, 1.5, 0.05]} />
          <meshStandardMaterial color={colors.bulletin} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.03]} castShadow>
          <boxGeometry args={[1.9, 1.4, 0.01]} />
          <meshStandardMaterial color="#D2B48C" roughness={0.9} />
        </mesh>

        {/* Crypto founder images on the bulletin board */}
        {cryptoEvidenceData.map((evidence) => (
          <group key={evidence.id} position={evidence.position}>
            {/* Image background/frame */}
            <mesh
              castShadow
              onClick={(e) => {
                e.stopPropagation()
                handleCryptoImageClick(evidence)
              }}
              onPointerOver={() => handleCryptoImagePointerOver(evidence.id)}
              onPointerOut={handlePointerOut}
            >
              <boxGeometry args={[0.3, 0.3, 0.01]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
            </mesh>

            {/* Image (using a plane with texture) */}
            <mesh
              position={[0, 0, 0.01]}
              onClick={(e) => {
                e.stopPropagation()
                handleCryptoImageClick(evidence)
              }}
              onPointerOver={() => handleCryptoImagePointerOver(evidence.id)}
              onPointerOut={handlePointerOut}
            >
              <planeGeometry args={[0.28, 0.28]} />
              <meshBasicMaterial map={null} color="#CCCCCC" />{" "}
              {/* Placeholder color, textures would be loaded dynamically */}
            </mesh>

            {/* Red pin */}
            <mesh position={[0, 0.15, 0.02]} castShadow>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshStandardMaterial color="#FF0000" />
            </mesh>

            {/* Hover label */}
            {hoveredCryptoImage === evidence.id && (
              <Text
                position={[0, 0.25, 0.05]}
                fontSize={0.05}
                color="#FFFFFF"
                backgroundColor="#000000"
                padding={0.02}
                anchorX="center"
                anchorY="bottom"
              >
                {evidence.title}
              </Text>
            )}
          </group>
        ))}

        {/* Red strings connecting pins */}
        <mesh position={[-0.2, 0.05, 0.05]} castShadow>
          <boxGeometry args={[0.7, 0.002, 0.002]} />
          <meshStandardMaterial color="#FF0000" />
        </mesh>
        <mesh position={[0.25, 0.1, 0.05]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <boxGeometry args={[0.5, 0.002, 0.002]} />
          <meshStandardMaterial color="#FF0000" />
        </mesh>
        <mesh position={[0.1, 0.3, 0.05]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <boxGeometry args={[0.6, 0.002, 0.002]} />
          <meshStandardMaterial color="#FF0000" />
        </mesh>
        <mesh position={[-0.3, -0.1, 0.05]} rotation={[0, 0, Math.PI / 6]} castShadow>
          <boxGeometry args={[0.8, 0.002, 0.002]} />
          <meshStandardMaterial color="#FF0000" />
        </mesh>

        {/* Spotlight for bulletin board */}
        <spotLight
          position={[0, 1.5, 1]}
          angle={0.5}
          penumbra={0.5}
          intensity={lampLightIntensity * 0.6}
          castShadow
          target-position={[0, 0, 0]}
          color="#ffffcc"
        />

        <Text
          position={[0, 0.9, 0.1]}
          rotation={[0, 0, 0]}
          fontSize={0.15}
          color={hovered === "bulletin" ? "#ffcc66" : "#ffffff"}
          anchorX="center"
          anchorY="middle"
          font="/fonts/Geist-Bold.ttf"
        >
          Examine Board
        </Text>
      </group>

      {/* Filing Cabinet */}
      <group
        ref={cabinetRef}
        position={[3, 1, -4]}
        onClick={(e) => {
          e.stopPropagation()
          focusOnObject([3, 1, -4], [3, 1, -3])
        }}
        onPointerOver={() => handlePointerOver("cabinet")}
        onPointerOut={handlePointerOut}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1, 2.5, 0.8]} />
          <meshStandardMaterial color={colors.cabinet} roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Drawers - Adjusted spacing to fit all 6 drawers */}
        {fileDrawers.map((drawer, index) => (
          <group key={drawer.id} position={[0, 0.9 - index * 0.3, 0.41]}>
            <mesh
              castShadow
              onClick={(e) => {
                e.stopPropagation()
                handleFileDrawerClick(drawer.title, drawer.token, drawer.articleUrl)
              }}
              onPointerOver={() => handleFileDrawerPointerOver(drawer.id)}
              onPointerOut={handlePointerOut}
            >
              <boxGeometry args={[0.9, 0.1, 0.02]} />
              <meshStandardMaterial color="#A9A9A9" roughness={0.4} metalness={0.6} />
            </mesh>

            {/* Handle */}
            <mesh
              position={[0, 0, 0.01]}
              castShadow
              onClick={(e) => {
                e.stopPropagation()
                handleFileDrawerClick(drawer.title, drawer.token, drawer.articleUrl)
              }}
              onPointerOver={() => handleFileDrawerPointerOver(drawer.id)}
              onPointerOut={handlePointerOut}
            >
              <boxGeometry args={[0.2, 0.05, 0.05]} />
              <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Hover label */}
            {hoveredFileDrawer === drawer.id && (
              <Text
                position={[0, 0.15, 0.1]}
                fontSize={0.05}
                color="#FFFFFF"
                backgroundColor="#000000"
                padding={0.02}
                anchorX="center"
                anchorY="bottom"
              >
                {drawer.token}
              </Text>
            )}
          </group>
        ))}

        {/* Add spotlight for the filing cabinet */}
        <spotLight
          position={[1, 2, 1]}
          angle={0.6}
          penumbra={0.5}
          intensity={lampLightIntensity * 0.5}
          castShadow
          target-position={[3, 1, -4]}
          color="#ffffcc"
        />

        <Text
          position={[0, 1.4, 0]}
          rotation={[0, 0, 0]}
          fontSize={0.15}
          color={hovered === "cabinet" ? "#ffcc66" : "#ffffff"}
          anchorX="center"
          anchorY="middle"
          font="/fonts/Geist-Bold.ttf"
        >
          Examine Files
        </Text>
      </group>

      {/* Phone on the wall */}
      <group
        ref={phoneRef}
        position={[4.8, 2.5, -2]}
        rotation={[0, -Math.PI / 2, 0]}
        onClick={handlePhoneClick}
        onPointerOver={() => handlePointerOver("phone")}
        onPointerOut={handlePointerOut}
      >
        <mesh castShadow>
          <boxGeometry args={[0.2, 0.4, 0.1]} />
          <meshStandardMaterial color="#222222" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
          <meshStandardMaterial color="#222222" roughness={0.7} />
        </mesh>
        <Text
          position={[0, 0.4, 0]}
          rotation={[0, 0, 0]}
          fontSize={0.1}
          color={hovered === "phone" ? "#ffcc66" : "#ffffff"}
          anchorX="center"
          anchorY="middle"
          font="/fonts/Geist-Bold.ttf"
        >
          Answer Phone
        </Text>
      </group>

      {/* Window with realistic glass and rain effect - RAIN ONLY OUTSIDE */}
      <group ref={windowRef} position={[0, 2, -4.9]}>
        {/* Window frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2, 1.5, 0.1]} />
          <meshStandardMaterial color="#8B4513" roughness={0.7} />
        </mesh>

        {/* Window glass - slightly transparent to see outside */}
        <mesh position={[0, 0, 0.05]} castShadow>
          <boxGeometry args={[1.8, 1.3, 0.05]} />
          <meshStandardMaterial
            color="#1a1a2e"
            transparent
            opacity={0.7}
            roughness={0.1}
            metalness={0.3}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* Window light - changes based on time of day */}
        <pointLight
          position={[0, 0, 1]}
          intensity={windowLightIntensity}
          distance={5}
          color={timeOfDay >= 18 || timeOfDay < 6 ? "#2a2a4a" : "#e0e8ff"}
        />

        {/* Window rain streaks - only on the glass surface */}
        {Array.from({ length: 15 }).map((_, i) => (
          <mesh key={i} position={[-0.8 + i * 0.12, Math.sin(i * 0.5) * 0.3, 0.06]} castShadow>
            <boxGeometry args={[0.02, 0.8 + Math.random() * 0.5, 0.01]} />
            <meshStandardMaterial color="#a0a0ff" transparent opacity={0.3} roughness={0.1} metalness={0.2} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
