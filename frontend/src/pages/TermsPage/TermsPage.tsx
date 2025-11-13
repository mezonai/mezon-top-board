import MtbTypography from '@app/mtb-ui/Typography/Typography'
import type { ReactNode } from 'react'

type Props = {
  title: string
  children?: ReactNode
}

function TermsPage() {
  const Section = ({ title, children }: Props) => (
    <div className='mt-8'>
      <MtbTypography variant='h3'>{title}</MtbTypography>
      <div className='mt-2 space-y-2'>{children}</div>
    </div>
  )

  const SubSection = ({ title, children }: Props) => (
    <div className='mt-4'>
      <MtbTypography variant='h5'>{title}</MtbTypography>
      <div className='mt-2'>{children}</div>
    </div>
  )
  const insertDate = '2025-03-07'
  const insertJurisdiction = '.....'
  const contactEmail = 'mezon@....'
  return (
    <div className='pt-8 pb-12 w-[75%] m-auto'>
      <MtbTypography variant='h1'>Terms of Service</MtbTypography>
      <p>Last Updated: {insertDate}</p>
      <p>
        Welcome to Mezon Top Board! These Terms and Conditions ("Terms") govern your access to and use of our platform,
        including all related services, content, and features. By using Mezon Top Board, you agree to comply with these
        Terms. If you do not agree, please discontinue use immediately.
      </p>
      <Section title='1. Definitions'>
        <ul className='list-disc ml-10'>
          <li>"Platform" refers to Mezon Top Board, its website, applications, and all related services.</li>
          <li>"User" refers to any individual or entity accessing or using Mezon Top Board.</li>
          <li>"Developer" refers to individuals or entities submitting applications for listing on Mezon Top Board.</li>
          <li>"Content" includes all text, images, videos, applications, and other material available on the platform.</li>
        </ul>
      </Section>
      <Section title='2. Use of the Platform'>
        <SubSection title='2.1 Eligibility'>
          <p>
            You must be at least 18 years old to use Mezon Top Board. By using the platform, you confirm that you meet
            this requirement.
          </p>
        </SubSection>
        <SubSection title='2.2 Account Registration'>
          <ul className='list-disc ml-10'>
            <li>Some features may require account registration.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>Mezon Top Board reserves the right to suspend or terminate accounts violating these Terms.</li>
          </ul>
        </SubSection>
        <SubSection title='2.3 Acceptable Use'>
          <p>By using Mezon Top Board, you agree NOT to:</p>
          <ul className='list-disc ml-10'>
            <li>Violate any applicable laws or regulations.</li>
            <li>Submit false or misleading information.</li>
            <li>Engage in harmful, abusive, or fraudulent activities.</li>
            <li>Attempt to disrupt or compromise the platform’s security.</li>
          </ul>
        </SubSection>
      </Section>
      <Section title='3. Application Listings'>
        <SubSection title='3.1 Submission Guidelines'>
          <ul className='list-disc ml-10'>
            <li>Developers must ensure their applications comply with Mezon’s technical and ethical guidelines.</li>
            <li>Mezon Top Board reserves the right to accept, reject, or remove listings at its discretion.</li>
          </ul>
        </SubSection>
        <SubSection title='3.2 Intellectual Property Rights'>
          <ul className='list-disc ml-10'>
            <li>Developers retain ownership of their applications.</li>
            <li>
              By submitting an application, developers grant Mezon Top Board a license to display and promote their
              content.
            </li>
          </ul>
        </SubSection>
      </Section>
      <Section title='4. Content Ownership and Copyright'>
        <ul className='list-disc ml-10'>
          <li>Mezon Top Board respects intellectual property rights.</li>
          <li>Users and developers must ensure they have the rights to any content they submit.</li>
          <li>Unauthorized use of copyrighted material may result in account suspension or legal action.</li>
        </ul>
      </Section>
      <Section title='5. Disclaimers and Limitation of Liability'>
        <ul className='list-disc ml-10'>
          <li>Mezon Top Board provides information "as is" without warranties of any kind.</li>
          <li>We do not guarantee the accuracy, reliability, or availability of listed applications.</li>
          <li>
            Mezon Top Board is not responsible for any direct, indirect, incidental, or consequential damages arising
            from the use of the platform.
          </li>
        </ul>
      </Section>
      <Section title='6. Privacy Policy'>
        <ul className='list-disc ml-10'>
          <li>
            By using Mezon Top Board, you consent to our data collection and usage practices as outlined in our Privacy
            Policy.
          </li>
          <li>We do not sell user data to third parties</li>
        </ul>
      </Section>
      <Section title='7. Modifications to Terms'>
        <p>
          Mezon Top Board reserves the right to modify these Terms at any time. Users will be notified of significant
          changes, and continued use of the platform constitutes acceptance of the revised Terms.
        </p>
      </Section>
      <Section title='8. Termination of Services'>
        <p>
          Mezon Top Board may suspend or terminate services at its discretion, with or without notice, for users
          violating these Terms.
        </p>
      </Section>
      <Section title='9. Governing Law'>
        <p>These Terms shall be governed by and construed in accordance with the laws of {insertJurisdiction}.</p>
      </Section>
      <Section title='10. Contact Information'>
        <p>For any questions regarding these Terms, please contact us at {contactEmail}.</p>
      </Section>
    </div>
  )
}

export default TermsPage
