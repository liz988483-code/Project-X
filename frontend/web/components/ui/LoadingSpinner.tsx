export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 z-50">
      {/* Animated Logo Container */}
      <div className="relative mb-8">
        {/* Outer glow effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
        
        {/* Main logo container */}
        <div className="relative w-24 h-24 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x opacity-10"></div>
          
          {/* Shopping cart icon */}
          <div className="relative z-10">
            <svg 
              className="w-12 h-12 text-gradient-to-r from-blue-600 to-purple-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1.5" 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
          </div>
          
          {/* Rotating ring */}
          <div className="absolute inset-0 border-2 border-transparent border-t-blue-500 rounded-2xl animate-spin"></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full animate-bounce"></div>
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute -top-3 left-1/3 w-2 h-2 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
      
      {/* Loading text with gradient */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
          SOKO Marketplace
        </h2>
        <p className="text-gray-500 font-medium">Crafting your shopping experience</p>
      </div>
      
      {/* Progress dots */}
      <div className="mt-8 flex space-x-2">
        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-pink-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
      </div>
      
      {/* Subtle footer text */}
      <p className="absolute bottom-8 text-xs text-gray-400">
        Loading your personalized shopping journey
      </p>
    </div>
  )
}