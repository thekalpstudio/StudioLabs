import React, { forwardRef } from "react";
import Image from "next/image";

// Types
interface CertificateProps {
  name?: string;
  description?: string;
  signature?: string;
  role?: string;
  hash?: string;
  logoSrc?: string;
  date?: string;
}

// Sub-components
const CornerDesign: React.FC = () => (
  <div className="absolute top-0 right-0 w-48 h-48">
    <div className="absolute top-0 right-0 w-full h-full">
      <div className="absolute top-0 right-0 w-full h-full bg-emerald-800 rounded-bl-full" />
      <div className="absolute top-2 right-2 w-full h-full bg-yellow-400 rounded-bl-full opacity-80" />
      <div className="absolute top-4 right-4 w-full h-full bg-emerald-800 rounded-bl-full" />
    </div>
  </div>
);

const CertificateSeal: React.FC = () => (
  <div className="w-16 h-16 relative">
    <div className="absolute inset-0 bg-yellow-400 rounded-full" />
    <div className="absolute inset-2 bg-emerald-800 rounded-full">
      <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full" />
    </div>
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-8 bg-emerald-800" />
  </div>
);

const Header: React.FC = () => (
  <div className="flex items-center gap-4 mb-8">
    <CertificateSeal />
    <div>
      <h1 className="text-5xl font-serif text-emerald-800">CERTIFICATE</h1>
      <p className="text-2xl text-emerald-800 mt-1">OF APPRECIATION</p>
    </div>
  </div>
);

const DateSection: React.FC<{ date: string }> = ({ date }) => (
  <div className="pt-4">
    <p className="text-gray-700">Awarded on</p>
    <p className="text-emerald-800 font-medium mt-1">{date}</p>
    <div className="w-48 h-px bg-yellow-400 mx-auto mt-2" />
  </div>
);

const SignatureSection: React.FC<{ signature: string; role: string }> = ({ signature, role }) => (
  <div className="pt-8 pb-8">
    <div className="inline-block">
      <p className="font-script text-3xl text-emerald-800">{signature}</p>
      <div className="w-full h-px bg-gray-400 mt-2" />
      <p className="text-gray-600 mt-1">{role}</p>
    </div>
  </div>
);

const BottomCorner: React.FC = () => (
  <div className="absolute bottom-0 left-0 w-32 h-32">
    <div className="absolute bottom-0 left-0 w-full h-full">
      <div className="absolute bottom-0 left-0 w-full h-full bg-yellow-400 rounded-tr-full opacity-80 transform -scale-x-100" />
    </div>
  </div>
);

const Footer: React.FC<{ hash?: string; logoSrc: string }> = ({ hash, logoSrc }) => (
  <div className="absolute bottom-8 w-full left-0 px-8 flex justify-between items-end">
    <div className="text-sm text-gray-600">
      {hash && <p>ID: {hash}</p>}
    </div>
    <div className="h-16 w-24 relative">
      <Image
        src={logoSrc}
        alt="Certificate Logo"
        fill
        className="object-contain"
      />
    </div>
  </div>
);

const Certificate = forwardRef<HTMLDivElement, CertificateProps>(({
  name = "",
  description,
  signature = "Mrityunjaya Prajapati",
  role = "CTO & CEO",
  hash,
  logoSrc = "/KalpStudio.svg",
  date = new Date().toLocaleDateString()
}, ref) => {
  const defaultDescription = "In recognition of your outstanding achievements and unwavering dedication. Your exceptional performance and commitment have significantly contributed to our success, and we honor your contributions with this award.";

  return (
    <div ref={ref} className="w-full max-w-4xl mx-auto relative bg-white p-8 shadow-lg">
      <CornerDesign />

      <div className="relative z-10 pt-8">
        <Header />

        <div className="text-center space-y-8">
          <p className="text-gray-700 text-xl">This certificate is proudly presented to:</p>
          
          <div className="py-4">
            <h2 className="text-4xl font-script text-emerald-800">{name}</h2>
            <div className="w-2/3 h-px bg-yellow-400 mx-auto mt-2" />
          </div>

          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {description || defaultDescription}
          </p>

          <DateSection date={date} />
          <SignatureSection signature={signature} role={role} />
        </div>
      </div>

      <BottomCorner />
      <Footer hash={hash} logoSrc={logoSrc} />
    </div>
  );
});

Certificate.displayName = "Certificate";

export default Certificate;