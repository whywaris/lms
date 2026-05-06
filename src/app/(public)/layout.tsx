import AnnouncementBar from '@/components/ui/AnnouncementBar'
import BackToTop from '@/components/ui/BackToTop'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AnnouncementBar />
      {children}
      <BackToTop />
    </>
  )
}
