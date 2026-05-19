import AnnouncementBar from '@/components/ui/AnnouncementBar'
import BackToTop from '@/components/ui/BackToTop'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AnnouncementBar />
      {children}
      <WhatsAppButton />
      <BackToTop />
    </>
  )
}