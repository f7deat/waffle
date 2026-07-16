import PageContainer from '@/components/layout/page-container';
import { Metadata } from 'next';
import ContactClient from './client';

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ với chúng tôi để biết thêm thông tin hoặc hỗ trợ. Chúng tôi luôn sẵn sàng lắng nghe ý kiến của bạn.",
};

export default function ContactPage() {

  return (
    <PageContainer breadcrumbs={[
      {
        label: 'Liên hệ',
        href: '/contact'
      }
    ]}>
      <div className="mx-auto container px-4 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            Get in Touch
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Have a question or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        <ContactClient />
      </div>
    </PageContainer>
  );
}
