import HeroSection from './HeroSection'
import RichTextSection from './RichTextSection'
import FeatureGridSection from './FeatureGridSection'
import ServiceGridSection from './ServiceGridSection'
import ProgramGridSection from './ProgramGridSection'
import TeamGridSection from './TeamGridSection'
import ImageWithTextSection from './ImageWithTextSection'
import StatBandSection from './StatBandSection'
import QuoteBandSection from './QuoteBandSection'
import TestimonialCarouselSection from './TestimonialCarouselSection'
import FaqSection from './FaqSection'
import CtaBandSection from './CtaBandSection'
import NewsletterSignupSection from './NewsletterSignupSection'
import LogoCloudSection from './LogoCloudSection'
import VideoEmbedSection from './VideoEmbedSection'
import ProcessStepsSection from './ProcessStepsSection'
import AccordionSection from './AccordionSection'
import BlogTeaserSection from './BlogTeaserSection'
import GallerySection from './GallerySection'
import TwoColumnTextSection from './TwoColumnTextSection'

interface SectionRendererProps {
  sections: any[]
}

function Section({ section }: { section: any }) {
  switch (section._type) {
    case 'section.hero':
      return <HeroSection section={section} />
    case 'section.richText':
      return <RichTextSection section={section} />
    case 'section.featureGrid':
      return <FeatureGridSection section={section} />
    case 'section.serviceGrid':
      return <ServiceGridSection section={section} />
    case 'section.programGrid':
      return <ProgramGridSection section={section} />
    case 'section.teamGrid':
      return <TeamGridSection section={section} />
    case 'section.imageWithText':
      return <ImageWithTextSection section={section} />
    case 'section.statBand':
      return <StatBandSection section={section} />
    case 'section.quoteBand':
      return <QuoteBandSection section={section} />
    case 'section.testimonialCarousel':
      return <TestimonialCarouselSection section={section} />
    case 'section.faqSection':
      return <FaqSection section={section} />
    case 'section.ctaBand':
      return <CtaBandSection section={section} />
    case 'section.newsletterSignup':
      return <NewsletterSignupSection section={section} />
    case 'section.logoCloud':
      return <LogoCloudSection section={section} />
    case 'section.videoEmbed':
      return <VideoEmbedSection section={section} />
    case 'section.processSteps':
      return <ProcessStepsSection section={section} />
    case 'section.accordion':
      return <AccordionSection section={section} />
    case 'section.blogTeaser':
      return <BlogTeaserSection section={section} />
    case 'section.gallery':
      return <GallerySection section={section} />
    case 'section.twoColumnText':
      return <TwoColumnTextSection section={section} />
    default:
      return null
  }
}

export default function SectionRenderer({ sections }: SectionRendererProps) {
  if (!sections?.length) return null
  return (
    <>
      {sections.map((section) => (
        <Section key={section._key} section={section} />
      ))}
    </>
  )
}
