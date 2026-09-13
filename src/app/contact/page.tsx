export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-4">Contact</h1>
      <p className="text-muted text-lg mb-10">
        프로젝트 문의나 협업 제안은 아래로 연락해 주세요.
      </p>

      <div className="space-y-6">
        <div className="flex items-center gap-4 p-6 bg-card-bg rounded-xl border border-border">
          <svg
            className="w-6 h-6 text-muted shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <div>
            <p className="text-sm text-muted">Email</p>
            <p className="font-medium">contact@sunghoonlee.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
