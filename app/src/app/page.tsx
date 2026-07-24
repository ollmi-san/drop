import { AvatarStage }  from '@/components/AvatarStage'
import { GenderToggle } from '@/components/GenderToggle'

export default function Home() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden' }}>

      {/* ── 3D Stage — fills full viewport ── */}
      <AvatarStage />

      {/* ── Header — floats above canvas ── */}
      <header style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 24px',
        background: 'rgba(245,240,234,0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        zIndex: 50,
      }}>
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '0.12em', color: '#1a1a1a' }}>
            DROP.
          </div>
          <div style={{ fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginTop: 2 }}>
            Dein Style. Dein Avatar.
          </div>
        </div>
        <GenderToggle />
      </header>

    </div>
  )
}
