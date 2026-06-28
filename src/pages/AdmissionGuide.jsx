import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import EduAnimation from '../components/EduAnimation';
import { publicUniversities, privateUniversities, semiGovtUniversities, getUniversityBySlug, getUniversityLogo } from '../data/universities';
import Campus3DModel from '../components/Campus3DModel';
import UniversityCard from '../components/UniversityCard';

export default function AdmissionGuide() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const getSectorBadge = (uni) => {
    if (publicUniversities.some(u => u.id === uni.id)) return 'Public Sector';
    if (semiGovtUniversities.some(u => u.id === uni.id)) return 'Semi-Government';
    return 'Private Sector';
  };

  // INDIVIDUAL UNI PAGE
  if (slug) {
    const uni = getUniversityBySlug(slug);

    if (!uni) {
      return (
        <div className="text-center py-20 bg-cloudy dark:bg-maqsadNavy min-h-screen text-ink dark:text-white flex flex-col items-center justify-center space-y-4">
          <h2 className="text-xl font-bold">Guide Not Found</h2>
          <Link to="/admission-guide" className="text-gold font-semibold underline mt-2 inline-block">Back to Guides</Link>
        </div>
      );
    }

    return (
      <div className="py-6 flex flex-col space-y-6 text-sm md:text-base">
        {/* Back Button */}
        <div>
          <button
            onClick={() => navigate('/admission-guide')}
            className="text-[11px] font-bold text-ink hover:text-gold transition-colors flex items-center gap-1 focus:outline-none"
          >
            ← Back to Landing
          </button>
        </div>

        {/* Header Block */}
        <div className="bg-white dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none text-ink dark:text-white">
          <div className="flex items-center gap-4">
            <img 
              src={getUniversityLogo(uni.id)} 
              alt={`${uni.name} Logo`} 
              className="w-16 h-16 md:w-20 md:h-20 object-contain bg-white rounded-2xl p-2 border border-border/50 shadow-md"
            />
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-ink dark:text-white leading-tight">{uni.name}</h2>
              <span className="inline-block mt-2 px-2.5 py-1 bg-gold text-white text-xs font-bold uppercase tracking-wider rounded">
                {getSectorBadge(uni)}
              </span>
            </div>
          </div>
          <EduAnimation type="guide" />
        </div>

        {/* Text Content Sections with 3-column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-ink dark:text-white">
          <div className="lg:col-span-2 space-y-4">
            {/* Eligibility */}
            <div className="bg-white dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl p-5">
              <h3 className="text-base md:text-lg font-bold text-ink dark:text-white mb-2.5 pb-1 border-b border-border dark:border-white/10 uppercase tracking-wider">Eligibility</h3>
              <p className="text-muted dark:text-gray-400 leading-relaxed text-sm md:text-base">
                Applicants must hold a minimum of 60% marks in SSC (Matriculation) or equivalent O-Level, and a minimum of 60% (or 50% for select engineering domains) in HSSC (Intermediate Pre-Engineering, Pre-Medical, or ICS). A valid score in {uni.entryTest} is mandatory for competitive selection.
              </p>
            </div>

            {/* Required Documents */}
            <div className="bg-white dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl p-5">
              <h3 className="text-base md:text-lg font-bold text-ink dark:text-white mb-2.5 pb-1 border-b border-border dark:border-white/10 uppercase tracking-wider">Required Documents</h3>
              <ul className="list-disc list-inside text-sm md:text-base text-muted dark:text-gray-400 space-y-1.5 leading-relaxed">
                <li>Attested copies of Matric / O-Level marksheet and certificates.</li>
                <li>Attested copies of Intermediate / A-Level marksheet.</li>
                <li>IBCC equivalence certificate (for foreign qualifications).</li>
                <li>CNIC / B-Form and Father's CNIC copies.</li>
                <li>Original paid bank deposit receipt of application processing fee.</li>
                <li>4 passport-sized photographs with blue background.</li>
              </ul>
            </div>

            {/* Fee Structure */}
            <div className="bg-white dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl p-5">
              <h3 className="text-base md:text-lg font-bold text-ink dark:text-white mb-2.5 pb-1 border-b border-border dark:border-white/10 uppercase tracking-wider">Fee Structure</h3>
              <p className="text-sm md:text-base text-muted dark:text-gray-400 leading-relaxed">
                The semester fee for undergraduate programs is approximately <strong>Rs. {uni.feePerSemester.toLocaleString()}</strong> per semester. Admission fee (one-time) and a refundable security deposit of Rs. 10,000–20,000 are payable during initial enrollment.
              </p>
            </div>

            {/* Hostel */}
            <div className="bg-white dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl p-5">
              <h3 className="text-base md:text-lg font-bold text-ink dark:text-white mb-2.5 pb-1 border-b border-border dark:border-white/10 uppercase tracking-wider">Hostel Accommodation</h3>
              <p className="text-sm md:text-base text-muted dark:text-gray-400 leading-relaxed">
                On-campus residential facilities are available for outstation students on a first-come, first-served merit basis. Hostel charges range between Rs. 15,000 to Rs. 25,000 per semester (excluding food).
              </p>
            </div>

            {/* How to Apply */}
            <div className="bg-white dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl p-5">
              <h3 className="text-base md:text-lg font-bold text-ink dark:text-white mb-2.5 pb-1 border-b border-border dark:border-white/10 uppercase tracking-wider">How to Apply</h3>
              <ol className="list-decimal list-inside text-sm md:text-base text-muted dark:text-gray-400 space-y-1.5 leading-relaxed">
                <li>Create an account on the official university undergraduate admission portal.</li>
                <li>Fill out the personal profile and educational credentials.</li>
                <li>Select your preferred degree programs and upload required documents.</li>
                <li>Generate the application fee challan, deposit it, and upload the paid copy.</li>
                 <li>Submit the application online and track status on the portal dashboard.</li>
              </ol>
            </div>

            {/* Contact */}
            <div className="bg-white dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-xl p-5">
              <h3 className="text-base md:text-lg font-bold text-ink dark:text-white mb-2.5 pb-1 border-b border-border dark:border-white/10 uppercase tracking-wider">Contact Information</h3>
              <p className="text-sm md:text-base text-muted dark:text-gray-400 leading-relaxed">
                <strong>Admissions Office:</strong> {uni.name}, {uni.city}, Pakistan. <br />
                <strong>Phone:</strong> +92 (51) 111-222-333 | <strong>Email:</strong> admissions@{uni.id}.edu.pk
              </p>
            </div>
          </div>

          {/* 3D Model in Right Sidebar Column */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-white/[0.02] border border-border dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg">
              <h3 className="text-base font-bold text-ink dark:text-white mb-4 pb-2 border-b border-border dark:border-white/10 uppercase tracking-wider w-full">3D Campus Model</h3>
              <div className="w-full h-64 flex items-center justify-center">
                <Campus3DModel colorHex={uni.colorHex} uniId={uni.id} />
              </div>
              <p className="text-xs text-muted mt-4 leading-relaxed font-semibold">
                Interactive 3D representation of the official {uni.shortName} emblem. Click & drag horizontally to orbit.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LANDING PAGE
  return (
    <div className="py-6 flex flex-col space-y-8 text-[13px]">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-2xl mx-auto w-full text-center md:text-left relative z-10 select-none">
        <div className="space-y-2 flex-1">
          <h2 className="text-xl md:text-2xl font-extrabold text-ink dark:text-white uppercase tracking-wide">Admission Guides</h2>
          <p className="text-[12px] text-muted dark:text-gray-400 max-w-md">Click on any university below to read the comprehensive admission guide.</p>
        </div>
        <EduAnimation type="guide" />
      </div>

      {/* 1. Public Sector Section */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center pl-3 border-l-[3px] border-l-gold select-none">
          <h3 className="text-[13px] font-medium text-ink dark:text-white leading-none uppercase tracking-wide">Public Sector</h3>
          <span className="text-[11px] text-muted dark:text-gray-400 font-bold ml-2">({publicUniversities.length} Guides)</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {publicUniversities.map(uni => (
            <Tilt key={uni.id} tiltMaxAngleX={12} tiltMaxAngleY={12} scale={1.03} transitionSpeed={2000}>
              <UniversityCard
                university={uni}
                onClick={() => navigate(`/admission-guide/${uni.slug}`)}
              />
            </Tilt>
          ))}
        </div>
      </div>

      {/* 2. Private Sector Section */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center pl-3 border-l-[3px] border-l-gold select-none">
          <h3 className="text-[13px] font-medium text-ink dark:text-white leading-none uppercase tracking-wide">Private Sector</h3>
          <span className="text-[11px] text-muted dark:text-gray-400 font-bold ml-2">({privateUniversities.length} Guides)</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {privateUniversities.map(uni => (
            <Tilt key={uni.id} tiltMaxAngleX={12} tiltMaxAngleY={12} scale={1.03} transitionSpeed={2000}>
              <UniversityCard
                university={uni}
                onClick={() => navigate(`/admission-guide/${uni.slug}`)}
              />
            </Tilt>
          ))}
        </div>
      </div>

      {/* 3. Semi-Government Section */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center pl-3 border-l-[3px] border-l-gold select-none">
          <h3 className="text-[13px] font-medium text-ink dark:text-white leading-none uppercase tracking-wide">Semi-Government</h3>
          <span className="text-[11px] text-muted dark:text-gray-400 font-bold ml-2">({semiGovtUniversities.length} Guides)</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-xl">
          {semiGovtUniversities.map(uni => (
            <Tilt key={uni.id} tiltMaxAngleX={12} tiltMaxAngleY={12} scale={1.03} transitionSpeed={2000}>
              <UniversityCard
                university={uni}
                onClick={() => navigate(`/admission-guide/${uni.slug}`)}
              />
            </Tilt>
          ))}
        </div>
      </div>
    </div>
  );
}
