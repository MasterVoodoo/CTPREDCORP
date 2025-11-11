interface SustainabilityPlaceholderProps {
  title: string;
  onBack?: () => void;
}

export default function SustainabilityPlaceholder({ title, onBack }: SustainabilityPlaceholderProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-8 flex items-center text-primary hover:text-accent transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        )}

        {/* Main content */}
        <div className="text-center">
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {title}
          </h1>

          {/* Subtitle */}
          <h2 className="text-xl text-gray-600 mb-8">
            Content coming soon
          </h2>

          {/* Body text */}
          <p className="text-gray-700 text-lg max-w-2xl mx-auto leading-relaxed">
            This is a placeholder page for {title}. The final content will be added later.
          </p>

          {/* Optional decorative element */}
          <div className="mt-12">
            <div className="w-24 h-1 bg-primary mx-auto rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}