/**
 * Branding Panel Component
 *
 * Left side of split-screen auth layout with branding information.
 * Hidden on mobile, visible on lg+ screens.
 */

export function AuthBrandingPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12"
         style={{
           background: 'linear-gradient(135deg, #0284C7 0%, #075985 100%)'
         }}>
      {/* Floating animated circles */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[floating_6s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[floating_6s_ease-in-out_infinite]"
           style={{ animationDelay: '2s' }}></div>

      {/* Logo and branding content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Glassmorphism logo container */}
        <div className="mb-8 p-6 rounded-[40px] shadow-2xl"
             style={{
               background: 'rgba(255, 255, 255, 0.1)',
               backdropFilter: 'blur(10px)',
               border: '1px solid rgba(255, 255, 255, 0.2)'
             }}>
          {/* Layered squares logo icon */}
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-6xl font-black text-white tracking-tighter mb-4">ECONTACT</h1>

        {/* Decorative line */}
        <div className="h-1.5 w-24 bg-white/30 rounded-full mb-6"></div>

        {/* Description */}
        <p className="text-blue-100 text-xl font-medium max-w-md leading-relaxed">
          Hệ thống Quản lý Sổ liên lạc điện tử <br />
          Dành cho Cán bộ quản lý & Giáo viên
        </p>

        {/* Feature badges */}
        <div className="mt-12 flex gap-4">
          <div className="px-6 py-3 rounded-2xl text-white text-sm font-semibold"
               style={{
                 background: 'rgba(255, 255, 255, 0.1)',
                 backdropFilter: 'blur(10px)',
                 border: '1px solid rgba(255, 255, 255, 0.2)'
               }}>
            Trực quan
          </div>
          <div className="px-6 py-3 rounded-2xl text-white text-sm font-semibold"
               style={{
                 background: 'rgba(255, 255, 255, 0.1)',
                 backdropFilter: 'blur(10px)',
                 border: '1px solid rgba(255, 255, 255, 0.2)'
               }}>
            Chính xác
          </div>
          <div className="px-6 py-3 rounded-2xl text-white text-sm font-semibold"
               style={{
                 background: 'rgba(255, 255, 255, 0.1)',
                 backdropFilter: 'blur(10px)',
                 border: '1px solid rgba(255, 255, 255, 0.2)'
               }}>
            Bảo mật
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="absolute bottom-10 left-12 text-blue-200/50 text-xs font-bold tracking-widest uppercase">
        © 2026 Project 2 - ĐẠI HỌC BÁCH KHOA HÀ NỘI
      </div>

      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes floating {
          0% {
            transform: translate(0, 0px);
          }
          50% {
            transform: translate(0, 15px);
          }
          100% {
            transform: translate(0, -0px);
          }
        }
      `}</style>
    </div>
  )
}
